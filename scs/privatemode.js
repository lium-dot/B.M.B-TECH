//=============== PRIVATE-MODE ===============//
const { bmbtz } = require("../devbmb/bmbtz");
const s = require("../settings");

// PrivateMode function setup
bmbtz({
  nomCom: 'privatemode',
  categorie: "settings"
}, async (chatId, zk, context) => {
  const { ms, repondre, superUser, arg } = context;

  // Newsletter context
  const newsletterContext = {
    contextInfo: {
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363382023564830@newsletter",
        newsletterName: "B.M.B TECH OFFICIAL"
      }
    }
  };

  // Check if the command is issued by the owner
  if (!superUser) {
    return repondre("⚠️ This command is restricted to the bot owner.");
  }

  // Show help box if no argument is provided
  if (!arg[0]) {
    const helpBox = `
╔══════════════════╗
   🔒 *PRIVATE MODE* 🔒
╚══════════════════╝

👉 Usage:
- Type: *privatemode yes*  to enable
- Type: *privatemode no*   to disable
    `;
    return zk.sendMessage(chatId, { text: helpBox, ...newsletterContext }, { quoted: ms });
  }

  const option = arg.join(' ').toLowerCase();
  let responseMessage;

  switch (option) {
    case "yes":
      s.MODE = 'no';  // Enable PrivateMode
      responseMessage = "✅ PrivateMode has been *enabled* successfully.";
      break;

    case "no":
      s.MODE = 'yes';  // Disable PrivateMode
      responseMessage = "❌ PrivateMode has been *disabled* successfully.";
      break;

    default:
      responseMessage = "❌ Invalid option.\nUse: *privatemode yes* or *privatemode no*.";
  }

  // Send the response message in a box
  const replyBox = `
╔══════════════════╗
   🔒 *PRIVATE MODE* 🔒
╚══════════════════╝

${responseMessage}
  `;

  try {
    await zk.sendMessage(chatId, { text: replyBox, ...newsletterContext }, { quoted: ms });
  } catch (error) {
    console.error("Error processing privatemode command:", error);
    await zk.sendMessage(chatId, { text: '⚠️ Error processing your request.' }, { quoted: ms });
  }
});
