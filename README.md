### Si queres sabes mas sobre mi:
[Nestor Marsollier](https://github.com/nmarsollier/profile)

# Arquitectura de Microservicios

Este es un proyecto académico para explicar arquitectura de microservicios, implementando un carrito virtual o eCommerce.

Se utilizan varios patrones de arquitectura y cada microservicios posee tecnologías y bases de datos diferentes.

Este documento describe la configuracion y uso de los siguientes repositorios :

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

Esta instalacion y ejecucion es muy sencilla, solo pretende permitir la ejecucion
de todos los contenedores para probarlos.

### Rabbit

El contenedor se crea con

```bash
docker run -d --name ec-rabbitmq --network host -d rabbitmq:3.8.3-management
```

### Mongo

El contenedor se crea con

```bash
docker run -d --name ec-mongo --network host -d mongo:4.0-xenial
```

### Redis

El contenedor se crea con

```bash
docker run -d --name ec-redis --network host -d redis:5.0.9-buster
```
 
### Auth 

_Version Node_

```bash
docker build --no-cache -t prod-auth-node https://github.com/nmarsollier/ecommerce/raw/master/docker/auth-node/Dockerfile

docker run -d --name prod-auth-node --network host -it prod-auth-node
```

[Test](http://localhost:3000/) 


_Version Go_

```bash
docker build --no-cache -t prod-auth-go https://github.com/nmarsollier/ecommerce/raw/master/docker/auth-go/Dockerfile

docker run -it -d --name prod-auth-go --network host prod-auth-go
```

[Test](http://localhost:3000/) 


### Imagenes 

_Version Node_

```bash
docker build --no-cache -t prod-image-node https://github.com/nmarsollier/ecommerce/raw/master/docker/image-node/Dockerfile

docker run -d --name prod-image-node --network host -it  prod-image-node
```

[Test](http://localhost:3001/) 

_Version Go_

```bash
docker build --no-cache -t prod-image-go https://github.com/nmarsollier/ecommerce/raw/master/docker/image-go/Dockerfile

docker run -it -d --name prod-image-go --network host prod-image-go
```

[Test](http://localhost:3001/) 



### Catalogo en Java

```bash
docker build --no-cache -t prod-catalog-java https://github.com/nmarsollier/ecommerce/raw/master/docker/catalog-java/Dockerfile

docker run -d --name prod-catalog-java --network host -it  prod-catalog-java
```

[Test](http://localhost:3002/) 

### Carrito en Node

```bash
docker build --no-cache -t prod-cart-node https://github.com/nmarsollier/ecommerce/raw/master/docker/cart-node/Dockerfile

docker run -d --name prod-cart-node --network host -it  prod-cart-node
```

[Test](http://localhost:3003/) 

### Order en Java

```bash
docker build --no-cache -t prod-order-java https://github.com/nmarsollier/ecommerce/raw/master/docker/order-java/Dockerfile

docker run -d --name prod-order-java --network host -it  prod-order-java
```

[Test](http://localhost:3004/) 

### Cliente en React

```bash
docker build --no-cache -t prod-api-cli https://github.com/nmarsollier/ecommerce/raw/master/docker/api-cli/Dockerfile

docker run -d --name prod-api-cli --network host -it  prod-api-cli
```

[Test](http://localhost:4200/) 


### Notas generales

Para actualizar cualquier imagen

```bash
docker stop [IMAGE]
docker rm [IMAGE]
```

Y ejecutamos nuevamenete los comandos necesarios

