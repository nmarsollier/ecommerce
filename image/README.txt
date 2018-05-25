Este microservicio almacena las imagnes en una base de datos clave-valor (redis)

Instalar Redis
==============
	sudo apt-get install redis
	sudo apt-get install php-redis

	vim /etc/redis/redis.conf
	maxmemory 128mb

	redis-cli para probar si esta funcionando

	Para navegar los documentos conviene instalar FastoRedis

Levantar redis manualmente
===================================
	en src de redis
	redis-server



Ejecucion
=========
Pasos para ejecutar el proyecto :
	Abrir el folder node del proyecto mascotas y ejecutar :
		npm install
		npm start

		Deberia abrir el servidor de backend en el puerto 3001

