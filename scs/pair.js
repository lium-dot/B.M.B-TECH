const { bmbtz } = require("../devbmb/bmbtz");
const axios = require("axios");

// Fake quoted contact (status style)
const quotedStatus = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "B.M.B VERIFIED ✅",
      vcard: `BEGIN:VCARD
VERSION:3.0
FN:B.M.B VERIFIED
ORG:BMB-TECH;
TEL;type=CELL;type=VOICE;waid=255767862457:+255767862457
END:VCARD`
    }
  }
};

bmbtz(
  {
    nomCom: "pair",
    aliases: ["paircode", "session", "qrcode"],
    categorie: "General",
    reaction: "🔐"
  },
  async (dest, zk, context) => {
    const { arg, repondre, ms } = context;

    try {
      // chukua namba: ikiwa ameweka tumia, la sivyo tumia ya sender
      const number = arg[0]
        ? arg[0].replace(/\D/g, "")
        : ms.sender.split("@")[0];

      const apiUrl = `https://bmb-pair-site.onrender.com/code?number=${encodeURIComponent(number)}`;
      const { data } = await axios.get(apiUrl);

      if (!data || !data.code) {
        return repondre("❌ Failed to generate pair code. Try again later.");
      }

      const finalMessage = `
🔐 *PAIRING READY* 🔐

📱 *Number:* ${number}

━━━━━━━━━━━━━━━
📌 *How to use*
━━━━━━━━━━━━━━━
Open WhatsApp
Linked Devices → Link a device

━━━━━━━━━━━━━━━
🔑 *PAIR CODE*
━━━━━━━━━━━━━━━

*${data.code}*
`;

      await zk.sendMessage(
        dest,
        { text: finalMessage },
        { quoted: quotedStatus }
      );

    } catch (error) {
      console.error("PAIR ERROR:", error);
      repondre("❌ Error occurred while generating pair code.");
    }
  }
);
