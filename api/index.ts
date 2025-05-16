import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import indexRoute from './routes/index';

export const config = {
  runtime: 'edge',
};

const app = new Hono().basePath('/api');

app.route('/', indexRoute);

export default handle(app);
