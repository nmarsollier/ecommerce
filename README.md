Arquitectura de Microservicios
=

Este proyecto es un ejemplo de como armar una arquitectura de microservicios, posee varias tecnologías, entre ellas :
    Node, MongoDb, Redis

Al ser una arquitectura de microservicios cada directorio dentro de la raíz del proyecto es un microservicio, leer los pasos documentados en cada proyecto en los archivos README.txt

[Auth](auth/README.md)\
[Image](image/README.md)\
[Catalog](catalog/README.md)\
[Cart](cart/README.md)

Existe un modulo de Seguridad desarrollado en GoLang

[AuthGo](https://github.com/nmarsollier/ms_auth_go)

Guía de Instalación General
-

Este proyecto utiliza varias tecnologías, las siguientes dependencias son necesarias antes de comenzar a compilar y ejecutar aplicaciones. Es necesario seguir los tutoriales en cada uno de los microservicios. En general hay 2 entornos, uno Node y uno Python, habiendo configurado estos dos entornos, se podrá ejecutar todo el proyecto.

Cliente Demo
-

Existe un proyecto en Angular6, que nos proporciona un cliente demo para la plataforma, permitiéndonos probar como interactúan los diferentes microservicios.

Ver la documentación del proyecto en :

[Cliente Demo](clienteDemo/README.md)

Dependencias globales
-

Estas son dependencias compartidas, cada microservicio tiene su propia base de datos, pero para simplificar la configuración, en estos ejemplos vamos a compartir instancias de db. Pero en un entorno real cada servicio debe configurar su entorno.

MongoDB
-

Seguir las guías de instalación de mongo desde el sitio oficial

<https://www.mongodb.com/download-center#community>

No se requiere ninguna configuración adicional, solo levantarlo luego de instalarlo.

Crear una carpeta donde se guardara la db de mongo : bin/data por ejemplo

Sugiero instalar Mongodb Compass para poder navegar la base de datos en forma visual

<https://www.mongodb.com/products/compass>

Redis
-

Seguir los pasos de instalación desde la pagina oficial

<https://redis.io/download>

No se requiere ninguna configuración adicional, solo levantarlo luego de instalarlo.

Para windows se puede descargar el paquete sin instalación : <https://sourceforge.net/projects/redis/>

Recomiendo instalar FastoRedis para navegar la base de datos <https://fastoredis.com/>

RabbitMQ
-

Seguir los pasos de instalación en la pagina oficial

<https://www.rabbitmq.com/>

No se requiere ninguna configuración adicional, solo levantarlo luego de instalarlo.
