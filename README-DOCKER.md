# Notas sobre Contenedores Docker

Instalación de los contenedores "de producción" individuales.

## RabbitMQ

```bash
docker run -d --name ec-rabbitmq -d -p 15672:15672 -p 5672:5672 rabbitmq:3.8.3-management
```

## MongoDB

```bash
docker run -d --name ec-mongo -d -p 27017:27017 mongo:4.0.18-xenial
```

## Redis

```bash
docker run -d --name ec-redis -d -p 6379:6379 redis:5.0.9-buster
```

## Auth - Node

```bash
docker build --no-cache -t prod-auth-node https://github.com/nmarsollier/ecommerce_auth_node/raw/master/Dockerfile.prod

# Mac || Windows
docker run -d --name prod-auth-node -p 3000:3000 prod-auth-node

# Linux
docker run --add-host host.docker.internal:172.17.0.1 -d --name prod-auth-node -p 3000:3000 prod-auth-node
```

[Test](http://localhost:3000/)

## Auth - Go

```bash
docker build --no-cache -t prod-auth-go https://raw.githubusercontent.com/nmarsollier/authgo/master/Dockerfile.prod

# Mac || Windows
docker run -it -d --name prod-auth-go -p 3000:3000 prod-auth-go

# Linux
docker run --add-host host.docker.internal:172.17.0.1 -it -d --name prod-auth-go -p 3000:3000 prod-auth-go
```

[Test](http://localhost:3000/)

## Imágenes - Node

```bash
docker build --no-cache -t prod-image-node https://raw.githubusercontent.com/nmarsollier/ecommerce_image_node/master/Dockerfile.prod

# Mac || Windows
docker run -d --name prod-image-node -p 3001:3001 -it  prod-image-node

# Linux
docker run --add-host host.docker.internal:172.17.0.1 -d --name prod-image-node -p 3001:3001 -it  prod-image-node
```

[Test](http://localhost:3001/)

## Imágenes - Go

```bash
docker build --no-cache -t prod-image-go https://raw.githubusercontent.com/nmarsollier/imagego/master/Dockerfile.prod

# Mac || Windows
docker run -it -d --name prod-image-go -p 3001:3001 prod-image-go

# Linux
docker run --add-host host.docker.internal:172.17.0.1 -it -d --name prod-image-go -p 3001:3001 prod-image-go
 ```

[Test](http://localhost:3001/)

## Catálogo - Java

```bash
docker build --no-cache -t prod-catalog-java https://raw.githubusercontent.com/nmarsollier/ecommerce_catalog_java/master/Dockerfile.prod

# Mac || Windows
docker run -d --name prod-catalog-java -p 3002:3002 -it  prod-catalog-java

# Linux
docker run --add-host host.docker.internal:172.17.0.1 -d --name prod-catalog-java -p 3002:3002 -it  prod-catalog-java
 ```

## Catálogo - Python

```bash
docker build --no-cache -t prod-catalog-python https://raw.githubusercontent.com/nmarsollier/ecommerce_catalog_python/master/Dockerfile.prod

# Mac || Windows
docker run -d --name prod-catalog-python -p 3002:3002 -it  prod-catalog-python

# Linux
docker run --add-host host.docker.internal:172.17.0.1 -d --name prod-catalog-python -p 3002:3002 -it  prod-catalog-python
 ```

[Test](http://localhost:3002/)

## Carrito - Node

```bash
docker build --no-cache -t prod-cart-node https://raw.githubusercontent.com/nmarsollier/ecommerce_cart_node/master/Dockerfile.prod

# Mac || Windows
docker run -d --name prod-cart-node -e 3003:3003 -it  prod-cart-node

# Linux
docker run --add-host host.docker.internal:172.17.0.1 -d --name prod-cart-node -e 3003:3003 -it  prod-cart-node
 ```

[Test](http://localhost:3003/)

## Order - Java

```bash
docker build --no-cache -t prod-order-java https://raw.githubusercontent.com/nmarsollier/ecommerce_order_java/master/Dockerfile.prod

# Mac || Windows
docker run -d --name prod-order-java -p 3004:3004 -it  prod-order-java

# Linux
docker run --add-host host.docker.internal:172.17.0.1 -d --name prod-order-java -p 3004:3004 -it  prod-order-java
```

[Test](http://localhost:3004/)

## Cliente - React

```bash
docker build --no-cache -t prod-api-cli https://raw.githubusercontent.com/nmarsollier/ecommerce_api_client_react/master/Dockerfile.prod

# Mac || Windows
docker run -d --name prod-api-cli -p 4200:80 -it  prod-api-cli

# Linux
docker run --add-host host.docker.internal:172.17.0.1 -d --name prod-api-cli -p 4200:80 -it  prod-api-cli
 ```

[Test](http://localhost:4200/)
