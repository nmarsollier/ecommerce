Experimental : Auth Service en GO
==

Instalar go

'''bash
sudo apt-get install golang-go
'''

Pararse en el proyecto y escribir 
'''bash
export GOPATH=$(pwd)
'''

para builder
'''bash
go install auth
'''

para ejecutar
'''bash
./bin/auth
'''

Librerias requeridas

'''bash
go get github.com/gin-gonic/gin
go get github.com/mongodb/mongo-go-driver/mongo
go get golang.org/x/crypto/bcrypt
go get github.com/dgrijalva/jwt-go
'''
