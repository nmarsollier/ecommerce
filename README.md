# Arquitectura de Microservicios

## Si querés saber mas sobre mí

[Nestor Marsollier](https://github.com/nmarsollier/profile)

## Sobre este proyecto

Este es un proyecto académico para explicar arquitectura de microservicios, implementando un carrito virtual o eCommerce.

Se utilizan varios patrones de arquitectura y cada microservicios posee tecnologías y bases de datos diferentes.

Este documento describe la configuración y uso de los siguientes repositorios :

- [Seguridad en Node](https://github.com/nmarsollier/ecommerce_auth_node)
- [Imágenes en Node](https://github.com/nmarsollier/ecommerce_image_node)
- [Catálogo en Python](https://github.com/nmarsollier/ecommerce_catalog_python)
- [Carrito en Node](https://github.com/nmarsollier/ecommerce_cart_node)

Existen otras versiones desarrolladas en otros lenguajes que definen los mismos microservicios con diversos paradigmas y patrones de desarrollo :

- [Seguridad en Go](https://github.com/nmarsollier/authgo)
- [Imágenes en Go](https://github.com/nmarsollier/imagego)
- [Catálogo en Java](https://github.com/nmarsollier/ecommerce_catalog_java)
- [Órdenes en Java](https://github.com/nmarsollier/ecommerce_order_java)

## Cliente Demo

Existe un proyecto en React, que nos proporciona un cliente demo para la plataforma, permitiéndonos probar como interactúan los diferentes microservicios.

Ver la documentación del cliente en :

- [Cliente Demo](https://github.com/nmarsollier/ecommerce_api_client_react)

## Mas información de arquitectura

[Arquitectura](ARCHITECTURE.md)

## Guía de Instalación General

Este proyecto utiliza varias tecnologías, las siguientes dependencias son necesarias antes de comenzar a compilar y ejecutar aplicaciones.

Es necesario seguir los tutoriales en cada uno de los microservicios.

Existen diversas versiones para cada microservicio, Node es una dependencia que no podemos evitar dado que tanto el cliente demo como Carrito solo poseen versiones en node.

Debemos elegir entorno Python o Java como complemento para poder levantar los microservicios de Catalogo y Orders, habiendo configurado estos dos entornos, se podrá ejecutar todo el proyecto.

Alternativamente tenemos versiones de Imágenes y Auth en Go. Los proyectos Go se caracterizan por ser mucho mas veloces y consumir menos recursos, por lo tanto se el alumno lo desea puede compilar ambos proyectos en Go y disfrutar de esas ventajas a la hora de desarrollar.

## Entorno de Desarrollo

El proyecto se desarrollo con [Visual Studio Code](https://code.visualstudio.com/download), Si bien podrían utilizarse alternativas como [Atom](https://atom.io/), [Sublime](https://www.sublimetext.com/download), [Eclipse](http://www.eclipse.org/downloads/), la variedad de plugins en VSCode hacen que el desarrollo sea 'amigable' para la variedad de lenguajes que estamos manejando en el proyecto.

Los plugins configurados en el momento de desarrollo en VSCode son los siguientes :

- __ES7 React/Redux/GraphQL React-Native snippets__ by dsznajder
- __React Native Tools__ by Microsoft
- __TSLint__ by egamma
- __Typescript React code snippets__ by infeng
- __ESLint__ by Dirk Baeumer
- __Go__ by Microsoft
- __JavasScript (ES6) code snippets__ by charlampos karypidis
- __Language Support for Java(TM)__ by Red Hat
- __Python__ by Microsoft
- __Python for VSCode__ by Thomas Haakon Townsend
- __Python-autopep8__ by himanoa
- __TSLint__ by egamma

Existe un Workspace configurado para VSCode en la raíz del proyecto :

```bash
Microservicios.code-workspace
```

## Dependencias globales

### MongoDB

Para simplificar la configuración, se han tomado decisiones similares de arquitectura, de modo que todos los microservicios pueden utilizar el mismo servidor de base de datos local, aunque cada microservicio utiliza esquemas de datos totalmente independientes.

Seguir las guías de instalación de mongo desde el sitio oficial [mongodb.com](https://www.mongodb.com/download-center#community)

No se requiere ninguna configuración adicional, solo levantarlo luego de instalarlo.

Sugiero instalar Mongodb Compass para poder navegar la base de datos en forma visual [mongodb.com](https://www.mongodb.com/products/compass)

### Redis

Redis es una segunda opción de almacenamiento de datos. El microservicio de imágenes hace uso de Redis.

Seguir los pasos de instalación desde la pagina oficial [redis.io](https://redis.io/download)

No se requiere ninguna configuración adicional, solo levantarlo luego de instalarlo.

Para windows se puede descargar el paquete sin instalación : [Instalación](https://sourceforge.net/projects/redis/)

Recomiendo instalar FastoRedis para navegar la base de datos [fastoredis.com](https://fastoredis.com/)

### RabbitMQ

La comunicación asíncrona entre microservicios se lleva a cabo a través de la mensajería de Rabbit.

Seguir los pasos de instalación en la pagina oficial

[rabbitmq.com](https://www.rabbitmq.com/)

No se requiere ninguna configuración adicional, solo levantarlo luego de instalarlo.

## Instalación usando Docker

Esta instalación y ejecución es muy sencilla, solo pretende permitir la ejecución
de todos los contenedores para probarlos.`

### Rabbit con Docker

El contenedor se crea con

```bash
docker run -d --name ec-rabbitmq -d -p 15672:15672 -p 5672:5672 rabbitmq:3.8.3-management
```

### Mongo con Docker

El contenedor se crea con

```bash
docker run -d --name ec-mongo -d -p 27017:27017 mongo:4.0.18-xenial
```

### Redis con Docker

El contenedor se crea con

```bash
docker run -d --name ec-redis -d -p 6379:6379 redis:5.0.9-buster
```

### Auth con Docker

#### Auth version Node

```bash
docker build --no-cache -t prod-auth-node https://github.com/nmarsollier/ecommerce_auth_node/raw/master/Dockerfile.prod

# Mac || Windows
docker run -d --name prod-auth-node -p 3000:3000 prod-auth-node

# Linux
docker run --add-host host.docker.internal:172.17.0.1 -d --name prod-auth-node -p 3000:3000 prod-auth-node
```

[Test](http://localhost:3000/)

#### Auth version Go

```bash
docker build --no-cache -t prod-auth-go https://raw.githubusercontent.com/nmarsollier/authgo/master/Dockerfile.prod

# Mac || Windows
docker run -it -d --name prod-auth-go -p 3000:3000 prod-auth-go

# Linux
docker run --add-host host.docker.internal:172.17.0.1 -it -d --name prod-auth-go -p 3000:3000 prod-auth-go
```

[Test](http://localhost:3000/)

### Imágenes con Docker

#### Imágenes version Node

```bash
docker build --no-cache -t prod-image-node https://raw.githubusercontent.com/nmarsollier/ecommerce_image_node/master/Dockerfile.prod

# Mac || Windows
docker run -d --name prod-image-node -p 3001:3001 -it  prod-image-node

# Linux
docker run --add-host host.docker.internal:172.17.0.1 -d --name prod-image-node -p 3001:3001 -it  prod-image-node
```

[Test](http://localhost:3001/)

#### Imágenes version Go

```bash
docker build --no-cache -t prod-image-go https://raw.githubusercontent.com/nmarsollier/imagego/master/Dockerfile.prod

# Mac || Windows
docker run -it -d --name prod-image-go -p 3001:3001 prod-image-go

# Linux
docker run --add-host host.docker.internal:172.17.0.1 -it -d --name prod-image-go -p 3001:3001 prod-image-go
 ```

[Test](http://localhost:3001/)

### Catálogo

#### en Java con Docker

```bash
docker build --no-cache -t prod-catalog-java https://raw.githubusercontent.com/nmarsollier/ecommerce_catalog_java/master/Dockerfile.prod

# Mac || Windows
docker run -d --name prod-catalog-java -p 3002:3002 -it  prod-catalog-java

# Linux
docker run --add-host host.docker.internal:172.17.0.1 -d --name prod-catalog-java -p 3002:3002 -it  prod-catalog-java
 ```

#### en Java con Python

```bash
docker build --no-cache -t prod-catalog-python https://raw.githubusercontent.com/nmarsollier/ecommerce_catalog_python/master/Dockerfile.prod

# Mac || Windows
docker run -d --name prod-catalog-python -p 3002:3002 -it  prod-catalog-python

# Linux
docker run --add-host host.docker.internal:172.17.0.1 -d --name prod-catalog-python -p 3002:3002 -it  prod-catalog-python
 ```

[Test](http://localhost:3002/)

### Carrito en Node con Docker

```bash
docker build --no-cache -t prod-cart-node https://raw.githubusercontent.com/nmarsollier/ecommerce_cart_node/master/Dockerfile.prod

# Mac || Windows
docker run -d --name prod-cart-node -e 3003:3003 -it  prod-cart-node

# Linux
docker run --add-host host.docker.internal:172.17.0.1 -d --name prod-cart-node -e 3003:3003 -it  prod-cart-node
 ```

[Test](http://localhost:3003/)

### Order en Java con Docker

```bash
docker build --no-cache -t prod-order-java https://raw.githubusercontent.com/nmarsollier/ecommerce_order_java/master/Dockerfile.prod

# Mac || Windows
docker run -d --name prod-order-java -p 3004:3004 -it  prod-order-java

# Linux
docker run --add-host host.docker.internal:172.17.0.1 -d --name prod-order-java -p 3004:3004 -it  prod-order-java
```

[Test](http://localhost:3004/)

### Cliente en React con Docker

```bash
docker build --no-cache -t prod-api-cli https://raw.githubusercontent.com/nmarsollier/ecommerce_api_client_react/master/Dockerfile.prod

# Mac || Windows
docker run -d --name prod-api-cli -p 4200:4200 -it  prod-api-cli

# Linux
docker run --add-host host.docker.internal:172.17.0.1 -d --name prod-api-cli -p 4200:4200 -it  prod-api-cli
 ```

[Test](http://localhost:4200/)

### Notas generales

Para actualizar cualquier imagen

```bash
docker stop [IMAGE]
docker rm [IMAGE]
```

Y ejecutamos nuevamente los comandos nuevamente
