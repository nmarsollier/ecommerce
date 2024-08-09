# Notas sobre Contenedores Docker

Instalación de los contenedores "de producción" individuales.

## RabbitMQ

```bash
docker run -d --name ec-rabbitmq -p 15672:15672 -p 5672:5672 rabbitmq:3.8.3-management
```

## MongoDB

```bash
docker run -d --name ec-mongo -p 27017:27017 mongo:4.0.18-xenial
```

## Redis

```bash
docker run -d --name ec-redis -p 6379:6379 redis:5.0.9-buster
```

## Auth - Go

```bash
docker build --no-cache -t prod-auth-go https://raw.githubusercontent.com/nmarsollier/authgo/master/Dockerfile.prod

# Mac || Windows
docker run -it -d --name prod-auth-go -p 3000:3000 prod-auth-go

# Linux
docker run --add-host host.docker.internal:172.17.0.1 -it -d --name prod-auth-go -p 3000:3000 prod-auth-go
```

[Test](http://localhost:3000/)

## Imágenes - Go

```bash
docker build --no-cache -t prod-image-go https://raw.githubusercontent.com/nmarsollier/imagego/master/Dockerfile.prod

# Mac || Windows
docker run -it -d --name prod-image-go -p 3001:3001 prod-image-go

# Linux
docker run --add-host host.docker.internal:172.17.0.1 -it -d --name prod-image-go -p 3001:3001 prod-image-go
 ```

## Orders - Go

```bash
docker build --no-cache -t prod-orders-go https://raw.githubusercontent.com/nmarsollier/ordersgo/master/Dockerfile.prod

# Mac || Windows
docker run -it -d --name prod-orders-go -p 3004:3004 prod-orders-go

# Linux
docker run --add-host host.docker.internal:172.17.0.1 -it -d --name prod-orders-go -p 3004:3004 prod-orders-go
 ```


[Test](http://localhost:3001/)

## Catálogo - Kotlin

```bash
docker build --no-cache -t prod-catalog-kotlin https://raw.githubusercontent.com/nmarsollier/ecommerce_catalog_kotlin/main/Dockerfile.prod

# Mac || Windows
docker run -d --name prod-catalog-kotlin -p 3002:3002 -it  prod-catalog-kotlin

# Linux
docker run --add-host host.docker.internal:172.17.0.1 -d --name prod-catalog-kotlin -p 3002:3002 -it  prod-catalog-kotlin
 ```


## Carrito - Node

```bash
docker build --no-cache -t prod-cart-node https://raw.githubusercontent.com/nmarsollier/ecommerce_cart_node/master/Dockerfile.prod

# Mac || Windows
docker run -d --name prod-cart-node -e 3003:3003 -it prod-cart-node

# Linux
docker run --add-host host.docker.internal:172.17.0.1 -d --name prod-cart-node -p 3003:3003 -it  prod-cart-node
 ```

[Test](http://localhost:3003/)

## Cliente - React

```bash
docker build --no-cache -t prod-api-cli https://raw.githubusercontent.com/nmarsollier/ecommerce_api_client_react/master/Dockerfile.prod

# Mac || Windows
docker run -d --name prod-api-cli -p 4200:80 -it prod-api-cli

# Linux
docker run --add-host host.docker.internal:172.17.0.1 -d --name prod-api-cli -p 4200:80 -it  prod-api-cli
 ```

[Test](http://localhost:4200/)
