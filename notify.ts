import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const slackUrl = process.env.SLACK_WEBHOOK_URL;
const webhookSite = process.env.WEBHOOK_SITE_URL;

export async function notifyInterested(emailDoc: any) {
  if (slackUrl) {
    try {
      await fetch(slackUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: *Interested* lead from ${emailDoc.from}\nSubject: ${emailDoc.subject} })
      });
    } catch (err) { console.error('Slack notify error', err); }
  }

  if (webhookSite) {
    try {
      await fetch(webhookSite, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'interested_email', email: emailDoc })
      });
    } catch (err) { console.error('Webhook error', err); }
  }
}