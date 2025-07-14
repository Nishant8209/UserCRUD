const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app: any = express();
const cookieParser = require('cookie-parser');
import serverless from 'serverless-http';

import routes from './routes/index'
import { errorResponse } from './utils/response'
import path from 'path';
import fs from 'fs';
// Middleware
app.use(express.json());
app.use(cors({
    origin: [
        'http://localhost:3000',
        "http://localhost:5173"
    ], // Add allowed domains
    credentials: true
}
));
app.use(morgan('dev')); // Logging middleware
app.use(cookieParser());

// Routes
app.use('/api', routes);


const buildPath = path.join(__dirname, '../frontend/build');
app.use(express.static(buildPath));

// Catch-all handler - this should be LAST
app.get('/{*any}', (req:any, res:any) => {
    const filePath = path.join(buildPath, 'index.html');

    // Check if file exists before sending
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        console.error('index.html not found at:', filePath);
        res.status(404).send('Frontend build not found');
    }
});

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
    console.error(err.stack);
    errorResponse(res, 'Something went wrong!', 500, err)
});

module.exports = app;
