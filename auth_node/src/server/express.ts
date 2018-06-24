"use strict";

import * as bodyParser from "body-parser";
import * as compression from "compression";
import * as cors from "cors";
import * as express from "express";
import * as helmet from "helmet";
import * as morgan from "morgan";
import * as passport from "passport";
import * as path from "path";
import * as token from "../token";
import * as error from "../server/error";
import { Config } from "./environment";
import * as routes from "./routes";

export function init(appConfig: Config): express.Express {
  const app = express();
  app.set("port", appConfig.port);

  // Habilitar Cors
  app.use(cors({
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true
  }));

  // Si estamos en level debug, log de los request
  if (appConfig.logLevel == "debug") {
    app.use(morgan("dev"));
  }

  // Configuramos el server para que tome los json correctamente
  app.use(bodyParser.urlencoded({ extended: true, limit: "20mb" }));
  app.use(bodyParser.json({ limit: "5mb" }));

  // Configurar express para comprimir contenidos de text en http
  app.use(compression());

  // Configuramos passport, authentication por tokens y db
  app.use(passport.initialize());
  app.use(passport.session());

  // helmet le da seguridad al sistema para prevenir hacks
  app.use(helmet.xssFilter());  // Previene inyección de javascript
  app.use(helmet.noSniff());
  app.use(helmet.ieNoOpen());
  app.disable("x-powered-by");

  // Esta es la ruta de contenidos estáticos, no deberían haber muchos pero algo de documentación
  // vendría bien como contenido estático.
  app.use(
    express.static(path.join(__dirname, "../public"), { maxAge: 31557600000 })
  );
  app.get("/", (req, res, next) => { res.redirect("index.html"); });

  // Iniciamos passport
  token.initPassport();

  // Iniciamos las rutas del directorio
  // mas sobre rutas http://expressjs.com/es/guide/routing.html
  routes.init(app);

  // Para el manejo de errores, para que los loguee en la consola
  app.use(error.logErrors);

  // Responder con JSON cuando hay un error 404, sino responde con un html
  // Esto tiene que ir al final porque sino nos sobreescribe las otras rutas
  app.use(error.handle404);

  return app;
}
