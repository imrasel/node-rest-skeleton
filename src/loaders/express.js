const bodyParser = require( "body-parser" );
const express = require( "express" );
const morgan = require( "morgan" );
const helmet = require("helmet");
const path = require( "path" );
const routes = require( "../routes" );
const compression = require( "compression" );
const Logger = require("../utils/logger");
const log4js = require("log4js");
const listEndpoints = require("express-list-endpoints");
// const logger = require( "../services/Logger" );
const config = require( "../config" );

class ExpressLoader {
  constructor () {
    this.app = express();
    this._logger = new Logger("app").getLogger();

    // Setup error handling, this must be after all other middleware
    // this.app.use( ExpressLoader.errorHandler );

    // Serve static content
    this.app.use( express.static( path.join( __dirname, "uploads" ) ) );

    // Set up middleware
    this.app.use( morgan( "dev" ) );
    this.app.use( compression() );
    this.app.use( bodyParser.urlencoded( {
      extended: false,
      limit: "20mb"
    } ) );
    this.app.use( bodyParser.json( { limit: "20mb" } ) );

    // Pass app to routes
    routes( this.app );
    
    // show route list if needed
    // this.prettyPrintRegisteredRoutes();

    this.app.use(
      log4js.connectLogger(Logger.getHttpLogger(), {
        level: "INFO",
        format:
          "[:method :status :url - :response-timems :res[content-length]] - [:req[Host] :req[x-forwarded-for] - :remote-addr] - [HTTP/:http-version - :user-agent]"
      })
    );

    this.app.use((error, req, res, next) => {
      if (res.headerSent) {
        return next(error);
      }
      res.status(error.code || 500).json({ success: false, message: error.message || 'An unknown error occured' });
    });

    // security related configurations
    this.app.use(helmet());
    this.app.use(this.configureOptionsMethod);

    process.on("unhandledRejection", (reason, p) => {
      this._logger.error("Unhandled exception ", reason.stack, p);
      // throw reason; // optional, in case you want to treat these as errors
    });


    // Start application
    this.server = this.app.listen( config.port, () => {
      // console.log(`Express running, now listening on port ${config.port}`);
      this._logger.info(`Express running, now listening on port ${config.port}`);
      // logger.info( `Express running, now listening on port ${config.port}` );
    } );
  }

  get Server () {
    return this.server;
  }

  /**
   * @description Default error handler to be used with express
   * @param error Error object
   * @param req {object} Express req object
   * @param res {object} Express res object
   * @param next {function} Express next object
   * @returns {*}
   */
  static errorHandler ( error, req, res, next ) {
    let parsedError;

    // Attempt to gracefully parse error object
    try {
      if ( error && typeof error === "object" ) {
        parsedError = JSON.stringify( error );
      } else {
        parsedError = error;
      }
    } catch ( e ) {
      console.log(e);
      // logger.error( e );
    }

    // Log the original error
    console.log(parsedError);
    // logger.error( parsedError );

    // If response is already sent, don't attempt to respond to client
    if ( res.headersSent ) {
      return next( error );
    }

    res.status( 400 ).json( {
      success: false,
      error
    } );
  }

  configureOptionsMethod(req, res, next) {
    if (req.method === "OPTIONS") {
      res.status(200).end();
    } else {
      next();
    }
  }


  prettyPrintRegisteredRoutes() {
    let routesToPrint = listEndpoints(this.app);
    this._logger.info(``);
    this._logger.info(`REGISTERED ROUTES:`);

    routesToPrint.forEach(r => {
      this._logger.info(r.path.replace("\\", ""));
      this._logger.info("\t- " + r.methods.join(" | "));
    });
    this._logger.info(``);
  }
}

module.exports = ExpressLoader;
