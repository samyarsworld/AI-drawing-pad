FROM node:latest
WORKDIR /app
COPY ./package*.json ./
RUN apt-get update && \
    apt-get install -y python3

RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]