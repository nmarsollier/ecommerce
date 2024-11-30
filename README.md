<!-- cSpell:language es -->

# Arquitectura de Microservicios

## Sobre este proyecto

Este es un proyecto académico para explicar arquitectura de microservicios, implementando un carrito virtual o eCommerce.

Se utilizan varios patrones de arquitectura y cada microservicios posee tecnologías y bases de datos diferentes.

Estos son los microservicios que utilizamos en la cátedra :

## Microservicios

- [Seguridad en Go](https://github.com/nmarsollier/authgo)
- [Imágenes en Go](https://github.com/nmarsollier/imagego)
- [Carrito en Go](https://github.com/nmarsollier/cartgo)
- [Catálogo en Go](https://github.com/nmarsollier/cataloggo)
- [Órdenes en Go](https://github.com/nmarsollier/ordersgo)

## Cliente Demo

Existe una UI en React probar como interactúan los diferentes microservicios.

- [Cliente Demo](https://github.com/nmarsollier/ecommerce_api_client_react)

## GraphQL Federation

Existe una consola para ser utilizado el ciente GraphQL Federation.

- [GraphQL Server](https://github.com/nmarsollier/ecommerce_gql)

## Mas información de arquitectura

[Arquitectura](ARCHITECTURE.md)

# Instalación Básica

## Requisitos

### Docker

Conviene instalar docker para instalar todo sin mayores inconvenientes

Podemos usar las version docker, o instalarlos localmente.

### MongoDB

Para simplificar la configuración, se han tomado decisiones similares de arquitectura, de modo que todos los microservicios pueden utilizar el mismo servidor de base de datos local, aunque cada microservicio utiliza esquemas de datos totalmente independientes.

### Redis

Redis es una segunda opción de almacenamiento de datos. El microservicio de imágenes hace uso de Redis.

### RabbitMQ

La comunicación asíncrona entre microservicios se lleva a cabo a través de la mensajería de Rabbit.

Tiene un cliente WEB [http://localhost:15672/](http://localhost:15672/)

### Fluent

Fluent colecta y envía los logs de los microservicios a MongoDB, es opcional.

# Configuración de contenedores Docker

## Linux

```bash
# Rabbit - Mongo - Redis
docker run -d --name ec-rabbitmq -p 15672:15672 -p 5672:5672 rabbitmq:3.13.6-management
docker run -d --name ec-mongo -p 27017:27017 mongo:4.0.18-xenial
docker run -d --name ec-redis -p 6379:6379 redis:5.0.9-buster
# Fluent
docker build --no-cache -t fluent https://raw.githubusercontent.com/nmarsollier/ecommerce/master/fluent/Dockerfile
docker run --add-host host.docker.internal:172.17.0.1 -it -d --name fluent -p 24224:24224 fluent
# Auth
docker build --no-cache -t prod-auth-go https://raw.githubusercontent.com/nmarsollier/authgo/master/Dockerfile.prod
docker run --add-host host.docker.internal:172.17.0.1 -it -d --name prod-auth-go -p 3000:3000 -p 4000:4000  prod-auth-go
# Image
docker build --no-cache -t prod-image-go https://raw.githubusercontent.com/nmarsollier/imagego/master/Dockerfile.prod
docker run --add-host host.docker.internal:172.17.0.1 -it -d --name prod-image-go -p 3001:3001 -p 4001:4001 prod-image-go
# Orders
docker build --no-cache -t prod-orders-go https://raw.githubusercontent.com/nmarsollier/ordersgo/master/Dockerfile.prod
docker run --add-host host.docker.internal:172.17.0.1 -it -d --name prod-orders-go -p 3004:3004 -p 4004:4004 prod-orders-go
# Catalog
docker build --no-cache -t prod-cataloggo-go https://raw.githubusercontent.com/nmarsollier/cataloggo/master/Dockerfile.prod
docker run --add-host host.docker.internal:172.17.0.1 -it -d --name prod-cataloggo-go -p 3002:3002 -p 4002:4002 prod-cataloggo-go
# Cart
docker build --no-cache -t prod-cartgo-go https://raw.githubusercontent.com/nmarsollier/cartgo/master/Dockerfile.prod
docker run --add-host host.docker.internal:172.17.0.1 -it -d --name prod-cartgo-go -p 3003:3003 -p 4003:4003 prod-cartgo-go
# Cliente React
docker build --no-cache -t prod-api-cli https://raw.githubusercontent.com/nmarsollier/ecommerce_api_client_react/master/Dockerfile.prod
docker run --add-host host.docker.internal:172.17.0.1 -d --name prod-api-cli -p 4200:80 -it  prod-api-cli
# Cliente GQL Federation
docker build --no-cache -t prod-gql_gateway https://raw.githubusercontent.com/nmarsollier/ecommerce_gql/refs/heads/main/Dockerfile.prod
docker run --add-host host.docker.internal:172.17.0.1 -d --name prod-gql_gateway -p 4080:4080 -it  prod-gql_gateway
```

### El contenedor

Mac | Windows

```bash
docker run -it --name gql_gateway -p 4080:4080 gql_gateway
```

Linux

```bash
docker run --add-host host.docker.internal:172.17.0.1 -it -d --name gql_gateway -p 4080:4080  gql_gateway
```

## Windows, Mac

```bash
# Rabbit - Mongo - Redis
docker run -d --name ec-rabbitmq -p 15672:15672 -p 5672:5672 rabbitmq:3.13.6-management
docker run -d --name ec-mongo -p 27017:27017 mongo:6.0
docker run -d --name ec-redis -p 6379:6379 redis:7
# Fluent
docker build --no-cache -t fluent https://raw.githubusercontent.com/nmarsollier/ecommerce/master/fluent/Dockerfile
docker run -it -d --name fluent -p 24224:24224 fluent
# Auth
docker build --no-cache -t prod-auth-go https://raw.githubusercontent.com/nmarsollier/authgo/master/Dockerfile.prod
docker run -it -d --name prod-auth-go -p 3000:3000 -p 4000:4000 prod-auth-go
# Image
docker build --no-cache -t prod-image-go https://raw.githubusercontent.com/nmarsollier/imagego/master/Dockerfile.prod
docker run -it -d --name prod-image-go -p 3001:3001 -p 4001:4001 prod-image-go
# Orders
docker build --no-cache -t prod-orders-go https://raw.githubusercontent.com/nmarsollier/ordersgo/master/Dockerfile.prod
docker run -it -d --name prod-orders-go -p 3004:3004 -p 4004:4004 prod-orders-go
# Catalog
docker build --no-cache -t prod-cataloggo-go https://raw.githubusercontent.com/nmarsollier/cataloggo/master/Dockerfile.prod
docker run -it -d --name prod-cataloggo-go -p 3002:3002 -p 4002:4002 prod-cataloggo-go
# Cart
docker build --no-cache -t prod-cartgo-go https://raw.githubusercontent.com/nmarsollier/cartgo/master/Dockerfile.prod
docker run -it -d --name prod-cartgo-go -p 3003:3003 -p 4003:4003 prod-cartgo-go
# Cliente React
docker build --no-cache -t prod-api-cli https://raw.githubusercontent.com/nmarsollier/ecommerce_api_client_react/master/Dockerfile.prod
docker run -d --name prod-api-cli -p 4200:80 -it prod-api-cli
# Cliente GQL Federation
docker build --no-cache -t prod-gql_gateway https://raw.githubusercontent.com/nmarsollier/ecommerce_gql/refs/heads/main/Dockerfile.prod
docker run -d --name prod-gql_gateway -p 4080:4080 -it  prod-gql_gateway
```

## Código desmantenido

Existen otras versiones desarrolladas en otros lenguajes que definen los mismos microservicios con diversos paradigmas y patrones de desarrollo, aunque están desmantenidos, podrían ser útiles para tomar algunos ejemplos de código :

- [Carrito en Node](https://github.com/nmarsollier/ecommerce_cart_node)
- [Catálogo en Java](https://github.com/nmarsollier/ecommerce_catalog_java)
- [Catálogo en Kotlin](https://github.com/nmarsollier/ecommerce_catalog_kotlin)
- [Catálogo en Python](https://github.com/nmarsollier/ecommerce_catalog_python)
- [Imágenes en Node](https://github.com/nmarsollier/ecommerce_image_node)
- [Órdenes en Java](https://github.com/nmarsollier/ecommerce_order_java)
- [Órdenes en Kotlin](https://github.com/nmarsollier/ecommerce_order_kotlin)
- [Órdenes en Kotlin](https://github.com/nmarsollier/ecommerce_order_kotlin)
- [Seguridad en Node](https://github.com/nmarsollier/ecommerce_auth_node)
