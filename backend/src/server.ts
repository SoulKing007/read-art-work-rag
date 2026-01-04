import express, { Application } from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';
import { supabaseService } from './services/supabase.service.js';
import chatRoutes from './routes/chat.routes.js';
import documentsRoutes from './routes/documents.routes.js';
import meetingsRoutes from './routes/meetings.routes.js';

const app: Application = express();

// Middleware
app.use(cors({
    origin: config.server.corsOrigin,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    logger.info('Incoming request', {
        method: req.method,
        path: req.path,
        query: req.query,
    });
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: config.server.nodeEnv,
    });
});

// API Routes
app.use('/api/chat', chatRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/meetings', meetingsRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Initialize services and start server
async function startServer() {
    try {
        // Initialize vector store
        logger.info('Initializing vector store...');
        await supabaseService.initializeVectorStore();

        // Start server
        const port = config.server.port;
        app.listen(port, () => {
            logger.info(`Server started on port ${port}`, {
                environment: config.server.nodeEnv,
                corsOrigin: config.server.corsOrigin,
            });
        });
    } catch (error) {
        logger.error('Failed to start server', error as Error);
        process.exit(1);
    }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled rejection', reason as Error, { promise });
    process.exit(1);
});

// Start the server
startServer();

export default app;
