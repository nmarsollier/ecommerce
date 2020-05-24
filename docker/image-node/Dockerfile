# Docker para produccion o stage
FROM node:14.3.0

WORKDIR /app
RUN curl -L https://github.com/nmarsollier/ecommerce_image_node/tarball/master | tar xz --strip=1
RUN npm install --silent
RUN npm run build

# Puerto para image service
EXPOSE 3001

CMD ["npm","run", "serve"]
