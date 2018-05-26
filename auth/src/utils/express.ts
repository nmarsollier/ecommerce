"use strict";

import { Config } from "./environment";

import * as express from "express";
import * as bodyParser from "body-parser";
import * as morgan from "morgan";
import * as path from "path";
import * as helmet from "helmet";
import * as cors from "cors";
import * as compression from "compression";
import * as passport from "passport";
import * as expressValidator from "express-validator";

// Modulos de la aplicacion
import * as securityModule from "../security/module";
import * as error from "../utils/error";
import * as pasportConf from "../security/passport.service";

export function init(appConfig: Config): express.Express {
  // Notas de configuracion de express http://expressjs.com/es/guide/using-middleware.html#middleware.application
  const app = express();
  app.set("port", appConfig.port);

  // Habilitar Cors
  app.use(cors({
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true
  }));

  // Si estamos en level debug, debaguear los request
  if (appConfig.logLevel == "debug") {
    app.use(morgan("dev"));
  }

  // Configuramos el server para que tome los json correctamente
  app.use(bodyParser.urlencoded({ extended: true, limit: "20mb" }));
  app.use(bodyParser.json({ limit: "5mb" }));

  // Configurar express para comprimir contenidos de text en http
  app.use(compression());

  // Configuramos passport, authenticacion por tokens y db
  app.use(passport.initialize());
  app.use(passport.session());

  // Permite hacer validaciones de parametros req.assert
  app.use(expressValidator());

  // helmet le da seguridad al sistema para prevenir hacks
  app.use(helmet.xssFilter());  // Previene inyeccion de javascript
  app.use(helmet.noSniff());
  app.use(helmet.ieNoOpen());
  app.disable("x-powered-by");

  // Esta es la ruta de contenidos estaticos, no deberian haber muchos pero algo de documentacion
  // vendria bien como contenido estatico.
  app.use(
    express.static(path.join(__dirname, "../public"), { maxAge: 31557600000 })
  );
  app.get("/", (req, res, next) => { res.redirect("index.html"); });

  // Inicializamos nuestros modulos
  pasportConf.init();

  // Inicializamos las rutas del directorio
  // mas sobre rutas http://expressjs.com/es/guide/routing.html
  securityModule.init(app);

  // Para el manejo de errores, para que los loguee en la consola
  app.use(error.logErrors);

  // Responder con JSON cuando hay un error 404, sino responde con un html
  // Esto tiene que ir al final porque sino nos sobreescribe las otras rutas
  app.use(error.handle404);

  return app;
}
