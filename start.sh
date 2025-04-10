#!/bin/sh

# Reemplazar $PORT en la configuración de Nginx con la variable de entorno PORT
sed -i "s/\$PORT/${PORT:-80}/g" /etc/nginx/conf.d/default.conf

# Ejecutar el comando proporcionado
exec "$@"