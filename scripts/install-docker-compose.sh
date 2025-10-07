#!/bin/bash

# Docker Compose 설치만 실행하는 간단한 스크립트

echo "=== Docker Compose 설치 시작 ==="

# Docker Compose 설치
echo "Docker Compose 설치 중..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 설치 확인
docker-compose --version

echo "=== Docker Compose 설치 완료 ==="