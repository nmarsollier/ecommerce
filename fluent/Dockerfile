FROM fluent/fluentd:v1.16-1

USER root

RUN apk add --no-cache curl
RUN gem install fluent-plugin-sql
USER postgres
RUN curl -o /fluentd/etc/fluent.conf https://raw.githubusercontent.com/nmarsollier/ecommerce/master/fluent/fluent.conf

RUN apk add --no-cache --update build-base ruby-dev

RUN mkdir -p /fluentd/log

CMD ["fluentd", "-c", "/fluentd/etc/fluent.conf"]
