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
      vcard: 
`BEGIN:VCARD
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
      // 👉 Chukua number ya mtumiaji mwenyewe kama hajaweka
      const senderJid = ms.key.participant || ms.key.remoteJid;
      const senderNumber = senderJid.split("@")[0];

      const number = arg[0]
        ? arg[0].replace(/\D/g, "")
        : senderNumber;

      const apiUrl = `https://bmb-pair-site.onrender.com/code?number=${encodeURIComponent(number)}`;
      const { data } = await axios.get(apiUrl);

      if (!data || !data.code) {
        return repondre("❌ Failed to generate pair code.");
      }

      // Caption inakuja yenyewe
      const caption = `
🔐 *PAIRING SUCCESSFUL* 🔐

📱 *Number:* ${number}

━━━━━━━━━━━━━━━
🔑 *PAIR CODE*
━━━━━━━━━━━━━━━
`;

      // Tuma caption kwanza
      await zk.sendMessage(
        dest,
        { text: caption },
        { quoted: quotedStatus }
      );

      // Tuma code mwisho pekee
      await zk.sendMessage(
        dest,
        {
          text: `*${data.code}*`,
        },
        { quoted: quotedStatus }
      );

    } catch (error) {
      console.error("PAIR ERROR:", error);
      repondre("❌ Error occurred while generating pair code.");
    }
  }
);
