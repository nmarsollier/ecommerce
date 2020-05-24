# Docker produccion o stage
FROM golang:1.14.3-buster

WORKDIR /go/src/github.com/nmarsollier/authgo
RUN curl -L https://github.com/nmarsollier/authgo/tarball/master | tar xz --strip=1
RUN go mod download
RUN go mod vendor
RUN go install 

# Puerto de Auth Service 
EXPOSE 3000

CMD ["authgo"]

