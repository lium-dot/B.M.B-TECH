const { bmbtz } = require("../devbmb/bmbtz");

// Contact ya quoting
const quotedContact = {
  key: {
    fromMe: false,
    participant: `0@s.whatsapp.net`,
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "B.M.B TECH VERIFIED ✅",
      vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:B.M.B TECH VERIFIED ✅\nORG:BMB-TECH BOT;\nTEL;type=CELL;type=VOICE;waid=255767862457:+255767862457\nEND:VCARD"
    }
  }
};

const runtime = function (seconds) {
  seconds = Number(seconds);
  var d = Math.floor(seconds / 86400);
  var h = Math.floor(seconds % 86400 / 3600);
  var m = Math.floor(seconds % 3600 / 60);
  var s = Math.floor(seconds % 60);
  var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " d, ") : '';
  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " h, ") : '';
  var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " m, ") : '';
  var sDisplay = s > 0 ? s + (s == 1 ? " second" : " s") : '';
  return dDisplay + hDisplay + mDisplay + sDisplay;
};

bmbtz({
  nomCom: "uptime",
  desc: "To check runtime",
  categorie: "General",
  reaction: '💙',
  fromMe: true
}, async (dest, zk, commandeOptions) => {
  const { ms, repondre } = commandeOptions;
  try {
    await zk.sendMessage(dest, {
      audio: {
        url: "https://files.catbox.moe/m1wgdb.mp3"
      },
      mimetype: "audio/mp4",
      ptt: true,
      contextInfo: {
        isForwarded: true,
        forwardingScore: 999,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363382023564830@newsletter",
          newsletterName: "B.M.B-TECH",
          serverMessageId: 143
        },
        externalAdReply: {
          title: "Bot Runtime",
          body: " Uptime: " + runtime(process.uptime()),
          thumbnailUrl: "https://files.catbox.moe/rpea5k.jpg",
          sourceUrl: "https://whatsapp.com/channel/0029VawO6hgF6sn7k3SuVU3z",
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: quotedContact }); // Hapa quote inakuwa contact

  } catch (error) {
    console.log("❌ uptime Command Error: " + error);
    repondre("❌ Error: " + error);
  }
});
