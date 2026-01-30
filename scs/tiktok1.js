const { bmbtz } = require('../devbmb/bmbtz');
const TikTok = require('@xaviabot/tiktok-downloader');

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
      vcard:
        "BEGIN:VCARD\n" +
        "VERSION:3.0\n" +
        "FN:B.M.B VERIFIED ✅\n" +
        "ORG:BMB-TECH BOT;\n" +
        "TEL;type=CELL;type=VOICE;waid=255767862457:+255767862457\n" +
        "END:VCARD"
    }
  }
};

// Newsletter context
const newsletterContext = {
  forwardingScore: 999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: "120363382023564830@newsletter",
    newsletterName: "B.M.B TECH",
    serverMessageId: 1
  }
};

bmbtz({
  nomCom: "tiktok2",
  categorie: "Download",
  reaction: "🎵"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg } = commandeOptions;

  if (!arg[0]) {
    return repondre('Insert a public TikTok video link!');
  }

  try {
    const data = await TikTok(arg[0]);

    let caption = `
Titre: ${data.description || 'TikTok Video'}
Auteur: ${data.author?.nickname || 'Unknown'}
Lien: ${arg[0]}
    `;

    if (data.cover) {
      await zk.sendMessage(dest, {
        image: { url: data.cover },
        caption,
        contextInfo: newsletterContext
      }, { quoted: quotedContact });
    }

    await zk.sendMessage(dest, {
      video: { url: data.video.noWatermark || data.video.watermark },
      caption: 'TikTok video downloader powered by BMB TECH',
      contextInfo: newsletterContext
    }, { quoted: quotedContact });

  } catch (err) {
    console.log('TikTok Error:', err);
    repondre('⚠️ Failed to fetch TikTok video.');
  }
});
