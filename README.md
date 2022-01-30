# Online store application

## Used stack:
- `Docker` and `docker-compose`
- `Node.js:14`
- `Postgres:14`
- `Angular`

## Application setup:
1. Copy `.env.example` file into `.env` file.
2. Start application by running `docker-compose up -d`
3. (For initial database setup):
3.1 Connect to `server-app` container using: `docker exec -it stage-2-catalog-server-app-1 bash`
3.2 Run commands:
    ```
        npm run update-db
        npm run seed-db
    ```
FE is published on `http://localhost:4200` (default)
BE is published on `http://localhost:3000` (default)