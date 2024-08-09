# Arquitectura de Microservicios

## Si querés saber mas sobre mí

[Nestor Marsollier](https://github.com/nmarsollier/profile)

## Sobre este proyecto

Este es un proyecto académico para explicar arquitectura de microservicios, implementando un carrito virtual o eCommerce.

Se utilizan varios patrones de arquitectura y cada microservicios posee tecnologías y bases de datos diferentes.

Estos documento describen la configuración y uso de los repositorios que vamos a necesitar :

- [Seguridad en Go](https://github.com/nmarsollier/authgo)
- [Imágenes en Go](https://github.com/nmarsollier/imagego)
- [Carrito en Node](https://github.com/nmarsollier/ecommerce_cart_node)
- [Catálogo en Kotlin](https://github.com/nmarsollier/ecommerce_catalog_kotlin)
- [Órdenes en Go](https://github.com/nmarsollier/ordersgo)

### Cliente Demo

Existe un proyecto visual en React probar como interactúan los diferentes microservicios.

- [Cliente Demo](https://github.com/nmarsollier/ecommerce_api_client_react)

## Mas información de arquitectura

[Arquitectura](ARCHITECTURE.md)

# Guía de Instalación General

## Entorno de Desarrollo

El proyecto se desarrolló con [Visual Studio Code](https://code.visualstudio.com/download)

Y para los proyectos kotlin, [IntelliJ](https://www.jetbrains.com/idea/)

## Dependencias globales

Podemos usar las version docker, o instalarlos localmente.

### MongoDB

Para simplificar la configuración, se han tomado decisiones similares de arquitectura, de modo que todos los microservicios pueden utilizar el mismo servidor de base de datos local, aunque cada microservicio utiliza esquemas de datos totalmente independientes.

### Redis

Redis es una segunda opción de almacenamiento de datos. El microservicio de imágenes hace uso de Redis.

### RabbitMQ

La comunicación asíncrona entre microservicios se lleva a cabo a través de la mensajería de Rabbit.

Tiene un cliente WEB [http://localhost:15672/](http://localhost:15672/)

# Docker

Para ejecutar los diversos microservicios es conveniente usar docker, ya que simplifica todo.

## RabbitMQ

[http://localhost:15672/](http://localhost:15672/)

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

[http://localhost:3000/docs/index.html](http://localhost:3000/docs/index.html)

```bash
docker build --no-cache -t prod-auth-go https://raw.githubusercontent.com/nmarsollier/authgo/master/Dockerfile.prod
 ```

Mac || Windows
```bash
docker run -it -d --name prod-auth-go -p 3000:3000 prod-auth-go
 ```

Linux
```bash
docker run --add-host host.docker.internal:172.17.0.1 -it -d --name prod-auth-go -p 3000:3000 prod-auth-go
```

## Imágenes - Go

[http://localhost:3001/docs/index.html](http://localhost:3001/docs/index.html)

```bash
docker build --no-cache -t prod-image-go https://raw.githubusercontent.com/nmarsollier/imagego/master/Dockerfile.prod
 ```

Mac || Windows
```bash
docker run -it -d --name prod-image-go -p 3001:3001 prod-image-go
 ```

Linux
```bash
docker run --add-host host.docker.internal:172.17.0.1 -it -d --name prod-image-go -p 3001:3001 prod-image-go
 ```

## Orders - Go

[http://localhost:3004/docs/index.html](http://localhost:3004/docs/index.html)

```bash
docker build --no-cache -t prod-orders-go https://raw.githubusercontent.com/nmarsollier/ordersgo/master/Dockerfile.prod
 ```

Mac || Windows
```bash
docker run -it -d --name prod-orders-go -p 3004:3004 prod-orders-go
 ```

Linux
```bash
docker run --add-host host.docker.internal:172.17.0.1 -it -d --name prod-orders-go -p 3004:3004 prod-orders-go
 ```

## Catálogo - Kotlin

[http://localhost:3002/](http://localhost:3002/)

```bash
docker build --no-cache -t prod-catalog-kotlin https://raw.githubusercontent.com/nmarsollier/ecommerce_catalog_kotlin/main/Dockerfile.prod
 ```

Mac || Windows
```bash
docker run -d --name prod-catalog-kotlin -p 3002:3002 -it  prod-catalog-kotlin
 ```

Linux
```bash
docker run --add-host host.docker.internal:172.17.0.1 -d --name prod-catalog-kotlin -p 3002:3002 -it  prod-catalog-kotlin
 ```

## Carrito - Node

[http://localhost:3003/](http://localhost:3003/)

```bash
docker build --no-cache -t prod-cart-node https://raw.githubusercontent.com/nmarsollier/ecommerce_cart_node/master/Dockerfile.prod
 ```

Mac || Windows
```bash
docker run -d --name prod-cart-node -e 3003:3003 -it prod-cart-node
 ```

Linux
```bash
docker run --add-host host.docker.internal:172.17.0.1 -d --name prod-cart-node -p 3003:3003 -it  prod-cart-node
 ```

## Cliente - React

[http://localhost:4200/](http://localhost:4200/)

```bash
docker build --no-cache -t prod-api-cli https://raw.githubusercontent.com/nmarsollier/ecommerce_api_client_react/master/Dockerfile.prod
 ```

Mac || Windows
```bash
docker run -d --name prod-api-cli -p 4200:80 -it prod-api-cli
 ```

Linux
```bash
docker run --add-host host.docker.internal:172.17.0.1 -d --name prod-api-cli -p 4200:80 -it  prod-api-cli
 ```

### Notas sobre Linux

En linux es necesario agregar una referencia al host host.docker.internal.
La ip default es 172.17.0.1, y corresponde a la ip de la interfaz de red docker0.
Si no funciona asi como está el archivo, hay que ver que ip tiene esa interfaz y cambiar el archivo.

## Configuraciones de desarrollo con docker

Cuando queramos desarrollar en forma mas especifica con un proyecto en particular, necesitaremos crear las imágenes fuera del contexto de docker-compose, y bajar ciertos contenedores de compose para levantar otros contenedores docker alternativos.

O simplemente, bajar el contenedor del proyecto y ejecutar en el host local, esta configuración esta preparada para que lo podamos hacer.

Cada proyecto proporciona información sobre como hacer build y run de los contenedores específicos de desarrollo.

## Mas ejemplos de codigo

Existen otras versiones desarrolladas en otros lenguajes que definen los mismos microservicios con diversos paradigmas y patrones de desarrollo, aunque estan desmantenidos, podrían ser utiles para tomar algunos ejemplos de codigo :

- [Órdenes en Kotlin](https://github.com/nmarsollier/ecommerce_order_kotlin)
- [Seguridad en Node](https://github.com/nmarsollier/ecommerce_auth_node)
- [Imágenes en Node](https://github.com/nmarsollier/ecommerce_image_node)
- [Catálogo en Java](https://github.com/nmarsollier/ecommerce_catalog_java)
- [Órdenes en Java](https://github.com/nmarsollier/ecommerce_order_java)
- [Órdenes en Kotlin](https://github.com/nmarsollier/ecommerce_order_kotlin)
- [Catálogo en Python](https://github.com/nmarsollier/ecommerce_catalog_python)
