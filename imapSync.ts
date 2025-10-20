import { ImapFlow } from 'imapflow';
import { es } from './esClient';
import { parseRawEmail } from './mailParser';
import { classifyEmail } from './classifier';
import { notifyInterested } from './notify';

export async function startImapConnection(account: any) {
  const client = new ImapFlow({
    host: account.imapHost,
    port: account.imapPort,
    secure: account.secure,
    auth: { user: account.user, pass: account.pass }
  });

  client.on('error', err => console.error('IMAP error', err));

  await client.connect();

  // fetch last 30 days
  const since = new Date();
  since.setDate(since.getDate() - 30);

  for await (const mailbox of await client.listMailboxes()) {
    const boxName = mailbox.path;
    try {
      await client.mailboxOpen(boxName);
      const uids = await client.search({ since });
      for await (const uid of uids) {
        const msg = await client.fetchOne(uid, { source: true, envelope: true, internalDate: true });
        await handleAndIndex(msg, account.name, boxName);
      }
    } catch (err) {
      // permission / special folders might fail
    }
  }

  // IDLE / new messages
  client.on('exists', async () => {
    try {
      // fetch last message in INBOX (simplified)
      await client.mailboxOpen('INBOX');
      const seq = await client.fetch('1:*', { source: true, envelope: true, internalDate: true });
      for await (const msg of seq) {
        await handleAndIndex(msg, account.name, 'INBOX');
      }
    } catch (err) { console.error('exists handler', err); }
  });

  console.log(IMAP connected for ${account.name});
}

async function handleAndIndex(msg: any, accountName: string, folder: string) {
  try {
    const parsed = await parseRawEmail(Buffer.from(msg.source));
    const doc = {
      account: accountName,
      folder,
      messageId: msg.envelope?.messageId || ${accountName}-${Date.now()},
      from: parsed.from,
      to: parsed.to,
      subject: parsed.subject,
      body: parsed.text,
      snippet: parsed.text?.slice(0, 250) || '',
      date: parsed.date,
      labels: []
    };

    // index
    await es.index({ index: 'emails', id: doc.messageId, document: doc });

    // classify
    const label = await classifyEmail(doc.subject, doc.body);
    doc.labels = [label];
    await es.update({ index: 'emails', id: doc.messageId, doc: { labels: doc.labels } });

    if (label === 'Interested') {
      await notifyInterested(doc);
    }
  } catch (err) {
    console.error('handleAndIndex error', err);
  }
}