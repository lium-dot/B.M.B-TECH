const { bmbtz } = require("../devbmb/bmbtz");
const fancy = require("../devbmb/style");
const { sendButtons } = require("gifted-btns");

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
      vcard:
        "BEGIN:VCARD\nVERSION:3.0\nFN:B.M.B VERIFIED ✅\nORG:BMB-TECH BOT;\nTEL;type=CELL;type=VOICE;waid=255767862457:+255767862457\nEND:VCARD"
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
    const { arg, prefixe, repondre, ms } = commandeOptions;

    const id = arg[0]?.match(/\d+/)?.join("");
    const text = arg.slice(1).join(" ");

    try {
      // Show styles list
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

      // ✅ Send fancy text with COPY button (gifted-btns)
      await sendButtons(
        zk,
        dest,
        {
          title: "",
          text: resultText,
          footer: "B.M.B TECH • Fancy Text",
          buttons: [
            {
              name: "cta_copy",
              buttonParamsJson: JSON.stringify({
                display_text: "📋 Copy Text",
                copy_code: resultText
              })
            }
          ]
        },
        { quoted: quotedContact }
      );

    } catch (error) {
      console.error("Fancy Error:", error);
      repondre("❌ An error occurred while generating fancy text.");
    }
  }
);
