import { Hono } from 'hono';

const indexRoute = new Hono();

indexRoute.get('/health-check', (c) => {
  return c.json({
    message: '🧠 PsyTrack API is running.',
    docs: 'Coming soon...',
    status: 'ok',
  });
});

export default indexRoute;
