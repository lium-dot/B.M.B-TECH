const { bmbtz } = require('../devbmb/bmbtz');
const axios = require('axios');

// VCard Contact kwa quoting
const quotedContact = {
  key: {
    fromMe: false,
    participant: `0@s.whatsapp.net`,
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "B.M.B TECH VERIFIED ✅",
      vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:B.M.B TECH VERIFIED ✅\nORG:BMB-TECH BOT;\nTEL;type=CELL;type=VOICE;waid=254769529791:+254769529791\nEND:VCARD"
    }
  }
};

bmbtz({
  nomCom: "pair",
  aliases: ["session", "code", "paircode", "qrcode"],
  reaction: '☘️',
  categorie: 'system'
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg } = commandeOptions;

  if (!arg || arg.length === 0) {
    return repondre("❗ Example Usage: *.code 255767xxxxx*");
  }

  try {
    await repondre("♻️ bmb tech is generating your pairing code...");

    const encodedNumber = encodeURIComponent(arg.join(" "));
    const response = await axios.get(`https://bmb-pair-site.onrender.com/code?number=${encodedNumber}`);
    const data = response.data;

    if (data && data.code) {
      const pairingCode = data.code;

      await zk.sendMessage(dest, {
        text: pairingCode,
        contextInfo: {
          isForwarded: true,
          forwardingScore: 999,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363382023564830@newsletter',
            newsletterName: "Bmb Tech",
            serverMessageId: 143
          },
          
      await repondre("✅ *Here is your pair code*, copy and paste it in the popup or use *Link Device*.");
    } else {
      throw new Error("Invalid response from API.");
    }
  } catch (error) {
    console.error("Error getting API response:", error.message);
    repondre("❌ *Failed to fetch pairing code from API.*");
  }
});
