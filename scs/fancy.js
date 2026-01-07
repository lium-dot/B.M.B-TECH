const { bmbtz } = require("../devbmb/bmbtz");
const fancy = require("../devbmb/style");

// VCard Contact
const quotedContact = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "B.M.B VERIFIED ✅",
      vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:B.M.B VERIFIED ✅\nORG:BMB-TECH BOT;\nTEL;type=CELL;type=VOICE;waid=255767862457:+255767862457\nEND:VCARD"
    }
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
      if (!id || !text) {
        return await zk.sendMessage(
          dest,
          {
            text:
              `Example: ${prefixe}fancy 10 bmb tech\n\n` +
              String.fromCharCode(8206).repeat(4001) +
              fancy.list("B.M.B-TECH", fancy)
          },
          { quoted: quotedContact }
        );
      }

      const selectedStyle = fancy[parseInt(id) - 1];
      if (!selectedStyle) return repondre("❌ Invalid style number.");

      const resultText = fancy.apply(selectedStyle, text);

      // Send fancy text with COPY button
      await zk.sendMessage(
        dest,
        {
          text: resultText,
          footer: "Tap COPY to copy the styled text",
          buttons: [
            {
              buttonId: resultText,
              buttonText: { displayText: "📋 COPY" },
              type: 1
            }
          ],
          headerType: 1
        },
        { quoted: quotedContact }
      );

    } catch (error) {
      console.error(error);
      repondre("❌ An error occurred.");
    }
  }
);
