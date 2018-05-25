Microservicio de Seguridad

Se encarga de registrar y autenticar usuarios en el sistema

La documentacion de las api se pueden consultar desde el home del microservicio
que una vez levantado el servidor se puede navegar en http://localhost:3000/


Instalar MongoDB
================
Ubuntu:

	echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list

	sudo apt-get update
	sudp apt-get isntall mongodb

	Se arranca como
		sudo service mongodb start

	Configurar para que arranque solo al inicio
		sudo systemctl enable mongod.service

Instalar Mongodb Compass para poder navegar la base de datos


Levantar mongodb manualmente
===================================
	en bin de mongodb
	./mongod --dbpath ./data


Ejecucion
=========
Pasos para ejecutar el proyecto :
	Parase en la carpeta auth (o sea la raiz de este microservicio), y ejecutar :

		npm install
		npm start

	Deberia abrir el servidor en el puerto 3000

