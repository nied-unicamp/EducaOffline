FROM node:14.19.3


WORKDIR /webapp/


RUN npm i -g @angular/cli@13.2.4


COPY package.json /webapp/


CMD ["npm", "i"]


COPY ./ /webapp/


CMD [ "npm", "start", "--", "--host", "0.0.0.0", "--port", "4200" ]


EXPOSE 4200
