# loopback4-express-with-logging

This is an example of integrating Winston & Morgan Logging with Loopback 4.
It uses the express-composition example that mounts the LoopBack 4 REST API on a simple
[Express](https://expressjs.com) application. See here for the [express-composition example](https://github.com/strongloop/loopback-next/tree/master/examples/express-composition).

The Express application in this example is based on the [Express Generator](https://expressjs.com/en/starter/generator.html)

## Loopback 4 Express-Composition Setup

You'll need to install the LoopBack 4 CLI toolkit to scaffold your own application:

```sh
npm i -g @loopback/cli
```

## Tutorial

Once you're ready to start, you can begin by visiting the
[tutorial](http://loopback.io/doc/en/lb4/express-with-lb4-rest-tutorial.html)
page.

## Try it out this example

If you'd like to see the final results of this tutorial as an example
application, follow these steps:

### Generate the example using CLI

1. Download/Clone this example.
2. Jump into the directory and then install the required dependencies:

   ```sh
   cd loopback4-express-with-logging
   npm install
   ```

3. Finally, start the application!

   ```sh
   $ npm start

   Server is running at http://127.0.0.1:8000
   ```

4. Open the Loopback Explorer at http://127.0.0.1:8000/api/explorer/

Feel free to look around in the application's code to get a feel for how it
works.

## Winston Logging Example

```javascript
import { winstonLogger } from "./lib/logger";
// log the error.
winstonLogger.error(
  `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
    req.method
  } - ${req.ip}`
);
```

## Winston Logging Endpoint Example

You can use the /errorlogger endpoint to log an error from your front end application as well -

```sh
curl -X POST "http://127.0.0.1:8000/api/errorlogger" -H "accept: application/json" -H "Content-Type: application/json" -d "{\"message\":\"My awesome error message\"}"
```

## Log Files

Log files are separated out based on the log levels. The `logs` directory is generated at run time.

## Docker

Application works with Docker. Use the `docker-compose` to create your Docker container.

## Screenshots

#### 1. Log Files

![Log Files](https://karannagupta.com/kg/wp-content/uploads/2019/03/error-log.png "Access log files from the logs directory")

#### 2. Error Logger endpoint - /api/errorlogger - POST

![errorlogger endpoint](https://karannagupta.com/kg/wp-content/uploads/2019/03/lb4-post-example.png "The errorlogger POST endpoint")

## License

MIT
