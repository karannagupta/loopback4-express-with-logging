import { inject } from "@loopback/context";
import { ErrorLogger } from "../models";
import { post, requestBody, RestBindings, Request } from "@loopback/rest";
import { winstonLogger as logger } from "../lib/logger";

interface IdRequest extends Request {
  // express-request-id was added from the middleware.
  id: string;
}

export class ErrorLoggerController {
  constructor() {}

  @post("/errorlogger", {
    responses: {
      "200": {
        description: "Whether the error was logged",
        content: {
          "application/json": { schema: { "x-ts-type": ErrorLogger } }
        }
      }
    }
  })
  async logError(
    @inject(RestBindings.Http.REQUEST) request: IdRequest,
    @requestBody({
      description: "The error message",
      required: true
    })
    error: ErrorLogger
  ): Promise<Object> {
    // log the error to the transport.
    logger.log(
      "error",
      "%s - %s - %s - %s",
      request.id,
      request.connection.remoteAddress,
      error.message,
      request.headers["user-agent"]
    );

    return { logged: "true" };
  }
}
