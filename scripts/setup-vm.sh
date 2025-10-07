#!/bin/bash

# Ubuntu 22.04 LTS 기준

echo "=== GCP 서버 초기 설정 시작 ==="

# 시스템 업데이트
sudo apt update && sudo apt upgrade -y

# Docker 설치
echo "Docker 설치 중..."
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Docker GPG 키 추가
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Docker 리포지토리 추가
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Docker 설치
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Docker 서비스 시작 및 활성화
sudo systemctl start docker
sudo systemctl enable docker

# 현재 사용자를 docker 그룹에 추가
sudo usermod -aG docker $USER

# Docker Compose 설치
echo "Docker Compose 설치 중..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Nginx 설치 (SSL 인증서 발급용)
echo "Nginx 설치 중..."
sudo apt install -y nginx

# 방화벽 설정 (UFW)
echo "방화벽 설정 중..."
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# 앱 디렉토리 생성
echo "앱 디렉토리 생성 중..."
sudo mkdir -p ~/app
sudo chown $USER:$USER ~/app

# 시스템 유틸리티 설치
sudo apt install -y htop curl wget git vim

# Docker 로그 로테이션 설정
echo "Docker 로그 로테이션 설정 중..."
sudo tee /etc/docker/daemon.json > /dev/null <<EOL
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOL

# Docker 서비스 재시작
sudo systemctl restart docker

echo "=== GCP VM 서버 초기 설정 완료 ==="
echo "재부팅 후 docker 명령어를 사용할 수 있습니다."
echo "재부팅: sudo reboot"
