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
    console.log(config.dbUrl)
    mongoose.connect( config.dbUrl, mongooseOptions )
      .then( (response) => {
        // console.log(response.connections)
        this._logger.info("Database connection successful");
        new ExpressLoader();
      } )
      .catch( err => {
        // console.error( err );
        this._logger.info( err );
      } );
  }

}

// Bootstrap the server
const server = Server.bootstrap();
//required for testing 
exports.express_server = server.express_server;
exports.app = server.app;
