# Comment Microservice API
To manage comments on posts of a blog or wiki page.

## About
This is a Typescript version of the project [DevMastery Comments Microservice API](https://github.com/dev-mastery/comments-api)
written in JavaScript. 

The goal of this project is to be a starting point to show what Clean Architecture would look like
in a real world application. This project tries to follow the rules of Uncle Bob's Clean Architecture. You will also find
it named [hexagonal](http://alistair.cockburn.us/Hexagonal+architecture),
[ports-and-adapters](http://www.dossier-andreas.net/software_architecture/ports_and_adapters.html),
or [onion architecture](http://jeffreypalermo.com/blog/the-onion-architecture-part-1/).

> The center of your application is not the database. Nor is it one or more of the frameworks you may be using.
>**The center of your application is the use cases of your application**  -  _Unclebob_
>([source](https://blog.8thlight.com/uncle-bob/2012/05/15/NODB.html "NODB"))

:warning: This is still (and maybe will always be) under development! Any PR is greatly welcome! :smile:

## Features
* XSS Protection (via [sanitize-html](https://www.npmjs.com/package/sanitize-html))
* Flags Spam (via [Akismet](https://akismet.com/))
* Flags rude or inappropriate language (English only via [Content Moderator](https://contentmoderator.cognitive.microsoft.com))
* Flags personally identifiable information (English only via [Content Moderator](https://contentmoderator.cognitive.microsoft.com))
* Dependency Injection done with the nice framework from [Awilix](https://github.com/jeffijoe/awilix).
* OpenAPI documentation done by [Swagger UI Express](https://github.com/scottie1984/swagger-ui-express).

## Prerequisites
To build and run this service locally you have two options:
1. Docker (**Recommended**) -  _Develop as close to production as you can_
    - Install [Docker for Linux](https://docs.docker.com/engine/install/), [Docker for Mac](https://docs.docker.com/docker-for-mac)
      or [~~Docker for Windows~~](https://docs.docker.com/docker-for-windows/).
      For Windows, we recommend use [WSL2](https://docs.microsoft.com/en-us/windows/wsl/install-win10)
    - Install [docker-compose](https://docs.docker.com/compose/)
2. Install the tools directly on your machine (traditional).
    - Install [Node.js](https://nodejs.org/en/download/) - Required to set up the Server (Version: >=10 <=14).
    - Install [MongoDB Community Server](https://www.mongodb.com/try/download/community) - Required to set up the database (Version: >=4)

Additional
* [Azure Content Moderator account (free)](https://contentmoderator.cognitive.microsoft.com)
* [Akismet Developer account (free)](https://akismet.com/development/api/#getting-started)
* IDE or Text Editor for example [VS Code](https://code.visualstudio.com/Download)
* Tool for request API's for example [Postman](https://www.getpostman.com/)
* If you use Windows SO, use [Windows Terminal](https://github.com/microsoft/terminal) or some bash emulation like **Git BASH**, **AVOID** use default cmd

## Getting Started

### 1. Clone the repository.
```bash
git clone https://github.com/sagiomc/ts-comments-api <project_name>
```
### 2. Create a `.env` file on the root app directory.
Copy the content of `sampledotenv` and fill the appropriate values.

### Running with Docker.
1. Start up server and database. On the root app directory run the following command:
    ```bash
    docker-compose up
    ```
   > This starts a local server using `nodemon`, which will watch for any file changes and will restart the server
   > according to these changes. The command above will "freeze" your terminal window/tab. If you want to run the api in
   > background you have to run `docker-compose up -d`.
   >
   > With default values, the server will be displayed to you as `http://localhost:3000`. The api use cases will be
   > available in `http://localhost:3000/api/comment`.

   **NOTE**: To change the default values running with Docker, you have to add the following environment variables to `.env` file:
    ```dotenv
    HOST_APP_PORT=<PORT> # Port where you'll consume the api from your host machine Ej. HOST_APP_PORT=8080 --> localhost:8080
    HOST_INSPECT_PORT=<PORT> # Port where you'll inspect the api for debug purposes Ej. HOST_INSPECT_PORT=9229 --> Open socket in localhost:9229   
    HOST_DB_PORT=<PORT> # Port where you'll consume the database server from your host machine Ej HOST_DB_PORT=27029 --> mongodb://localhost:27029
    ```

2. Running commands inside docker containers like install/uninstall npm dependencies. To run commands inside containers
   you have following the next structure on the root api directory:
    ```bash
    docker-compose exec app <my-command>
    ```
   For example:
    ```bash
    docker-compose exec app npm install <dependency> # Installing dependencies
    docker-compose exec app npm run test:watch # Run jest in watch mode
    ```


### Running locally (Traditional)
1. Start up the mongodb server

   Usually this is just: `mongod` on the command line.

2. On the root app directory, install the dependencies and set up the database, running:
    ```bash
    npm start setup
    ```
3. To run in development mode where code is run by `nodemon` and re-transpiled any time:
    ```bash
    npm start serve
    ```
## Project Structure
```
.
├── src
|   ├── domain                - Enterprise business rules
|   |   ├── entities          - Core business rules
|   |   └── {feat-name}       - Business features (add-comment, delete-comment, etc)
|   ├── dataproviders         - Interfaces data adapters implementations
|   └── frameworks            - Frameworks and drivers that exposes the app
├── test                      - Tests directory
|   ├── fixtures              - Accesories for tests
|   └── unit                  - Unit tests, this directory must follow the same structure as "src" directory
├── commands                  - Development utilities like banner and set up the database
└── dist                      - Compiled javascript files
```

## Related Projects
- [dev-mastery/comments-api](https://github.com/dev-mastery/comments-api) - To manage comments on various Dev Mastery properties.
- [mattia-battiston/clean-architecture-example](https://github.com/mattia-battiston/clean-architecture-example) - Clean Architecture Example in Java
- [ardalis/CleanArchitecture](https://github.com/ardalis/CleanArchitecture) - A starting point for Clean Architecture with ASP.NET Core  
