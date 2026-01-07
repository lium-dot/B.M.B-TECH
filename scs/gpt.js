const { bmbtz } = require('../devbmb/bmbtz');
const traduire = require("../devbmb/traduction");
const { default: axios } = require('axios');
const fs = require('fs');
const pkg = require('@whiskeysockets/baileys');
const { generateWAMessageFromContent, proto } = pkg;

// VCard Contact
const quotedContact = {
  key: {
    fromMe: false,
    participant: `0@s.whatsapp.net`,
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "B.M.B VERIFIED ✅",
      vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:B.M.B VERIFIED ✅\nORG:BMB-TECH BOT;\nTEL;type=CELL;type=VOICE;waid=254700000001:+254700000001\nEND:VCARD"
    }
  }
};

// Newsletter context
const contextInfo = {
  forwardingScore: 999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: "120363382023564830@newsletter",
    newsletterName: "𝙱.𝙼.𝙱-𝚇𝙼𝙳",
    serverMessageId: 1
  }
};

bmbtz({ nomCom: "gpt", reaction: "🤦", categorie: "bmbai" }, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;

  try {
    if (!arg || arg.length === 0) {
      return repondre('Hello 🖐️.\n\n What help can I offer you today?');
    }

    const prompt = arg.join(' ');
    const response = await fetch(`https://api.gurusensei.workers.dev/llama?prompt=${prompt}`);
    const data = await response.json();

    if (data && data.response && data.response.response) {
      const answer = data.response.response;

      const msg = generateWAMessageFromContent(dest, {
        viewOnceMessage: {
          message: {
            messageContextInfo: contextInfo, // Hapa tunashirikisha newsletter context
            extendedTextMessage: {
              text: answer,
              contextInfo: {
                ...contextInfo,
                quotedMessage: quotedContact.message // Hapa inatumika VCard verify
              }
            }
          }
        }
      }, {});

      await zk.relayMessage(dest, msg.message, {
        messageId: msg.key.id
      });
    } else {
      throw new Error('Invalid response from the API.');
    }
  } catch (error) {
    console.error('Error getting response:', error.message);
    repondre('❌ Error getting response.');
  }
});
