# Seismic events

## Install
```
git clone https://github.com/g-div/seismic-viz
npm install
```

The project uses [dotenv](https://github.com/motdotla/dotenv), so you should export the necessaries environment variables or use an `.env` file like the following:

```
HOST=localhost
PORT=9000
CORS=true
SEISMICPORTAL_URL=http://localhost:9090/standing_order
DB_NAME=earthquakes
DB_TABLE=quakes

# for development
MOCK_PORT=9090
MOCK_INTERVAL=2000
```

## Run

It requires a running instance of RethinkDB. A `docker-compose.yml` file is provided, just run:
```
docker-compose up
```

And your RethinkDB instance will be started. For configurations please refer to the `docker-compose.yml` file.

### Development
```
npm run dev
```
This will start a watching development server and a SockJS server producing fake events (emulating seismicportal.eu).

### Production

```
npm run deploy
```