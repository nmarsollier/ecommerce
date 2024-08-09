# Arquitectura de Microservicios

## Si querés saber mas sobre mí

[Nestor Marsollier](https://github.com/nmarsollier/profile)

## Sobre este proyecto

Este es un proyecto académico para explicar arquitectura de microservicios, implementando un carrito virtual o eCommerce.

Se utilizan varios patrones de arquitectura y cada microservicios posee tecnologías y bases de datos diferentes.

Este documento describe la configuración y uso de los siguientes repositorios :

- [Seguridad en Go](https://github.com/nmarsollier/authgo)
- [Imágenes en Go](https://github.com/nmarsollier/imagego)
- [Carrito en Node](https://github.com/nmarsollier/ecommerce_cart_node)
- [Catálogo en Kotlin](https://github.com/nmarsollier/ecommerce_catalog_kotlin)
- [Órdenes en Go](https://github.com/nmarsollier/ordersgo)

Existen otras versiones desarrolladas en otros lenguajes que definen los mismos microservicios con diversos paradigmas y patrones de desarrollo, aunque estan desmantenidos, podrían ser utiles para tomar algunos ejemplos de codigo :

- [Órdenes en Kotlin](https://github.com/nmarsollier/ecommerce_order_kotlin)
- [Seguridad en Node](https://github.com/nmarsollier/ecommerce_auth_node)
- [Imágenes en Node](https://github.com/nmarsollier/ecommerce_image_node)
- [Catálogo en Java](https://github.com/nmarsollier/ecommerce_catalog_java)
- [Órdenes en Java](https://github.com/nmarsollier/ecommerce_order_java)
- [Órdenes en Kotlin](https://github.com/nmarsollier/ecommerce_order_kotlin)
- [Catálogo en Python](https://github.com/nmarsollier/ecommerce_catalog_python)

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

El proyecto se desarrollo con [Visual Studio Code](https://code.visualstudio.com/download)

Si bien podrían utilizarse alternativas como [Atom](https://atom.io/), [Sublime](https://www.sublimetext.com/download), [Eclipse](http://www.eclipse.org/downloads/), la variedad de plugins en VSCode hacen que el desarrollo sea 'amigable' para la variedad de lenguajes que estamos manejando en el proyecto.

Si lo que se desea es utiliza java, [IntelliJ](https://www.jetbrains.com/idea/) es una muy buena opción.

Algunos plugins interesantes, depende del lenguaje que usemos :

- __Docker__ by Microsoft
- __ES7 React/Redux/GraphQL React-Native snippets__ by dsznajder
- __ESLint__ by Dirk Baeumer
- __Go__ by Microsoft
- __Java Extension Pack__ by Microsoft
- __JavaScript and Typescript Nightly__ by Microsoft
- __Live Server__ by Titwick Day
- __Markdown All in One__ by Yu Zhang
- __Python__ by Microsoft
- __React Native Tools__ by Microsoft
- __Simple React Snippets__ by Burke Holland
- __Typescript React code snippets__ by infeng
- __Visual Studio IntelliCode__ by Microsoft
- __TSLint__ by egamma
- __JavasScript (ES6) code snippets__ by charlampos karypidis

## Dependencias globales

### Docker y Docker Compose

Simplifica la configuración de todos los servidores. Hay que seguir las guías de instalación y dejar las ultimas versiones configuradas correctamente.

### MongoDB

Para simplificar la configuración, se han tomado decisiones similares de arquitectura, de modo que todos los microservicios pueden utilizar el mismo servidor de base de datos local, aunque cada microservicio utiliza esquemas de datos totalmente independientes.

Podemos usar la version docker, o instalarlo localmente.

Sugiero instalar Mongodb Compass para poder gestionar la base de datos en forma visual [mongodb.com](https://www.mongodb.com/products/compass)

### Redis

Redis es una segunda opción de almacenamiento de datos. El microservicio de imágenes hace uso de Redis.

Podemos usar la version docker, o instalarlo localmente.

Recomiendo instalar FastoRedis para acceder a la base de datos [fastoredis.com](https://fastoredis.com/)

### RabbitMQ

La comunicación asíncrona entre microservicios se lleva a cabo a través de la mensajería de Rabbit.

Podemos usar la versión docker, o instalarlo localmente.

Tiene un cliente WEB [http://localhost:15672/](http://localhost:15672/)

#### Lenguajes de programación

Para desarrollar, es necesario tener instalado el lenguaje que corresponda localmente.
Si bien con docker no necesitamos todos los lenguajes de programación, si es necesario que en los lenguajes que vamos a desarrollar microservicios esté instalado.
Para una mejor comprensión de la cátedra recomiendo instalarlos a todos.
Cada proyecto tiene sus propios tutoriales de instalación y configuración para desarrollo.

## Instalación rápida usando Docker Compose

Existe una configuración completa de todos los microservicios con builds de producción usando docker-compose.

Esta instalación y ejecución es muy sencilla, solo pretende permitir la ejecución de todos los contenedores para probarlos.

Sin embargo nos vamos a basar en esta configuración para desarrollar, por lo que es necesario instalarlos.

Una vez levantados los servicios se puede acceder al cliente usando [localhost:4200](http://localhost:4200)

Existen varios yml de compose, hay que bajar y usar el que corresponda desde el repositorio.

Las opciones son las siguientes:

- docker-compose.yml : Para windows y mac, baja y compila todo desde github
- docker-compose-linux.yml : Para linux, baja y compila todo desde github
- docker-compose-prod.yml : Para windows y mac, baja una imagen pre-compilada de docker hub
- docker-compose-prod-linux.yml : Para linux, baja una imagen pre-compilada de docker hub

Levantamos los contenedores usando el comando :

```bash
docker-compose -f docker-XXX.yml up -d
```

### Notas sobre Linux

En linux es necesario agregar una referencia al host host.docker.internal.
La ip default es 172.17.0.1, y corresponde a la ip de la interfaz de red docker0.
Si no funciona asi como está el archivo, hay que ver que ip tiene esa interfaz y cambiar el archivo.

## Configuraciones de desarrollo con docker

Cuando queramos desarrollar en forma mas especifica con un proyecto en particular, necesitaremos crear las imágenes fuera del contexto de docker-compose, y bajar ciertos contenedores de compose para levantar otros contenedores docker alternativos.

O simplemente, bajar el contenedor del proyecto y ejecutar en el host local, esta configuración esta preparada para que lo podamos hacer.

Cada proyecto proporciona información sobre como hacer build y run de los contenedores específicos de desarrollo.

## Instalación mas detallada usando solo Docker

No es necesario con compose, pero si queremos ponernos a probar, hay un instructivo :

[Contenedores Docker](README-DOCKER.md)
