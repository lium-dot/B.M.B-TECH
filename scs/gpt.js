const { bmbtz } = require('../devbmb/bmbtz');
const pkg = require('@whiskeysockets/baileys');
const { generateWAMessageFromContent, proto } = pkg;

// VCard Contact
const quotedContact = {
  key: {
    fromMe: false,
    participant: '0@s.whatsapp.net',
    remoteJid: 'status@broadcast'
  },
  message: {
    contactMessage: {
      displayName: 'B.M.B VERIFIED ✅',
      vcard:
        'BEGIN:VCARD\n' +
        'VERSION:3.0\n' +
        'FN:B.M.B VERIFIED ✅\n' +
        'ORG:BMB-TECH BOT;\n' +
        'TEL;type=CELL;type=VOICE;waid=254700000001:+254700000001\n' +
        'END:VCARD'
    }
  }
};

// Newsletter context
const newsletterContext = {
  forwardingScore: 999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: '120363382023564830@newsletter',
    newsletterName: '𝙱.𝙼.𝙱-𝚇𝙼𝙳',
    serverMessageId: 1
  }
};

bmbtz({ nomCom: 'gpt', reaction: '🤦', categorie: 'bmbai' }, async (from, conn, ctx) => {
  const { arg, repondre } = ctx;

  try {
    if (!arg || !arg.length) {
      return repondre('Hello.\n\nWhat help can I offer you today?');
    }

    const prompt = arg.join(' ');
    const res = await fetch(
      `https://api.gurusensei.workers.dev/llama?prompt=${encodeURIComponent(prompt)}`
    );
    const json = await res.json();

    if (!json?.response?.response) {
      throw new Error('Invalid API response');
    }

    const answer = json.response.response;

    // COPY button
    const buttons = [
      {
        name: 'cta_copy',
        buttonParamsJson: JSON.stringify({
          display_text: 'COPY RESPONSE',
          id: 'copy_gpt',
          copy_code: answer
        })
      }
    ];

    const msg = generateWAMessageFromContent(
      from,
      {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({
                text: answer
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: '> *B.M.B-TECH*'
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                title: '',
                subtitle: '',
                hasMediaAttachment: false
              }),
              nativeFlowMessage:
                proto.Message.InteractiveMessage.NativeFlowMessage.create({
                  buttons
                })
            })
          }
        }
      },
      {
        contextInfo: {
          ...newsletterContext,
          quotedMessage: quotedContact.message
        }
      }
    );

    await conn.relayMessage(from, msg.message, { messageId: msg.key.id });

  } catch (err) {
    console.error(err);
    repondre('Error getting response.');
  }
});
