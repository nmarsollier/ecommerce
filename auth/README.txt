
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
	Abrir el folder node del proyecto mascotas y ejecutar :
		npm install
		npm start

		Deberia abrir el servidor de backend en el puerto 3000

