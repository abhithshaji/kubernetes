FROM node:14-alpine
WORKDIR /go/src/github.com/chaincode/automobile/
COPY ./ /go/src/github.com/chaincode/automobile/
RUN npm install
CMD [ "npm","start" ]