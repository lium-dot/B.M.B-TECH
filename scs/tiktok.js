const axios = require("axios");
const { bmbtz } = require("../devbmb/bmbtz");

/* ===== VCard ===== */
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
FN:B.M.B VERIFIED ✅
ORG:BMB-TECH BOT;
TEL;type=CELL;type=VOICE;waid=255767862457:+255767862457
END:VCARD`
    }
  }
};

/* ===== Newsletter ===== */
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

/* ===== API ===== */
const API = "https://bmb-tiktok.vercel.app/api/video?url=";

bmbtz(
  {
    nomCom: "tiktok",
    categorie: "Download",
    reaction: "🎵",
    alias: ["tt", "ttdl", "tiktokdl"]
  },
  async (dest, zk, { arg, repondre, ms }) => {

    if (!arg[0]) return repondre("❌ Tuma TikTok link.");
    const link = arg.join(" ");
    if (!link.includes("tiktok.com")) return repondre("❌ Invalid TikTok link.");

    try {
      await zk.sendMessage(dest, { react: { text: "⏳", key: ms.key } });

      const res = await axios.get(API + encodeURIComponent(link));
      const data = res.data;

      /* ===== FLEXIBLE VIDEO PICK ===== */
      const videoUrl =
        data.video ||
        data.url ||
        data.videoUrl ||
        data?.result?.video ||
        data?.data?.video;

      if (!videoUrl) {
        console.log("API RESPONSE:", data);
        return repondre("⚠️ API haijarudisha video URL.");
      }

      const title =
        data.title ||
        data?.result?.title ||
        "TikTok Video";

      const author =
        data.author ||
        data?.result?.author ||
        "Unknown";

      const caption =
        "╔══════════════════❒\n" +
        "║ 🎵 *TikTok Video*\n" +
        "║\n" +
        `║ 👤 Author: ${author}\n` +
        `║ 📖 Title: ${title}\n` +
        "╚══════════════════❒";

      /* ===== SEND TEXT ===== */
      await zk.sendMessage(
        dest,
        { text: caption, ...newsletterContext },
        { quoted: quotedContact }
      );

      /* ===== SEND VIDEO ===== */
      await zk.sendMessage(
        dest,
        { video: { url: videoUrl }, ...newsletterContext },
        { quoted: quotedContact }
      );

    } catch (e) {
      console.error("TIKTOK ERROR:", e.response?.data || e);
      repondre("❌ TikTok download failed (API error).");
    }
  }
);
