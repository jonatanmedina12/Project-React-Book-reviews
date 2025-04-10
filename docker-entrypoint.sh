#!/bin/sh

# Establecer puerto por defecto si no está definido
PORT=${PORT:-80}

# Reemplazar variable PORT en la configuración de Nginx
sed -i "s/\${PORT}/$PORT/g" /etc/nginx/conf.d/default.conf

# Reemplazar variable API_URL en la configuración de Nginx si está definida
if [ ! -z "$API_URL" ]; then
  sed -i "s|\${API_URL}|$API_URL|g" /etc/nginx/conf.d/default.conf
else
  sed -i "s|\${API_URL}|http://localhost:8080|g" /etc/nginx/conf.d/default.conf
fi

# Ejecutar el comando que se pasa como argumento
exec "$@"