import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { config } from './config/config';
import Log from './library/Log';
import authorRoutes from './routers/Author';

const NAMESPACE = 'server';

const router = express();

mongoose
    .connect(config.mongo.url, {
        retryWrites: true,
        w: 'majority'
    })
    .then((res) => {
        Log.info('Connected to MongoDB', NAMESPACE);
        Log.info('Connected to database: ' + res.connection.db.databaseName, NAMESPACE);
        StartServer();
    })
    .catch((error) => {
        Log.error('Unable to connect.', NAMESPACE);
        Log.error(error, NAMESPACE);
    });

const StartServer = () => {
    router.use((req, res, next) => {
        /* Log request */
        Log.info(`Incomming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

        res.on('finish', () => {
            /* Log response */
            Log.info(`Outcomming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`);
        });

        next();
    });

    router.use(express.urlencoded({ extended: true }));
    router.use(express.json());

    router.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Header', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).json({});
        }

        next();
    });

    /* Routes */
    router.use('/authors', authorRoutes);

    /* Healthcheck */
    router.get('/healthCheck', (req, res, next) => res.status(200).json({ message: 'alive' }));

    /* Error handling */
    router.use((req, res, next) => {
        const error = new Error('Not found');
        Log.error(error, NAMESPACE);

        return res.status(404).json({ message: error.message });
    });

    router.use((error: Error, req: Request, res: Response, next: NextFunction) => {
        Log.error(error, NAMESPACE);
        Log.error(error.stack, NAMESPACE);

        return res.status(500).json({ message: error.message });
    });

    http.createServer(router).listen(config.server.port, () => Log.info(`Server is running on port: ${config.server.port}`));
};
