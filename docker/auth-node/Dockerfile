# Docker produccion o stage
FROM node:14.3.0

WORKDIR /app
RUN curl -L https://github.com/nmarsollier/ecommerce_auth_node/tarball/master | tar xz --strip=1
RUN npm install --silent
RUN npm run build

# Puerto de Auth Service 
EXPOSE 3000

CMD ["npm","run", "serve"]

