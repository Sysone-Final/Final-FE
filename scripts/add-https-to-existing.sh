#!/bin/bash

# 기존 배포에 HTTPS 추가 스크립트
# 도메인: sysonetaskmanager.store

set -e

DOMAIN="serverway.shop"
EMAIL="admin@serverway.shop"  # 실제 이메일로 변경해주세요

echo "🔒 기존 배포에 HTTPS 추가 중..."
echo "도메인: $DOMAIN"

# 1. 기존 컨테이너 중지
echo "🛑 기존 컨테이너 중지 중..."
sudo docker-compose down || true

# 2. Certbot 설치 (아직 설치되지 않은 경우)
echo "🔧 Certbot 설치 확인 중..."
if ! command -v certbot &> /dev/null; then
    sudo apt update
    sudo apt install -y certbot python3-certbot-nginx
fi

# 3. Nginx 설치 (SSL 인증서 발급용)
echo "🌐 Nginx 설치 확인 중..."
if ! command -v nginx &> /dev/null; then
    sudo apt install -y nginx
fi

# 4. 임시 웹서버 설정 (도메인 검증용)
echo "🌍 도메인 검증을 위한 임시 서버 설정 중..."
sudo mkdir -p /var/www/html
echo "Domain verification for $DOMAIN" | sudo tee /var/www/html/index.html

sudo tee /etc/nginx/sites-available/temp-ssl > /dev/null <<EOL
server {
    listen 80;
    server_name $DOMAIN;
    root /var/www/html;
    
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    location / {
        try_files \$uri \$uri/ =404;
    }
}
EOL

# 기존 설정 백업 및 임시 설정 적용
sudo cp /etc/nginx/sites-enabled/default /etc/nginx/sites-enabled/default.backup 2>/dev/null || true
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/temp-ssl /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# 5. 방화벽 설정 (443 포트 오픈)
echo "🔥 방화벽 설정 중..."
sudo ufw allow 443/tcp

# 6. SSL 인증서 발급
echo "🔐 SSL 인증서 발급 중..."
echo "도메인 $DOMAIN 이 현재 서버를 가리키는지 확인 중..."

# DNS 전파 확인
echo "DNS 전파 확인 중..."
CURRENT_IP=$(curl -s ifconfig.me)
DOMAIN_IP=$(nslookup $DOMAIN | grep "Address" | tail -1 | awk '{print $2}')

if [ "$CURRENT_IP" = "$DOMAIN_IP" ]; then
    echo "✅ DNS 전파 확인됨 ($CURRENT_IP)"
else
    echo "⚠️  DNS 전파 대기 중... (현재 IP: $CURRENT_IP, 도메인 IP: $DOMAIN_IP)"
    echo "DNS 전파까지 최대 48시간이 걸릴 수 있습니다."
fi

sudo certbot certonly \
    --webroot \
    --webroot-path=/var/www/html \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN

# 7. HTTPS용 Docker Compose 파일 생성
echo "📄 HTTPS용 Docker Compose 설정 생성 중..."
cd ~
sudo tee docker-compose.https.yml > /dev/null <<EOL
version: '3.8'

services:
  final-fe:
    image: \${DOCKER_USERNAME}/final-fe:latest
    expose:
      - "80"
    restart: unless-stopped
    container_name: final-fe-app

  nginx-proxy:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx-https.conf:/etc/nginx/nginx.conf:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
    restart: unless-stopped
    depends_on:
      - final-fe
    container_name: nginx-proxy
EOL

# 8. HTTPS용 Nginx 설정 생성
echo "⚙️ HTTPS용 Nginx 설정 생성 중..."
sudo tee nginx-https.conf > /dev/null <<EOL
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Logging
    log_format  main  '\$remote_addr - \$remote_user [\$time_local] "\$request" '
                      '\$status \$body_bytes_sent "\$http_referer" '
                      '"\$http_user_agent" "\$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;
    error_log   /var/log/nginx/error.log;

    # Basic settings
    sendfile        on;
    tcp_nopush      on;
    tcp_nodelay     on;
    keepalive_timeout  65;
    types_hash_max_size 2048;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # HTTP to HTTPS redirect
    server {
        listen 80;
        server_name $DOMAIN;
        
        # Let's Encrypt renewal
        location /.well-known/acme-challenge/ {
            root /var/www/html;
        }
        
        # Redirect all other HTTP traffic to HTTPS
        location / {
            return 301 https://\$server_name\$request_uri;
        }
    }

    # HTTPS server
    server {
        listen 443 ssl http2;
        server_name $DOMAIN;

        # SSL configuration
        ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
        
        # SSL security settings
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384;
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;

        # Security headers
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' https: data: blob: 'unsafe-inline' 'unsafe-eval'; media-src 'self' blob: data:; camera: 'self'; microphone: 'self';" always;

        # Proxy to app
        location / {
            proxy_pass http://final-fe:80;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
            
            # WebSocket support
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection "upgrade";
        }

        # Health check
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
EOL

# 9. 시스템 Nginx 중지
echo "🔄 시스템 Nginx 중지 중..."
sudo systemctl stop nginx
sudo systemctl disable nginx

# 10. 환경 변수 파일 생성 (Docker 이미지명 설정)
echo "📝 환경 변수 설정 중..."
echo "DOCKER_USERNAME=your-docker-username" > .env
echo ""
echo "⚠️  중요: .env 파일에 실제 Docker Hub 사용자명을 입력해주세요!"
echo "현재 GitHub Secrets의 DOCKER_USERNAME과 동일해야 합니다."

# 11. SSL 자동 갱신 설정
echo "🔄 SSL 자동 갱신 설정 중..."
(sudo crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet && cd ~ && docker-compose -f docker-compose.https.yml restart nginx-proxy") | sudo crontab -

echo ""
echo "🎉 HTTPS 설정 완료!"
echo "=================="
echo ""
echo "📋 다음 단계:"
echo "1. .env 파일에 실제 Docker Hub 사용자명 입력"
echo "2. GitHub Actions 워크플로우 업데이트 필요"
echo "3. 수동으로 첫 배포 실행"
echo ""
echo "🔧 수동 배포 명령어:"
echo "sudo docker-compose -f docker-compose.https.yml pull"
echo "sudo docker-compose -f docker-compose.https.yml up -d"
echo ""
echo "✅ 완료 후 https://$DOMAIN 에서 접속 가능합니다!"
