FROM node:10.13-alpine
ENV NODE_ENV production
WORKDIR /usr/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install
EXPOSE 8000
COPY . .
CMD ["npm", "start"]
