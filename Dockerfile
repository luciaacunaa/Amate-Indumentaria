# 1. Usamos Node 22 en su versión más ligera (Alpine)
FROM node:22-alpine

# 2. Directorio de trabajo
WORKDIR /app

# 3. Instalamos Python y Make (en Alpine es rapidísimo y no da error 404)
RUN apk add --no-cache python3 make g++ 

# 4. Copiamos dependencias
COPY package*.json ./

# 5. Instalamos dependencias
RUN npm install

# 6. Copiamos el código
COPY . .

# 7. Construimos Next.js
RUN npm run build

# 8. Exponemos el puerto
EXPOSE 3000

# 9. Comando de arranque
CMD ["npm", "start"]
