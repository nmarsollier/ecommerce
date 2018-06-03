Arquitectura de Microservicios
=

Este proyecto es un ejemplo de como armar una arquitectura de microservicios, posee varias tecnlogias, entre ellas :
    Node, MongoDb, Redis

Al ser una arquitectura de microservicios cada directorio dentro de la raiz del proyecto es un microservicio, leer los pasos documentados en cada proyecto en los archivos README.txt

[Seguridad](auth/README.md)\
[Imagenes](image/README.md)\
[Catalogo](catalog/README.md)

Guia de Instalacion General
-

Este proyecto utiliza varias tecnologias, las siguientes dependencias son necesarias antes de comenzar a compilar y ejecutar aplicaciones. Es necesario seguir los tutoriales en cada uno de los microservicios. En general hay 2 entornos, uno Node y uno Python, habiendo configurado estos dos entornos, se podra ejecutar todo el proyecto.

Dependencias globales
=
Estas son dependencias compartidas, cada microservicio tiene su propia base de datos, pero para simplificar la configuracion, en estos ejemplos vamos a compartir instancias de db. Pero en un entorno real cada servicio debe configurar su entorno.

MongoDB
-

Seguir las guias de instalacion de mongo desde el sitio oficial

<https://www.mongodb.com/download-center#community>

No se requiere ninguna configuracion adicional, solo levantarlo luego de instalarlo.

Crear una carpeta donde se guardara la db de mongo : bin/data por ejemplo

Ejecucion manual

```bash
bin/mongod --dbpath ./data
```

Sugiero instalar Mongodb Compass para poder navegar la base de datos en forma visual

<https://www.mongodb.com/products/compass>

Redis
-

Seguir los pasos de instalacion desde la pagina oficial

<https://redis.io/download>

No se requiere ninguna configuracion adicional, solo levantarlo luego de instalarlo.

Para windows se puede descargar en modo standalone : <https://sourceforge.net/projects/redis/>

Ejecucion manual

```bash
redis-server
```

Recomiendo instalar FastoRedis para navegar la base de datos <https://fastoredis.com/>

RabbitMQ
-

Seguir los pasos de instalacion en la pagina oficial

<https://www.rabbitmq.com/>

No se requiere ninguna configuracion adicional, solo levantarlo luego de instalarlo.

Ejecucion manual

```bash
sbin/rabbitmq-server
```
