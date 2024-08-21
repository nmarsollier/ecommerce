FROM fluent/fluentd:v1.16-1

USER root

RUN apk add --no-cache --update build-base ruby-dev
RUN gem install fluent-plugin-mongo

USER fluent

COPY fluent.conf /fluentd/etc/fluent.conf

RUN mkdir -p /fluentd/log

CMD ["fluentd", "-c", "/fluentd/etc/fluent.conf"]
