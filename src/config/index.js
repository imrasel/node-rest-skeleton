let config = {
  dbUrl: process.env.MONGODB_URL || "mongodb://localhost/ecommerce",
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || "development",
  logDir: process.env.LOGDIR || "logs"
};

module.exports = config;
