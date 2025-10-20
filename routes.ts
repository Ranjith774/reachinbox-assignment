import express from 'express';
import { es } from './esClient';
import { startImapConnection } from './imapSync';

const router = express.Router();

// simple in-memory account store for demo
const accounts: any[] = [];

router.post('/accounts', async (req, res) => {
  const cfg = req.body;
  accounts.push(cfg);
  startImapConnection(cfg).catch(err => console.error('startImap error', err));
  res.json({ ok: true });
});

router.get('/sync/status', (req, res) => {
  res.json({ accounts: accounts.map(a => a.name) });
});

router.get('/emails', async (req, res) => {
  const q = (req.query.q as string) || '';
  const account = req.query.account as string | undefined;
  const folder = req.query.folder as string | undefined;
  const body: any = {
    index: 'emails',
    body: {
      query: {
        bool: {
          must: q ? [{ multi_match: { query: q, fields: ['subject', 'body', 'snippet', 'from', 'to'] } }] : [{ match_all: {} }],
          filter: []
        }
      },
      sort: [{ date: { order: 'desc' } }]
    }
  };
  if (account) body.body.query.bool.filter.push({ term: { account } });
  if (folder) body.body.query.bool.filter.push({ term: { folder } });
  const results = await es.search(body);
  res.json(results.hits.hits.map((h:any)=> ({ id: h._id, ...h._source })));
});

router.post('/emails/:id/label', async (req, res) => {
  const id = req.params.id;
  const label = req.body.label;
  await es.update({ index: 'emails', id, doc: { labels: [label] } });
  // Trigger notify if Interested
  if (label === 'Interested') {
    const { doc } = await es.get({ index: 'emails', id });
    // notify - simplified import
    const { notifyInterested } = await import('./notify');
    notifyInterested(doc._source).catch(console.error);
  }
  res.json({ ok: true });
});

export default router;