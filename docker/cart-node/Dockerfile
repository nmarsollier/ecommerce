# Servidores produccion o stage
FROM node:14.3.0

# Directorio app
WORKDIR /app

# Bajamos solamente un snapshot de master
RUN curl -L https://github.com/nmarsollier/ecommerce_cart_node/tarball/master | tar xz --strip=1

# Instalamos dependencias y compilamos
RUN npm install
RUN npm run build

# Puerto 
EXPOSE 3003

# Launch application
CMD ["npm","run", "serve"]
