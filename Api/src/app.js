require('dotenv').config();
const express = require('express');
const cors = require('cors');

class AppController {
    constructor() {
        this.express = express();
        this.middlewares();
        this.routes();
    };

    middlewares() {
        this.express.use(express.json());
        this.express.use(cors({
            origin: '*',
            methods: '[GET, PUT, DELETE, POST]',
            allowedHeaders: 'Content-Type, Authorization',
            optionsSuccessStatus: 204,
        }));
    };

    routes() {
        this.express.use(require('./routes/UserSession.routes'));
        this.express.use(require('./routes/Products.routes'));
    };
};

module.exports = new AppController().express;
