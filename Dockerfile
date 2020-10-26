FROM node:12-alpine

WORKDIR /usr/app
ADD . /usr/app

RUN apk add --no-cache --virtual \
    .gyp \
    python \
    python2 \
    make \
    g++ \
    yarn \
    bash \
    postgresql-client \
    libtool \
    autoconf \
    automake

RUN yarn install --ignore-optional
