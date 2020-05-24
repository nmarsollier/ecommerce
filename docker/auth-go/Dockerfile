# Docker produccion o stage
FROM golang:1.14.3-buster

RUN go get github.com/nmarsollier/authgo
WORKDIR /go/src/github.com/nmarsollier/authgo
RUN go mod download
RUN go mod vendor
RUN go install 

# Puerto de Auth Service 
EXPOSE 3000

CMD ["authgo"]

