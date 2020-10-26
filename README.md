# Cluckin

This is the code for the Cluckin Discord bot, created for the Ecosystems server.

This bot is designed to only work with a single server per instance. You may use Cluckin for your own server(s), but you have to set up and host it yourself.

## Running on Docker

You need:
- [Docker](https://docs.docker.com/engine/install) and [Docker Compose](https://docs.docker.com/compose/install)

1. Create a `.env` file in the project root with the following variables (change to your own values):
```sh
NODE_ENV=development
DBUSER=your-database-username
DBPASS=a-good-password
DBNAME=your-database-name
```

2. Run `docker-compose up -d` in the project root.