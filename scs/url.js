const { bmbtz } = require("../devbmb/bmbtz");
const fancy = require("../devbmb/style");

const pkg = require("@whiskeysockets/baileys");
const { generateWAMessageFromContent, proto } = pkg;

// VCard Contact (status style)
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
TEL;type=CELL;type=VOICE;waid=255767862457:+255767862457
END:VCARD`
    }
  }
};

// Function ya kujenga BOX
function buildBox(text) {
  const lines = text.split("\n");
  const maxLength = Math.max(...lines.map(l => l.length));

  const top = "╔" + "═".repeat(maxLength + 2) + "╗";
  const bottom = "╚" + "═".repeat(maxLength + 2) + "╝";

  const middle = lines
    .map(l => `║ ${l.padEnd(maxLength, " ")} ║`)
    .join("\n");

  return `${top}\n${middle}\n${bottom}`;
}

bmbtz(
  {
    nomCom: "fancy",
    categorie: "Fun",
    reaction: "✍️"
  },
  async (from, conn, context) => {
    const { arg, repondre, prefixe } = context;

    const id = arg[0]?.match(/\d+/)?.join("");
    const text = arg.slice(1).join(" ");

    try {
      // Hakuna ID au text → onyesha list
      if (!id || !text) {
        return await conn.sendMessage(
          from,
          {
            text:
              `Example:\n${prefixe}fancy 10 bmb tech\n\n` +
              fancy.list("B.M.B-TECH", fancy)
          },
          { quoted: quotedContact }
        );
      }

      const selectedStyle = fancy[parseInt(id) - 1];
      if (!selectedStyle) {
        return repondre("❌ Style not found.");
      }

      const styledText = fancy.apply(selectedStyle, text);

      // 📦 BOX
      const boxedText = buildBox(styledText);

      // 🔘 COPY BUTTON (inakili text halisi bila box)
      const buttons = [
        {
          name: "cta_copy",
          buttonParamsJson: JSON.stringify({
            display_text: "📋 COPY TEXT",
            copy_code: styledText
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
                text: boxedText
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
      await conn.relayMessage(from, waMsg.message, {
        messageId: waMsg.key.id
      });

    } catch (error) {
      console.error("FANCY ERROR:", error);
      await repondre("An error occurred while processing your request.");
    }
  }
);
