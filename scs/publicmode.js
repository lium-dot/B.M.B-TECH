//=============== PUBLIC MODE ===============//
const { bmbtz } = require("../devbmb/bmbtz");
const s = require("../settings");

// Public mode function setup
bmbtz({
  nomCom: 'publicmode',
  categorie: "settings"
}, async (chatId, zk, context) => {
  const { ms, repondre, superUser, arg } = context;

  // Newsletter context
  const newsletterContext = {
    contextInfo: {
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363382023564830@newsletter", // weka jid yako
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
   🌐 *PUBLIC MODE* 🌐
╚══════════════════╝

👉 Usage:
- Type: *publicmode yes*  to enable
- Type: *publicmode no*   to disable
    `;
    return zk.sendMessage(chatId, { text: helpBox, ...newsletterContext }, { quoted: ms });
  }

  const option = arg.join(' ').toLowerCase();
  let responseMessage;

  switch (option) {
    case "yes":
      s.MODE = 'yes';  // Enable Public Mode
      responseMessage = "✅ Public mode has been *enabled* successfully.";
      break;

    case "no":
      s.MODE = 'no';   // Disable Public Mode
      responseMessage = "❌ Public mode has been *disabled* successfully.";
      break;

    default:
      responseMessage = "❌ Invalid option.\nUse: *publicmode yes* or *publicmode no*.";
  }

  // Send the response message in a box
  const replyBox = `
╔══════════════════╗
   🌐 *PUBLIC MODE* 🌐
╚══════════════════╝

${responseMessage}
  `;

  try {
    await zk.sendMessage(chatId, { text: replyBox, ...newsletterContext }, { quoted: ms });
  } catch (error) {
    console.error("Error processing publicmode command:", error);
    await zk.sendMessage(chatId, { text: '⚠️ Error processing your request.' }, { quoted: ms });
  }
});
