import { Client } from '@elastic/elasticsearch';
import dotenv from 'dotenv';
dotenv.config();

export const es = new Client({ node: process.env.ELASTIC_URL || 'http://localhost:9200' });

export async function ensureIndex() {
  const exists = await es.indices.exists({ index: 'emails' });
  if (!exists) {
    await es.indices.create({
      index: 'emails',
      body: {
        mappings: {
          properties: {
            account: { type: 'keyword' },
            folder: { type: 'keyword' },
            messageId: { type: 'keyword' },
            from: { type: 'text' },
            to: { type: 'text' },
            subject: { type: 'text' },
            body: { type: 'text' },
            snippet: { type: 'text' },
            labels: { type: 'keyword' },
            date: { type: 'date' }
          }
        }
      }
    });
  }
}