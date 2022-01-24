# Image is based on node:14
FROM node:14

# Creating a working directory
WORKDIR /app

# Setup OS modules for work
RUN apt-get update && apt-get install nano

# Installing global modules for application
RUN npm install -g @angular/cli nodemon knex

# copying project folder into working directiry
COPY package.json .
RUN npm run install:server

COPY ./client/package.json ./client/
RUN npm run install:client

COPY . ./

# Required to wait until db will be ready
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait && /wait

# Update and seed db
# RUN npm run update-db & npm run seed-db

# Actually do nothing (for understanding purposes)
EXPOSE 3000 4200

# Command to run the project
CMD ["npm", "run", "dev:all"]