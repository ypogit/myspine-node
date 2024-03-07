# MySpine Node.js

## Scripts

### - Initial Configuration

  Run scripts `yarn && yarn build`

### - Development Phase

  #### Run `yarn build` when
  - Changes or see changes in tsconfig.json / webpack.config.js
  - Deploy to a production enviro

  #### Run `yarn` when
  - Changes or see changes in Package.json

  #### Run `yarn audit` and|or `yarn outdated` when
  - Whenever you want to check dependency vulnerabilities && integrity respectively

  #### Run `yarn cache clean` when 
  - Whenever you want to clear local packages cache

## Framework & Language**
1. **Express.js** : Flexible and performant web API framework
2. **TypeScript** : Static+dynamic typed language, compiled to JavaScript
3. **Jest**       : Straightforward JavaScript test framework

## Dependencies
For development and production stages

1. **Knex.js** : SQL Query Builder
2. **SQLite**  : Lightweight transactional relational database
3. **SQLite3** : Lightweight library for interactive SQLite in terminal & command prompt
4. **cors**    : Safety middleware for Browser<>Server's Cross-Origin Resource Sharing
5. **express-rate-limit** : Brute-force rate limitor for Express.js routes
6. **express-session** : Session management for Express.js
7. **helmet** : Secure HTTP response headers against known CSRF attacks and other known vulnerabilities
8. **nodemon** : A daemon that automatically watches, restarts and executes the application (See nodemon.json)

## Other devDependencies
For development stage

1. **ajv** : JSON schema validator
2. **better-sqlite3-session-store** : Session-store for express-session in SQLite DB
3. **dotenv** : Environment loading module 
4. **http-terminator** : Graceful http servers termination logic
5. **Prettier** : Opinionated formatter for code consistency and style
6. **eslint** : Guidelines for code convention and style
7. **eslint-plugin-prettier** : Prettier as a linter rule
8. **eslint-config-prettier** : Prettier without linter rule conflicts