Experimental : Auth Service en GO
==

Rquisitos
-

Go 1.10.1

Configuración inicial
-

establecer variables de entorno (consultar documentación de la version instalada)

```bash
export GOPATH="$HOME/go"
export GOROOT=/usr/local/go
export PATH="$PATH:$GOPATH/bin:$GOROOT/bin"
```

Para evitar problemas de repositorios y librerias con GOPATH, hacemos un enlace simbolico en la carpeta $HOME/go/src

```bash
ln -s /home/nestor/Dev/utn/2018_microservicios/auth_go/src/ $GOPATH/src/auth
```




Instalar Librerias requeridas
-

```bash
go get github.com/gin-gonic/gin
go get github.com/mongodb/mongo-go-driver/mongo
go get golang.org/x/crypto/bcrypt
go get github.com/dgrijalva/jwt-go
```

Buildeo y ejecucion
-

```bash
go install auth
auth
```
