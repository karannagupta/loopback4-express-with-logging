import * as morgan from 'morgan';
import {Request} from 'express';
import {winstonLogger} from './winstonLogger';

interface IdRequest extends Request {
  // express-request-id was added from the middleware.
  id: string;
}

// stream to accept morgan-generated output into winston logs.
class WinstonStream {
  write(message: string) {
    winstonLogger.info(message);
  }
}

// add the request-id to the combined preset.
const format =
  ':request-id :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';

// add the request-id token.
morgan.token('request-id', (request: IdRequest) => request.id);

const winstonStream = new WinstonStream();
const options = {
  stream: winstonStream,
};

const requestLogger = morgan(format, options);
export {requestLogger};
