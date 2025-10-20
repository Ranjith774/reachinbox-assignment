import { simpleParser } from 'mailparser';

export async function parseRawEmail(raw: Buffer) {
  const parsed = await simpleParser(raw);
  return {
    subject: parsed.subject || '',
    text: parsed.text || (parsed.html ? htmlToText(parsed.html) : ''),
    from: parsed.from?.text || '',
    to: parsed.to?.text || '',
    date: parsed.date || new Date()
  };
}

function htmlToText(html: string) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}