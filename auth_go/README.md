Experimental : Auth Service en GO
==

Requisitos
-

Go 1.10  <https://golang.org/doc/install>

Configuración inicial
-

establecer variables de entorno (consultar documentación de la version instalada)

```bash
export GOPATH="$HOME/go"
export GOROOT=/usr/local/go
export PATH="$PATH:$GOPATH/bin:$GOROOT/bin"
```

Para evitar problemas de repositorios y librerías con GOPATH, hacemos un enlace simbólico en la carpeta $HOME/go/src

```bash
ln -s ./auth_go/src/ $GOPATH/src/auth
```

Instalar Librerías requeridas
-

```bash
go get github.com/gin-gonic/gin
go get github.com/mongodb/mongo-go-driver/mongo
go get golang.org/x/crypto/bcrypt
go get github.com/dgrijalva/jwt-go
go get github.com/itsjamie/gin-cors
go get github.com/patrickmn/go-cache
go get github.com/streadway/amqp
go get github.com/gin-contrib/static
```

Build y ejecución
-

Parados en la carpeta auth_go :

```bash
go install auth
auth
```

Apidoc
-

La documentación necesita ser generada manualmente ejecutando la siguiente linea en la carpeta auth_go :

```bash
../auth/node_modules/apidoc/bin/apidoc -s src -o public
```

Esto nos genera una carpeta public con la documentación, esta carpeta debe estar presente desde donde se ejecute auth, auth busca ./public para localizarlo, aunque se puede configurar desde el archivo de properties.
