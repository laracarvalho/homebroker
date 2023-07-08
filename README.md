# Home Broker

A home broker simulator consisting in a booking application written in Go, a backend built with NestJS and a frontend using Next.js.

## The applications

- Booking: an application written in Go that simulates trading operations and runs indefinetely in the background writing operations to Apache Kafka.
- Backend: an API using NestJS that receives operations from Apache Kafka and allows for usage by the frontend.
- Frontend: a simple front that allows users to do BUY/SELL operations and see their asset's history. _Frontend is still WIP_


## Installation
Please note that this project works as four services. Individual READMEs are available in each project folder for more information.

To run Homebroker, follow these steps:

- Clone the repository: `git clone https://github.com/laracarvalho/homebroker.git`
- Install booking (Golang) project:
  - Enter project: `cd booking`
  - Install the dependencies: `go mod download`
  - Build the application: `go build`
- Install backend (Node/Nest.js) project:
  - Enter project: `cd backend`
  - Install the dependencies: `npm install`
  - You can run the application as dev: `npm run start:dev`
  - Or you can build and run it `npm run build && npm run start:prod`
- Install frontend (React/NextJS) project:
  - Enter project: `cd frontend`
  - Install the dependencies: `npm install`
  - You can run the application as dev: `npm run dev`
  - Or you can build and run it `npm run build && npm run start`
- Download Kafka container: `docker pull confluentinc/cp-kafka`

## How to run
- Run Kafka container: `docker run confluentinc/cp-kafka`
- Run the Booking application: `./cmd/trade/main`
- Run the backend: `npm run start:dev`
- Run the frontend: `npm run dev`

Now you can add some assets to the Kafka queue and start using the Homebroker.

## Technologies

- Go
- NodeJS w/ NestJS
- Next.js
- Apache Kafka