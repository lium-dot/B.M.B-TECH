const axios = require("axios");
const { bmbtz } = require("../devbmb/bmbtz");

/* ===== VCard Contact ===== */
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

/* ===== Newsletter Context ===== */
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
const TIKTOK_API = "https://bmb-tiktok.vercel.app/api/video?url=";

/* ===== COMMAND ===== */
bmbtz(
  {
    nomCom: "tiktok",
    categorie: "Download",
    reaction: "🎵",
    alias: ["tt", "ttdl", "tiktokdl"]
  },
  async (dest, zk, commandeOptions) => {
    const { arg, repondre, ms } = commandeOptions;

    if (!arg[0]) return repondre("❌ Please provide a TikTok video link.");

    const q = arg.join(" ");
    if (!q.includes("tiktok.com")) {
      return repondre("❌ Invalid TikTok link.");
    }

    try {
      await zk.sendMessage(dest, {
        react: { text: "⏳", key: ms.key }
      });

      /* ===== FETCH API ===== */
      const { data } = await axios.get(
        `${TIKTOK_API}${encodeURIComponent(q)}`
      );

      if (!data || !data.video) {
        return repondre("⚠️ Failed to fetch TikTok video.");
      }

      const videoUrl = data.video;
      const title = data.title || "TikTok Video";
      const author = data.author || "Unknown";

      /* ===== CAPTION ===== */
      const caption =
        "╔══════════════════❒\n" +
        "║ 🎵 *TikTok Video*\n" +
        "║\n" +
        `║ 👤 *Author:* ${author}\n` +
        `║ 📖 *Title:* ${title}\n` +
        "╚══════════════════❒";

      /* ===== SEND TEXT ===== */
      await zk.sendMessage(
        dest,
        {
          text: caption,
          ...newsletterContext
        },
        { quoted: quotedContact }
      );

      /* ===== SEND VIDEO ===== */
      await zk.sendMessage(
        dest,
        {
          video: { url: videoUrl },
          ...newsletterContext
        },
        { quoted: quotedContact }
      );

    } catch (error) {
      console.error("TikTok API ERROR:", error);
      repondre("❌ An error occurred while downloading the TikTok video.");
    }
  }
);
