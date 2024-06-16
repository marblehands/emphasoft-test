FROM cypress/base:20.14.0
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npx", "cypress", "run"]