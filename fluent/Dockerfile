FROM fluent/fluentd:v1.16-1

USER root

RUN apk add --no-cache curl
RUN curl -o /fluentd/etc/fluent.conf https://raw.githubusercontent.com/nmarsollier/ecommerce/master/fluent/fluent.conf

RUN apk add --no-cache --update build-base ruby-dev
RUN gem install fluent-plugin-mongo

USER fluent

RUN mkdir -p /fluentd/log

CMD ["fluentd", "-c", "/fluentd/etc/fluent.conf"]
