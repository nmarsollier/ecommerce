Experimental : Auth Service en GO
==

Requisitos
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
```

Build y ejecución
-

```bash
go install auth
auth
```
