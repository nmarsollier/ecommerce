Arquitectura de Microservicios
=

Este proyecto es un ejemplo de como armar una arquitectura de microservicios, posee varias tecnlogias, entre ellas :
    Node, MongoDb, Redis

Al ser una arquitectura de microservicios cada directorio dentro de la raiz del proyecto es un microservicio, leer los pasos documentados en cada proyecto en los archivos README.txt

[Seguridad](auth/README.md)\
[Imagenes](image/README.md)


Guia de Instalacion General
-
Este proyecto utiliza varias tecnologias, las siguientes dependencias son necesarias antes de comenzar a compilar y ejecutar aplicaciones.

Instalar Node 8
-
Seguir los pasos de instalacion del sitio oficial

https://nodejs.org/en/


Instalar MongoDB
-

Seguir las guias de instalacion de mongo desde el sitio oficial

https://www.mongodb.com/download-center#community

No se requiere ninguna configuracion adicional, solo levantarlo luego de instalarlo.

Crear una carpeta donde se guardara la db de mongo : C:\data por ejemplo

Ejecucion (Windows)

```
"C:\Program Files\MongoDB\Server\3.6\bin\mongod.exe" --dbpath C:\data
```

Sugiero instalar Mongodb Compass para poder navegar la base de datos en forma visual

https://www.mongodb.com/products/compass


Instalar Redis
-

Seguir los pasos de instalacion desde la pagina oficial

https://redis.io/download

No se requiere ninguna configuracion adicional, solo levantarlo luego de instalarlo.

Para windows se puede descargar en modo standalone : https://sourceforge.net/projects/redis/

Ejecucion (Windows)
```
redis-server.exe
```

Recomiendo instalar FastoRedis para navegar la base de datos https://fastoredis.com/

Instalar RabbitMQ
-

Seguir los pasos de instalacion en la pagina oficial

https://www.rabbitmq.com/

No se requiere ninguna configuracion adicional, solo levantarlo luego de instalarlo.
