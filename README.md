# Arquitectura de Microservicios

Este es un proyecto académico para explicar arquitectura de microservicios, implementando un carrito virtual o eCommerce.

Se utilizan varios patrones de arquitectura y cada microservicios posee tecnologías y bases de datos diferentes.

Cada directorio dentro de la raíz de este repositorio  es un microservicio, cada microservicios posee documentación importante que debe ser leída con atención:

[Microservicio de Seguridad](auth/README.md)\
[Microservicio de Imágenes](image/README.md)\
[Microservicio de Catálogo](catalog/README.md)\
[Microservicio de Carrito](cart/README.md)

Existen versiones desarrolladas en GoLang que pueden reemplazar las versiones en este proyecto :

[Seguridad en Go](https://github.com/nmarsollier/authgo)\
[Imágnes en Go](https://github.com/nmarsollier/imagego)

## Guía de Instalación General

Este proyecto utiliza varias tecnologías, las siguientes dependencias son necesarias antes de comenzar a compilar y ejecutar aplicaciones. Es necesario seguir los tutoriales en cada uno de los microservicios. En este repositorio hay 2 entornos, uno Node y uno Python, habiendo configurado estos dos entornos, se podrá ejecutar todo el proyecto.

## Cliente Demo

Existe un proyecto en Angular6, que nos proporciona un cliente demo para la plataforma, permitiéndonos probar como interactúan los diferentes microservicios.

Ver la documentación del proyecto en :

[Cliente Demo](apiClient/README.md)

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
