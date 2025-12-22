const { bmbtz } = require("../devbmb/bmbtz");
const fancy = require("../scs/style");

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
      vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:B.M.B VERIFIED ✅\nORG:BMB-TECH BOT;\nTEL;type=CELL;type=VOICE;waid=255767862457:+255767862457\nEND:VCARD"
    }
  }
};

// Newsletter context
const newsletterContext = {
  forwardingScore: 999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: "120363382023564830@newsletter",
    newsletterName: "𝙱.𝙼.𝙱-𝚇𝙼𝙳",
    serverMessageId: 1
  }
};

bmbtz(
  {
    nomCom: "fancy",
    categorie: "Fun",
    reaction: "〽️"
  },
  async (dest, zk, commandeOptions) => {
    const { arg, repondre, prefixe, ms } = commandeOptions;
    const id = arg[0]?.match(/\d+/)?.join('');
    const text = arg.slice(1).join(" ");

    try {
      if (id === undefined || text === undefined) {
        return await zk.sendMessage(dest, {
          text: `\nExemple : ${prefixe}fancy 10 bmb tech\n` + String.fromCharCode(8206).repeat(4001) + fancy.list('B.M.B-TECH', fancy),
          contextInfo: newsletterContext
        }, { quoted: quotedContact });
      }

      const selectedStyle = fancy[parseInt(id) - 1];
      const resultText = selectedStyle ? fancy.apply(selectedStyle, text) : '_Style introuvable :(_';

      return await zk.sendMessage(dest, {
        text: resultText,
        contextInfo: newsletterContext
      }, { quoted: quotedContact });

    } catch (error) {
      console.error(error);
      return await repondre('_Une erreur s\'est produite :(_');
    }
  }
);
