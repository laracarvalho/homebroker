# Booking

Microservice written in Go to manage booking actions for the home broker.

## Installation
It is recommended to run the whole Homebroker project together, but to use this project _alone_, follow these steps:

- Clone the repository: `git clone https://github.com/laracarvalho/homebroker.git`
- Enter project: `cd booking`
- Install the dependencies: `go mod download`
- Build the application: `go build`

## How to run
This service uses Kafka for its communications, so the container *must* be running before running the program.

- Download Kafka container: `docker pull confluentinc/cp-kafka`
- Run Kafka container: `docker run confluentinc/cp-kafka`
- Run the application: `./cmd/trade/main`

## Dependencies

This project uses the following tools:

- [Golang](https://golang.org/) for backend development
- [UUID](https://github.com/google/uuid) for ID generation
- [Testify](https://github.com/stretchr/testify) for testing framework
- [Kafka](https://github.com/confluentinc/confluent-kafka-go/kafka) for Kafka integration