import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';
import { ensureIndex } from './esClient';

export const app = express();
app.use(bodyParser.json({ limit: '5mb' }));
app.use('/api', routes);

// health
app.get('/health', (req, res) => res.json({ ok: true }));

// ensure index ready
ensureIndex().catch(err => console.error('ES ensure error', err));