//=============== AUTO-TYPING ===============//
const { bmbtz } = require("../devbmb/bmbtz");
const s = require("../settings");

// Autotyping function setup
bmbtz({
  nomCom: 'autotyping',
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
   ⌨️ *AUTO-TYPING* ⌨️
╚══════════════════╝

👉 Usage:
- Type: *autotyping yes*  to enable
- Type: *autotyping no*   to disable
    `;
    return zk.sendMessage(chatId, { text: helpBox, ...newsletterContext }, { quoted: ms });
  }

  const option = arg.join(' ').toLowerCase();
  let responseMessage;

  switch (option) {
    case "yes":
      s.ETAT = '2';  // Enable Autotyping
      responseMessage = "✅ Autotyping has been *enabled* successfully.";
      break;

    case "no":
      s.ETAT = 'no';  // Disable Autotyping
      responseMessage = "❌ Autotyping has been *disabled* successfully.";
      break;

    default:
      responseMessage = "❌ Invalid option.\nUse: *autotyping yes* or *autotyping no*.";
  }

  // Send the response message in a box
  const replyBox = `
╔══════════════════╗
   ⌨️ *AUTO-TYPING* ⌨️
╚══════════════════╝

${responseMessage}
  `;

  try {
    await zk.sendMessage(chatId, { text: replyBox, ...newsletterContext }, { quoted: ms });
  } catch (error) {
    console.error("Error processing autotyping command:", error);
    await zk.sendMessage(chatId, { text: '⚠️ Error processing your request.' }, { quoted: ms });
  }
});
