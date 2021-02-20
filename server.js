const mongoose = require( "mongoose" );
const express = require("express");
const Logger = require("./src/utils/logger");
const ExpressLoader = require( "./src/loaders/express" );
const config = require('./src/config');

/**
 * The server.
 *
 * @class Server
 */
class Server {
  static bootstrap() {
    return new Server();
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {
    // create expressjs application
    this.app = express();

    Logger.initializeLogger("./log");
    this._logger = new Logger("app").getLogger();

    this.initializeApp();
  }

  initializeApp() {
    const mongooseOptions = {
      useUnifiedTopology: true,
      useNewUrlParser: true
    };
    mongoose.connect( config.dbUrl, mongooseOptions )
      .then( (response) => {
        this._logger.info("Database connection successful");
        new ExpressLoader();
      } )
      .catch( err => {
        this._logger.error( err );
      } );
  }

}

// Bootstrap the server
const server = Server.bootstrap();
//required for testing 
exports.express_server = server.express_server;
exports.app = server.app;
