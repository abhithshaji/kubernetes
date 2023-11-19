FROM node:14-alpine
WORKDIR /go/src/github.com/chaincode/fabland/
COPY ./ /go/src/github.com/chaincode/fabland/
RUN npm install
CMD [ "npm","start" ]