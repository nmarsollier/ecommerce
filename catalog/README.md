Microservicio de Catalogo de Productos
=

Es un microservicio que permite manejar el catalogo de artículos, precios y stock,

Una vez iniciado el servidor, la documentación puede obtenerse desde <http://localhost:3002/>

Configuración inicial
-

Pip
-

Pip es un gestor de paquetes que nos va a permitir instalar las dependencias de python.

Ubuntu

```bash
sudo apt-get install python-pip
```

Pyenv
-

Pyenv nos permite tener varias versiones de python instaladas en nuestro sistema. Es util para no generar conflicto con los programas que tengamos funcionando actualmente.

Ubuntu

```bash
curl -L https://github.com/pyenv/pyenv-installer/raw/master/bin/pyenv-installer | bash
```

Editar archivo .bashrc y agregar:

```bash
export PATH="~/.pyenv/bin:$PATH"
eval "$(pyenv init -)"
eval "$(pyenv virtualenv-init -)"
```

Antes de instalar cualquier version de python en nuestro sistema tenemos que ver que version tenemos actualmente instalada. Lo hacemos con :

```bash
python --version
```

Si tenemos alguna version instalada tenemos que instalarla en pyenv y establecerla como predeterminada (Reemplazar 2.7.6 por la que sea actal) :

```bash
pyenv install 2.7.6
pyenv global 2.7.6
```

Python 3.6.5
-

A partir de ahora todo lo que ejecutamos, va a ser dentro de la carpeta catalog

```bash
pyenv install 3.6.5
python --version
```

Ahora vamos a instalar las librerías de nuestro proyecto. Parados en el directorio catalog ejecutamos

```bash
pip install -U -r requirements.txt
```

Ahora deberíamos ser capaces de ejecutar el proyecto

```bash
python main.py
```

ACLARACIÓN : Apidoc
-

Este proyecto utiliza apidoc para documentar los servicios rest.

Desafortunadamente apidoc no funciona bien cuando tenemos los ejecutables de apidoc de node y python juntos,  podemos usar el apidoc de algún proyecto node para generar los docs de este proyecto. Cuando queramos generar las apidoc, ejecutamos:

La ejecución del proyecto main genera la documentación, pero usando el ejecutable de auth.

```bash
../auth/node_modules/.bin/apidoc -i ./ -o public
```

