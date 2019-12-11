/**
 * This file exports a fully-configured Express app.
 *
 * All Express configuration (mounting LB4, mounting custom middleware, defining routes)
 * should be done in this file.
 */

import { Lb4Application } from "./application";
import { ApplicationConfig } from "@loopback/core";
import { Request, Response, json, urlencoded } from "express";
import { winstonLogger } from "./lib/logger";
import { requestLogger } from "./lib/logger";
import { HttpError } from "http-errors";
import { messages, codes } from "./lib/error";
import * as express from "express";
import * as path from "path";
import * as pEvent from "p-event";
import * as http from "http";
import * as cors from "cors";
import * as helmet from "helmet";
import * as cookieParser from "cookie-parser";
const expressRequestId = require("express-request-id")();

export class ExpressServer {
  private app: express.Application;
  public readonly lbApp: Lb4Application;
  private server: http.Server;
  private options: ApplicationConfig

  constructor(options: ApplicationConfig = {}) {
    this.app = express();
    this.lbApp = new Lb4Application(options);
    this.options = options

    // enable cross-origin-resource-sharing.
    this.app.use(cors());

    // protect our headers.
    this.app.use(helmet());

    // add a request-id to each requests to track requests in logs.
    this.app.use(expressRequestId);

    // use the combined winston and morgan loggers.
    this.app.use(requestLogger);

    // express middleware for requests.
    this.app.use(json());
    this.app.use(urlencoded({ extended: false }));
    this.app.use(cookieParser());

    // loopback api will be mounted at /api
    this.lbApp.basePath("/");

    // Expose the Loopback API on the /api route.
    this.app.use("/api", this.lbApp.requestHandler);

    // Custom Express routes
    this.app.get("/", function(_req: Request, res: Response) {
      res.sendFile(path.resolve("public/express.html"));
    });
    this.app.get("/hello", function(_req: Request, res: Response) {
      res.send("Hello world!");
    });

    // Serve static files in the public folder
    this.app.use(express.static("public"));

    // error handler
    this.app.use((err: HttpError, req: Request, res: Response, next: any) => {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get("env") === "development" ? err : {};

      // log the error.
      winstonLogger.error(
        `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
          req.method
        } - ${req.ip}`
      );

      // render the error
      if (err) {
        res.status(codes.SERVER_ERROR).send(messages.SERVER_ERROR);
      }
    });
  }

  public async boot() {
    await this.lbApp.boot();
  }

  public async start() {
    this.server = this.app.listen(this.options.rest.port);
    await pEvent(this.server, "listening");
  }

  // For testing purposes
  public async stop() {
    if (!this.server) return;
    this.server.close();
    await pEvent(this.server, "close");
  }
}
