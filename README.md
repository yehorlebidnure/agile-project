# stage-2-catalog Node.js + Angular

### How to download and initialize the project?
1. This repository contains submodule [client submodule] ref : stage-2-catelog-client git. To clone repository use:
```bash
$ git clone --recursive <this_repository_url> [<folder_name>]
```

2. Install node modules:
```bash
-- install modules
    $ npm run install:client    // install node_modules for the client
    $ npm run install:server    // install node_modules for the server
    $ npm run install:all       // install node_modules for all project
```

3. Dump for database is stored in /db/sql/*_dump.sql where * is date of creating dump;

4. Add .env file with envoronment variables (example: .env.example)

5. Add server url angular environments object: client/src/environments/environment...

6. Now you can run the project:
```bash
-- run development server:
    $ npm run dev:server        // run server using nodemon
    $ npm run dev:client        // run client using ng serve
    $ npm run dev:all           // run both: the client and the server
    $ npm run build:client      // build client
    $ npm run production        // build client and run project using pm2
```