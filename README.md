# Use
``` powershell
$ npm install 
$ npm run start:dev
```

## Debug mode
``` powershell
$ npm run start:debug
# in vscode press F5 of launch debug "Attach NestJS WS"
```

## MongoDB
the application requires mongo db installed on local host. To use mongo db "streamingevents", MongoDB must be configured as a ReplicaSet. 
``` powershell
$ npm run mongo:install   # will install mongoDB as a Windows Service Replica Set
$ npm run mongo:uninstall # will remove mongoDB from your computer 
```

# Creation Steps
## Create NestJS default project
``` powershell
$ npm install -g @nestjs/cli
$ nest new [app-name]
```
- update all packages to it's newest version

## Add service env (to type and check environment variables)
Creates typed environment variables
``` powershell
$ npm install cross-env dotenv-flow
```
1. folder ./services/env
2. files .env, .env.development, .env.production with environment variables
3. package.json update scripts with   
``` json
        "build": "cross-env NODE_ENV=production nest build",
        "start": "cross-env NODE_ENV=development nest start",
        "start:dev": "cross-env NODE_ENV=development nest start --watch",
        "start:debug": "cross-env NODE_ENV=development nest start --debug --watch",
        "start:prod": "cross-env NODE_ENV=production node dist/main",
```
4. Update ./src/services/env/Environment.ts file

## Add service jwt   (to jwt authentification) 
``` powershell
$ npm install jsonwebtoken @types/jsonwebtoken
```
- folder ./services/jwt

## Add service crypt (to encrypt user password)
``` powershell
$ npm install bcryptjs @types/bcryptjs
```
- folder ./services/crypt

## Add db service and models
``` powershell
$ npm install @nexjs/wsserver @types/socket.io moment @types/moment # for models
$ npm install mongodb @types/mongodb strongly-typed-events # for mongodb
```

|  |  |
|--|--|
| src/lib/db  | multidatabase manager and models based con entity-component |
| src/service/db   | specific implementation. 2 DataBase Main and Events. |
| src/models | specific sample models |

## Add swagger 
[see](https://docs.nestjs.com/openapi/introduction)
``` shell
npm install --save @nestjs/swagger swagger-ui-express
```

``` typescript
// main.ts
    logger.log('initialize  swagger');
    const options = new DocumentBuilder()
        .addServer('http://localhost:3000')
        .addServer('https://api.nexjs.io')
        .setTitle(env.package.name)
        .setDescription(env.package.description)
        .setVersion(env.package.version)
        .build();
    const document = SwaggerModule.createDocument(app, options);

    // create swagger especification file output. Used by openapi-generator.
    const path = resolve(__dirname, 'swagger-spec.json');
    logger.log(`Write swagger definition file: ${path}`);
    writeFileSync(path, JSON.stringify(document));

    SwaggerModule.setup(env.vars.server.api.doc_path, app, document);
```
## Add static web pages
``` powershell
$ npm install --save @nestjs/serve-static
```
``` typescript
// in app.module.ts
Module({
  imports: [
    ...,
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'public') }),
  ],
  controllers: [...],
  providers: [...],
})
export class AppModule { }
```
- folder public files

## Add Websockets and contracts
``` powershell
$ npm install --save @nestjs/websockets @nestjs/platform-socket.io @nexjs/wsserver
```
``` typescript
// in main.ts
app.useWebSocketAdapter(new IoAdapter(app));
```
|  |  |
|--|--|
| src/lib/contracts | base class for all contracts (helper)
| src/contracts | specific contracts implementation
| src/auth | authentification strategy for @nexjs/wsserver class
| src/app.gateway.ts | all websocket initializations and contracts registration
| app.module.ts | register as provider AppGateway and all Contracts


## Add Nestjs Configs
``` powershell
$ npm install class-validator class-transformer --save
```
``` typescript
app.setGlobalPrefix(env.vars.server.api.base_path);
app.useGlobalPipes(new ValidationPipe({ transform: true }));
```

## Add Express Configs
``` powershell
npm install --save helmet @types/helmet morgan @types/morgan
```
- helmet ( security )
- cors (api call from any url)
- morgan (console ouput formatter)
``` typescript
// in main.ts
app.enableCors({
        origin: true,
        optionsSuccessStatus: 200,
        credentials: true,
    });
app.use(helmet);
app.use(morgan('tiny', { skip: ((req: any) => req.url.startsWith('/socket.io')) }));
```

## Add Http Auth Module 
``` powershell
npm install --save     passport passport-jwt passport-local
npm install --save-dev @types/passport-jwt @types/passport-local
npm install --save     @nestjs/passport @nestjs/jwt
npm install --save     express-session
npm install --save-dev @types/express-session
```
- src/module/auth folder
``` typescript
// in main.ts add 
...

import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
...
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    }));

    app.use(passport.initialize());
    app.use(passport.session());
...
}
```