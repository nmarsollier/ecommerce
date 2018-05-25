# pa2018_mascotas
Proyecto Red social de Masctoas, ejemplo de codigo para la catedra "Programacion Avanzada" en la Universidad Tecnologia Nacional, Facultad Regional Mendoza. Año 2018.

Este proyecto es un ejemplo de como armar un proyect Node 6 con Typescript como backend, y Angular 4 como frontend.

El proyecto tiene 2 carpetas

angular :  Frontend desarrollado en angular 4.

node-ts : Node con typescript para backend.


Guia de Instalacion :
---------------------

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


Ejecucion
=========
Pasos para ejecutar el backend :
	Abrir ventana de comandos en el folder node-ts y ejecutar :
		npm install
		npm start

		Deberia abrir el servidor de backend en el puerto 3000

Para ejecutar el front
	Abrir ventana de comandos en el folder de angular y tipear
		npm install
		npm start

		Deberia abrir el servidor de backend en el puerto 4200

		Desde un browser debemos abrir http://localhost:4200/

