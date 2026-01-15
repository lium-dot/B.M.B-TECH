const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter');
const { bmbtz } = require("../devbmb/bmbtz");
const pkg = require('@whiskeysockets/baileys');
const { generateWAMessageFromContent, proto } = pkg;
const fs = require("fs-extra");
const ffmpeg = require("fluent-ffmpeg");
const { Catbox } = require('node-catbox');

const catbox = new Catbox();

// Quoted contact
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

async function uploadToCatbox(path) {
  if (!fs.existsSync(path)) throw new Error("File not found");
  return await catbox.uploadFile({ path });
}

async function convertToMp3(input, output) {
  return new Promise((resolve, reject) => {
    ffmpeg(input)
      .toFormat("mp3")
      .on("end", () => resolve(output))
      .on("error", reject)
      .save(output);
  });
}

bmbtz(
  { nomCom: "url", categorie: "General", reaction: "💗" },
  async (from, zk, context) => {
    const { msgRepondu, repondre } = context;

    if (!msgRepondu) {
      return repondre("Please reply to an image, video, or audio.");
    }

    let mediaPath;

    if (msgRepondu.videoMessage) {
      if (msgRepondu.videoMessage.fileLength > 50 * 1024 * 1024) {
        return repondre("Video is too large.");
      }
      mediaPath = await zk.downloadAndSaveMediaMessage(msgRepondu.videoMessage);
    } 
    else if (msgRepondu.imageMessage) {
      mediaPath = await zk.downloadAndSaveMediaMessage(msgRepondu.imageMessage);
    } 
    else if (msgRepondu.audioMessage) {
      const input = await zk.downloadAndSaveMediaMessage(msgRepondu.audioMessage);
      const output = `${input}.mp3`;
      await convertToMp3(input, output);
      fs.unlinkSync(input);
      mediaPath = output;
    } 
    else {
      return repondre("Unsupported media type.");
    }

    try {
      const url = await uploadToCatbox(mediaPath);
      fs.unlinkSync(mediaPath);

      const textResult = `B.M.B TECH URL\n\n${url}`;

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
                title: "",
                subtitle: "",
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
      console.error("URL ERROR:", err);
      repondre("Failed to generate URL.");
    }
  }
);
