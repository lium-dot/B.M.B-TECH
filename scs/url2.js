const { bmbtz } = require("../devbmb/bmbtz");
const pkg = require("@whiskeysockets/baileys");
const { generateWAMessageFromContent, proto } = pkg;
const fs = require("fs-extra");
const axios = require("axios");

/* ===== IMGDB CONFIG ===== */
const IMGBB_API_KEY = "84b96ae2b8e45c7e957e1258e0e9e7c0";

/* ===== QUOTED CONTACT ===== */
const quotedContact = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "B.M.B TECH VERIFIED ✅",
      vcard: `BEGIN:VCARD
VERSION:3.0
FN:B.M.B TECH VERIFIED ✅
ORG:BMB-TECH BOT;
TEL;type=CELL;type=VOICE;waid=255767862457:+255767862457
END:VCARD`
    }
  }
};

/* ===== UPLOAD TO IMGBB ===== */
async function uploadToImgBB(filePath) {
  const imageBase64 = fs.readFileSync(filePath, "base64");

  const res = await axios.post(
    "https://api.imgbb.com/1/upload",
    new URLSearchParams({
      key: IMGBB_API_KEY,
      image: imageBase64
    }).toString(),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  );

  return res.data.data.url;
}

bmbtz(
  { nomCom: "url2", categorie: "General", reaction: "🔗" },
  async (from, zk, context) => {
    const { ms, repondre } = context;

    // ===== PATA MESSAGE KAMILI =====
    const message =
      ms.message?.imageMessage
        ? ms
        : ms.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage
        ? {
            message: {
              imageMessage:
                ms.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage
            }
          }
        : null;

    if (!message) {
      return repondre("❌ Reply or send an IMAGE with this command.");
    }

    try {
      // ===== DOWNLOAD IMAGE (SAHIHI) =====
      const mediaPath = await zk.downloadAndSaveMediaMessage(message, "imgbb");

      // ===== UPLOAD =====
      const url = await uploadToImgBB(mediaPath);
      fs.unlinkSync(mediaPath);

      // ===== RESPONSE =====
      const textResult = `
╭───〔 B.M.B TECH IMAGE URL 〕───
│
│ 🖼️ Uploaded Successfully
│
│ 🔗 ${url}
│
╰─────────────────────
`;

      await zk.sendMessage(
        from,
        { text: textResult },
        { quoted: quotedContact }
      );

    } catch (err) {
      console.error("IMGBB ERROR:", err);
      repondre("❌ ImgBB upload failed.");
    }
  }
);
