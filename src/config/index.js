const path = require('path');

module.exports = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT) || 3001,
    host: process.env.HOST || 'localhost',
    
    paths: {
        templates: path.resolve(process.env.TEMPLATE_DIR || './templates'),
        output: path.resolve(process.env.OUTPUT_DIR || './output')
    },
    
    cors: {
        origin: process.env.CORS_ORIGIN || '*'
    },
    
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
        max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
    },
    
    logging: {
        level: process.env.LOG_LEVEL || 'info'
    }
};