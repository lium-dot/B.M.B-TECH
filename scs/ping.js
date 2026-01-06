const { bmbtz } = require(__dirname + '/../devbmb/bmbtz');
const moment = require("moment-timezone");
const settings = require(__dirname + '/../settings');

moment.tz.setDefault(settings.TZ || "Africa/Nairobi");

bmbtz({
  nomCom: "ping",
  categorie: "General",
  reaction: "🟢"
}, async (dest, zk, commandeOptions) => {
  const { ms, sender } = commandeOptions;

  const time = moment().format("HH:mm:ss");
  const date = moment().format("DD/MM/YYYY");

  const response = `
╭───[ 𝗕.𝗠.𝗕-𝗧𝗘𝗖𝗛 𝗣𝗜𝗡𝗚 ]───⬣
│ 📅 Date: ${date}
│ 🕒 Time: ${time}
│ 👑 Owner: *${settings.BOT_NAME}*
╰───────────⬣`;

  // Friend's Blue Tick vCard
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

  try {
    await zk.sendMessage(dest, {
      text: response,
      contextInfo: {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
          title: "𝗕.𝗠.𝗕-𝗧𝗘𝗖𝗛 BOT",
          body: "Ping response from the system",
          thumbnailUrl: "https://github.com/bmbxmd1/BMB-DATA/raw/refs/heads/main/background.jpg",
          mediaType: 1,
          renderSmallThumbnail: true,
          showAdAttribution: true
        },
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363382023564830@newsletter",
          newsletterName: "𝙱.𝙼.𝙱-𝚇𝙼𝙳",
          serverMessageId: 1
        }
      }
    }, { quoted: quotedContact });
  } catch (err) {
    console.log("Ping error:", err);
    await zk.sendMessage(dest, { text: "❌ Ping failed. Check logs." }, { quoted: quotedContact });
  }
});
