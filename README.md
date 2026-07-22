# Installation

Clone the repo with `git clone https://github.com/alces-software/better-redfish-parser`

## Docker

Ensure [docker](https://docs.docker.com/engine/install/) is installed with the docker-compose plugin, and the docker daemon is running

`systemctl status docker`

Create `.env` files in the frontend and backend folders

In `frontend/.env`:
```
NEXT_PUBLIC_API_URL=http://<hostname>/api
```

In `backend/.env`:
```
MONGO_URI=mongodb://database:27017
MONGO_DATABASE=redfish
PORT=3000
```

run `docker compose up` in the root directory

The system will be running on http://\<hostname>

## Redfish Helper CLI

If you would like to use the Redfish Helper CLI to collect Redfish data and generate JSON for this application, see the following repository:

https://github.com/a04b04/redfish-cli

Follow the installation instructions in that repository, then use the generated JSON with this parser.
