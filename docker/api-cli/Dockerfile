# Docker produccion o stage
FROM node:14.3.0

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
RUN curl -L https://github.com/nmarsollier/ecommerce_api_client_react/tarball/master | tar xz --strip=1
RUN npm install --silent

# Puerto para acceder al Cliente
EXPOSE 4200

CMD ["npm","start"]
