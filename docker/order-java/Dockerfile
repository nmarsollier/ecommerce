# Docker para produccion o stage
FROM gradle:6.4.1-jdk11

WORKDIR /app
RUN curl -L https://github.com/nmarsollier/ecommerce_order_java/tarball/master | tar xz --strip=1

# Puerto de Order Service
EXPOSE 3004

CMD ["gradle","run"]
