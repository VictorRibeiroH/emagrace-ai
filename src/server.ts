import { createApp } from './app';
import { config } from './config';
import prisma from './config/database';

const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    // eslint-disable-next-line no-console
    console.log('✅ Database connected successfully');

    // Create Express app
    const app = createApp();

    // Start server
    const server = app.listen(config.port, () => {
      // eslint-disable-next-line no-console
      console.log(`🚀 Server running on port ${config.port}`);
      // eslint-disable-next-line no-console
      console.log(`📝 Environment: ${config.nodeEnv}`);
      // eslint-disable-next-line no-console
      console.log(`🔗 Health check: http://localhost:${config.port}/health`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      // eslint-disable-next-line no-console
      console.log(`\n${signal} received, shutting down gracefully...`);
      
      server.close(async () => {
        // eslint-disable-next-line no-console
        console.log('🔌 HTTP server closed');
        
        await prisma.$disconnect();
        // eslint-disable-next-line no-console
        console.log('🔌 Database disconnected');
        
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        // eslint-disable-next-line no-console
        console.error('❌ Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
