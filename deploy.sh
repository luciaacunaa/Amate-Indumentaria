#!/bin/bash
echo "====================================="
echo "Iniciando despliegue automatizado..."
echo "====================================="

# 1. Ir a la carpeta del proyecto
cd /home/lupucipi/Amate-Indumentaria || exit

# 2. Traer los últimos cambios de GitHub
git pull origin main

# 3. Reconstruir y levantar los contenedores de Docker
# (Usamos sudo en caso de que lo corras con tu usuario normal)
sudo docker-compose up -d --build

echo "====================================="
echo "¡Despliegue finalizado con éxito!"
echo "====================================="
