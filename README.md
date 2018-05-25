# pa2018_microservicios
Universidad Tecnologica Nacional - FRM
Arquitectura de Microservicios 2018

Este proyecto es un ejemplo de como armar una arquitectura de microservicios, posee varias tecnlogias, entre ellas :
    Node, MongoDb, Redis

Al ser una arquitectura de microservicios cada directorio dentro de la raiz del proyecto es un microservicio, leer los pasos documentados en cada proyecto en los archivos README.txt


Guia de Instalacion General
===========================
Este proyecto utiliza varias tecnologias, las siguientes dependencias son necesarias antes de comenzar a compilar y ejecutar aplicaciones.

Instalar Node con npm verison 8
===============================

https://nodejs.org/en/


Instalar MongoDB
================

Recomiendo seguir las guias de instalacion de mongo desde el sitio oficial https://www.mongodb.com/download-center#community

Crear una carpeta donde se guardara la db de mongo : C:\data por ejemplo

Ejecucion : "C:\Program Files\MongoDB\Server\3.6\bin\mongod.exe" --dbpath C:\data

Sugiero instalar Mongodb Compass para poder navegar la base de datos en forma visual https://www.mongodb.com/products/compass


Instalar Redis
==============

Seguir los pasos de instalacion desde la pagina oficial https://redis.io/download
Para windows conviene un ejecutable : https://sourceforge.net/projects/redis/
	Ejecutar redis-server-exe (windows)

Recomiendo instalar FastoRedis para navegar la base de datos https://fastoredis.com/
