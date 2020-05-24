# Docker para produccion o stage
FROM gradle:6.4.1-jdk11

WORKDIR /app

RUN curl -L https://github.com/nmarsollier/ecommerce_catalog_java/tarball/master | tar xz --strip=1
RUN gradle build

# Puerto de Catalog Service
EXPOSE 3002

CMD ["gradle","run"]
