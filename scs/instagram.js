const { bmbtz } = require("../devbmb/bmbtz");
const axios = require("axios");
const config = require("../settings");

// Prevent duplicate processing
const processedMessages = new Set();

// VERIFIED CONTACT
const quotedContact = {
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
ORG:BMB-TECH BOT;
TEL;type=CELL;type=VOICE;waid=${config.OWNER_NUMBER || "0000000000"}:+${config.OWNER_NUMBER || "0000000000"}
END:VCARD`
    }
  }
};

// Newsletter context (VIDEO ONLY)
const newsletterContext = {
  forwardingScore: 999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: "120363382023564830@newsletter",
    newsletterName: "B.M.B TECH",
    serverMessageId: 1
  }
};

bmbtz(
  {
    nomCom: "instagram",
    categorie: "Download",
    reaction: "📎"
  },
  async (dest, zk, commandeOptions) => {
    const { repondre, ms, arg } = commandeOptions;

    if (processedMessages.has(ms.key.id)) return;
    processedMessages.add(ms.key.id);
    setTimeout(() => processedMessages.delete(ms.key.id), 5 * 60 * 1000);

    const url = arg.join(" ");
    if (!url) return repondre("❌ Please provide an Instagram link.");

    await zk.sendMessage(dest, { react: { text: "🔄", key: ms.key } });

    try {
      // 🔥 DELIRIUS API
      const api = `https://api.delirius.store/download/instagram?url=${encodeURIComponent(url)}`;
      const { data } = await axios.get(api);

      if (!data || !data.media || !data.media.length) {
        return repondre("❌ Failed to fetch Instagram media.");
      }

      // Separate images & videos
      const images = [];
      const videos = [];

      for (const m of data.media) {
        if (m.type === "video") videos.push(m.url);
        if (m.type === "image") images.push(m.url);
      }

      // 1️⃣ SEND CAPTION FIRST
      await zk.sendMessage(
        dest,
        {
          text: `╭──〔 📎 INSTAGRAM DOWNLOAD 〕──
│
├─ Images: ${images.length}
├─ Videos: ${videos.length}
│
╰──〔 📥 POWERED BY BMB TECH 〕──`
        },
        { quoted: quotedContact }
      );

      // 2️⃣ SEND IMAGES
      for (const img of images.slice(0, 10)) {
        await zk.sendMessage(
          dest,
          { image: { url: img } },
          { quoted: quotedContact }
        );
      }

      // 3️⃣ SEND VIDEOS LAST (REAL VIDEO ✅)
      for (const vid of videos.slice(0, 5)) {
        await zk.sendMessage(
          dest,
          {
            video: { url: vid },
            mimetype: "video/mp4",
            caption: "🎬 Instagram Video",
            contextInfo: newsletterContext
          },
          { quoted: quotedContact }
        );
      }

      await zk.sendMessage(dest, { react: { text: "✅", key: ms.key } });

    } catch (err) {
      console.error(err?.response?.data || err);
      repondre("⚠️ Error while downloading Instagram video.");
    }
  }
);
