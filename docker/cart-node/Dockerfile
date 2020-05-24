# Docker produccion o stage
FROM node:14.3.0

WORKDIR /app
RUN curl -L https://github.com/nmarsollier/ecommerce_cart_node/tarball/master | tar xz --strip=1
RUN npm install --silent
RUN npm run build

# Puerto  Cart Service
EXPOSE 3003

CMD ["npm","run", "serve"]
