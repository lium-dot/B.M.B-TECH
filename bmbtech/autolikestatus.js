//=============== AUTO-LIKE STATUS ===============//
const { bmbtz } = require("../devbmb/bmbtz");
const s = require("../settings");

// Autolikestatus function setup
bmbtz({
  nomCom: 'autolikestatus',
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
   ❤️ *AUTO-LIKE STATUS* ❤️
╚══════════════════╝

👉 Usage:
- Type: *autolikestatus yes*  to enable
- Type: *autolikestatus no*   to disable
    `;
    return zk.sendMessage(chatId, { text: helpBox, ...newsletterContext }, { quoted: ms });
  }

  const option = arg.join(' ').toLowerCase();
  let responseMessage;

  switch (option) {
    case "yes":
      s.AUTO_LIKE_STATUS = 'no';  // Enable Autolikestatus
      responseMessage = "✅ Auto-like status has been *enabled* successfully.";
      break;

    case "no":
      s.AUTO_LIKE_STATUS = 'yes';  // Disable Autolikestatus
      responseMessage = "❌ Auto-like status has been *disabled* successfully.";
      break;

    default:
      responseMessage = "❌ Invalid option.\nUse: *autolikestatus yes* or *autolikestatus no*.";
  }

  // Send the response message in a box
  const replyBox = `
╔══════════════════╗
   ❤️ *AUTO-LIKE STATUS* ❤️
╚══════════════════╝

${responseMessage}
  `;

  try {
    await zk.sendMessage(chatId, { text: replyBox, ...newsletterContext }, { quoted: ms });
  } catch (error) {
    console.error("Error processing autolikestatus command:", error);
    await zk.sendMessage(chatId, { text: '⚠️ Error processing your request.' }, { quoted: ms });
  }
});
