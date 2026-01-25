const axios = require("axios");
const { bmbtz } = require("../devbmb/bmbtz");

// VCard Contact (optional)
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
  contextInfo: {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363382023564830@newsletter",
      newsletterName: "𝙱.𝙼.𝙱-𝚇𝙼𝙳",
      serverMessageId: 1
    }
  }
};

bmbtz({
  nomCom: "tiktok",
  categorie: "Download",
  reaction: "🎵",
  alias: ["ttdl", "tt", "tiktokdl"]
}, async (dest, zk, commandeOptions) => {
  const { arg, repondre, ms } = commandeOptions;

  if (!arg[0]) return repondre("❌ Please provide a TikTok video link.");
  const q = arg.join(" ");
  if (!q.includes("tiktok.com")) return repondre("❌ Invalid TikTok link.");

  try {
    await zk.sendMessage(dest, { react: { text: "⏳", key: ms.key } });

    const apiUrl = `https://bmb-tiktok.vercel.app/api/video?url=${encodeURIComponent(q)}`;
    const { data } = await axios.get(apiUrl);

    if (!data.status || !data.data) return repondre("⚠️ Failed to fetch TikTok video.");

    const { title, like, comment, share, author, meta } = data.data;
    const videoMedia = meta?.media?.find(v => v.type === "video");
    if (!videoMedia) return repondre("⚠️ Video not found in response.");

    const caption =
      "╔══════════════════❒\n" +
      `║ 🎵 *TikTok Video*\n` +
      `║\n` +
      `║ 👤 *User:* ${author.nickname} (@${author.username})\n` +
      `║ 📖 *Title:* ${title}\n` +
      `║ 👍 *Likes:* ${like}\n` +
      `║ 💬 *Comments:* ${comment}\n` +
      `║ 🔁 *Shares:* ${share}\n` +
      "╚══════════════════❒";

    // 1. Send caption only (no image or video)
    await zk.sendMessage(dest, {
      text: caption,
      ...newsletterContext
    }, { quoted: quotedContact });

    // 2. Send video only (no caption)
    await zk.sendMessage(dest, {
      video: { url: videoMedia.org },
      ...newsletterContext
    }, { quoted: quotedContact });

  } catch (error) {
    console.error("TikTok Error:", error);
    repondre("❌ An error occurred while downloading the TikTok video.");
  }
});
