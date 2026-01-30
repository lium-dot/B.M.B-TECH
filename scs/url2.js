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
  if (!fs.existsSync(filePath)) throw new Error("File not found");

  const base64Image = fs.readFileSync(filePath, "base64");

  const res = await axios.post(
    "https://api.imgbb.com/1/upload",
    null,
    {
      params: {
        key: IMGBB_API_KEY,
        image: base64Image
      }
    }
  );

  return res.data.data.url;
}

bmbtz(
  { nomCom: "url2", categorie: "General", reaction: "🔗" },
  async (from, zk, context) => {
    const { msgRepondu, ms, repondre } = context;

    const imageMsg =
      msgRepondu?.imageMessage || ms.message?.imageMessage;

    if (!imageMsg) {
      return repondre(
        "❌ ImgBB supports IMAGES ONLY.\n\nReply/send an IMAGE with `.url`"
      );
    }

    let mediaPath;

    try {
      /* ===== DOWNLOAD IMAGE ===== */
      mediaPath = await zk.downloadAndSaveMediaMessage(imageMsg);

      /* ===== UPLOAD IMAGE ===== */
      const url = await uploadToImgBB(mediaPath);
      fs.unlinkSync(mediaPath);

      /* ===== UI RESULT ===== */
      const textResult = `
╭───〔 B.M.B TECH IMAGE URL 〕───
│
│ 🖼️ Image Uploaded Successfully
│
│ 🔗 Link:
│ ${url}
│
╰─────────────────────
`;

      const buttons = [
        {
          name: "cta_copy",
          buttonParamsJson: JSON.stringify({
            display_text: "📋 COPY URL",
            copy_code: url
          })
        }
      ];

      const viewOnceMessage = {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({
                text: textResult
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: ""
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                hasMediaAttachment: false
              }),
              nativeFlowMessage:
                proto.Message.InteractiveMessage.NativeFlowMessage.create({
                  buttons
                })
            })
          }
        }
      };

      const waMsg = generateWAMessageFromContent(from, viewOnceMessage, {});
      await zk.relayMessage(from, waMsg.message, {
        messageId: waMsg.key.id
      });

    } catch (err) {
      console.error("IMGBB ERROR:", err);
      repondre("❌ Failed to upload image to ImgBB.");
    }
  }
);
