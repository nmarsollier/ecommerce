# Docker produccion o stage
FROM golang:1.14.3-buster

WORKDIR /go/src/github.com/nmarsollier/imagego
RUN curl -L https://github.com/nmarsollier/imagego/tarball/master | tar xz --strip=1
RUN go mod download
RUN go mod vendor
RUN go install 

# Puerto de Image Service 
EXPOSE 3001

CMD ["imagego"]

