# Imagen base para compilación
FROM node:20-alpine AS build

# Establecer directorio de trabajo
WORKDIR /app

# Copiar todo el contenido del directorio book-reviews-app
COPY ./book-reviews-app/ ./

# Instalar react-router-dom explícitamente primero
RUN npm install react-router-dom --save

# Instalar dependencias
RUN npm ci

# Compilar la aplicación (ignorando errores de linting)
RUN CI=false npm run build

# Imagen base para producción con Nginx
FROM nginx:alpine AS production

# Copiar la configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos compilados desde la etapa de build
COPY --from=build /app/build /usr/share/nginx/html

# Exponer puerto
EXPOSE $PORT

# Script para reemplazar la variable PORT en la configuración de Nginx
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]