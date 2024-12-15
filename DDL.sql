-- Active: 1734267664842@@127.0.0.1@5432@postgres@public
CREATE SCHEMA fluent;

CREATE SCHEMA authgo;


CREATE SCHEMA cartgo;

CREATE SCHEMA cataloggo;

CREATE SCHEMA imagego;

CREATE SCHEMA ordersgo;

CREATE TABLE authgo.tokens (
    id character varying(255) NOT NULL,
    userid character varying(255) NOT NULL,
    enabled boolean NOT NULL
);

CREATE TABLE authgo.users (
    id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    login character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    permissions text[] NOT NULL,
    enabled boolean NOT NULL,
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone NOT NULL
);

CREATE TABLE cartgo.carts (
    id character varying(255) NOT NULL,
    userid character varying(100) NOT NULL,
    orderid character varying(100),
    articles jsonb NOT NULL,
    enabled boolean NOT NULL,
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone NOT NULL
);

CREATE TABLE cataloggo.articles (
    id character varying(255) NOT NULL,
    name character varying(100) NOT NULL,
    description character varying(256) NOT NULL,
    image character varying(100),
    price double precision,
    stock integer,
    created timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    enabled boolean DEFAULT true NOT NULL
);

CREATE TABLE imagego.images (
    id character varying(255) NOT NULL,
    image text NOT NULL
);

CREATE TABLE ordersgo.events (
    id character varying(255) NOT NULL,
    orderid character varying(100) NOT NULL,
    type character varying(50) NOT NULL,
    placeevent json,
    validation json,
    payment json,
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone NOT NULL
);

CREATE TABLE ordersgo.orders (
    id character varying(255) NOT NULL,
    orderid character varying(100) NOT NULL,
    status character varying(50) NOT NULL,
    userid character varying(100) NOT NULL,
    cartid character varying(100) NOT NULL,
    articles json,
    payments json,
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone NOT NULL
);

CREATE TABLE ordersgo.orderstatus (
    id character varying(255) NOT NULL,
    orderid character varying(100) NOT NULL,
    userid character varying(100) NOT NULL,
    placed boolean NOT NULL,
    partialvalidated boolean NOT NULL,
    validated boolean NOT NULL,
    partialpayment boolean NOT NULL,
    paymentcompleted boolean NOT NULL,
    created timestamp without time zone NOT NULL,
    updated timestamp without time zone NOT NULL
);
