import logger from './logger.js';

/**
 * Self-ping Keep-Alive service.
 * Free-tier hosting platforms (such as Render.com, Glitch, etc.) automatically put web services
 * to sleep after 15 minutes of inactivity. This utility runs a lightweight background ping
 * every 14 minutes to ensure the server stays awake and responsive 24/7.
 */
export const initKeepAlive = () => {
  // Only activate in production when an external public URL is known
  const externalUrl = process.env.RENDER_EXTERNAL_URL || process.env.SERVER_URL || process.env.BACKEND_URL;

  if (process.env.NODE_ENV !== 'production' && !process.env.ENABLE_KEEP_ALIVE) {
    return;
  }

  if (!externalUrl) {
    logger.info('Keep-Alive: No RENDER_EXTERNAL_URL or SERVER_URL found. Add SERVER_URL in production to enable self-pinging.');
    return;
  }

  const pingIntervalMinutes = parseInt(process.env.KEEP_ALIVE_INTERVAL_MINUTES, 10) || 14;
  const pingIntervalMs = pingIntervalMinutes * 60 * 1000;
  const healthEndpoint = `${externalUrl.replace(/\/$/, '')}/api/health`;

  logger.info(`Keep-Alive: Service initialized. Pinging ${healthEndpoint} every ${pingIntervalMinutes} minutes to prevent sleep.`);

  const intervalId = setInterval(async () => {
    try {
      const response = await fetch(healthEndpoint);
      if (response.ok) {
        logger.info(`Keep-Alive: Heartbeat successful (${response.status} OK) at ${new Date().toISOString()}`);
      } else {
        logger.warn(`Keep-Alive: Heartbeat returned status ${response.status}`);
      }
    } catch (err) {
      logger.error(`Keep-Alive: Heartbeat ping failed: ${err.message}`);
    }
  }, pingIntervalMs);

  // Allow node process to exit cleanly without waiting on this interval
  if (intervalId && intervalId.unref) {
    intervalId.unref();
  }
};
