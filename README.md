# PeaceofMindSpine.com ( Node.js )

Built for an out of office spine specialist and for the clients who need a second-opinion spine analysis.

My business partner took care of the deployment, designs and being the point of contact. I brainstormed and offered ideas, then researched and developed the web's fullstack, both backend and frontend frameworks, moving across data management, security features and user interface.

Written in Typescript Node as a backend with lightweight SQLite database and Knex query builder. React for the UX. The rest are dependencies as documented on the README.

The application is currently going through a few additional features- such as secret management with Docker container, and adding a certificate for the secure protocol and third-party OAuth integration.

## Requirements
  
  This application is the backend portion.
  For frontend, please clone and see more details on [myspine-react](https://github.com/DreamTechSyndicate/myspine-react)

## Scripts

### Initial Configuration

  Run scripts `yarn && yarn build`

### Development Phase

  #### Run `yarn build` when
  - Changes or see changes in tsconfig.json / webpack.config.js
  - Deploy to a production enviro

  #### Run `yarn` when
  - Changes or see changes in Package.json

  #### Run `yarn audit` and|or `yarn outdated` whenREA
  - Whenever you want to check dependency vulnerabilities && integrity respectively

  #### Run `yarn cache clean` when 
  - Whenever you want to clear local packages cache

# Frameworks
1. **Express.js** : Flexible and performant web API framework
2. **TypeScript** : Static+dynamic typed language, compiled to JavaScript
3. **Jest**       : Straightforward JavaScript test framework

## Dependencies
For development and production stages

1. **Knex.js** : SQL Query Builder
2. **SQLite** : Lightweight transactional relational database
3. **SQLite3** : Lightweight library for interactive SQLite in terminal & command prompt
4. **cors** : Safety middleware for Browser<>Server's Cross-Origin Resource Sharing
5. **express-rate-limit** : Brute-force rate limitor for Express.js routes
6. **express-session** : Session management for Express.js
7. **helmet** : Secure HTTP response headers against known CSRF attacks and other known vulnerabilities
8. **nodemon** : A daemon that automatically watches, restarts and executes the application (See nodemon.json)
9. **jsonwebtoken** : JWT Token generation + verification with symmetric/asymmetric signatures
10. **crypto** : Cryptographic functionalities including OpenSSL hash, HMAC, cipher, decipher, sign and verify
11. **uuid** : Universally Unique Identifier, 128-bit presented as 32-char hexadecimal string

## Other devDependencies
For development stage

1. **better-sqlite3-session-store** : Session-store for express-session in SQLite DB
2. **dotenv** : Environment loading module 
3. **http-terminator** : Graceful http servers termination logic
4. **Prettier** : Opinionated formatter for code consistency and style
5. **eslint** : Guidelines for code convention and style
6. **eslint-plugin-prettier** : Prettier as a linter rule
7. **eslint-config-prettier** : Prettier without linter rule conflicts
8. **supertest** : Node.js HTTP requests-responses testing libary
9. **ts-jest** : Typescript processor with source map support for Jest
10. **babel-jest** : JavaScript Transformer for Jest using Babel
