//=============== GREET ===============//
const { bmbtz } = require("../devbmb/bmbtz");
const s = require("../settings");

// Greet function setup
bmbtz({
  nomCom: 'greet',
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
   👋 *GREET MODE* 👋
╚══════════════════╝

👉 Usage:
- Type: *greet yes*  to enable
- Type: *greet no*   to disable
    `;
    return zk.sendMessage(chatId, { text: helpBox, ...newsletterContext }, { quoted: ms });
  }

  const option = arg.join(' ').toLowerCase();
  let responseMessage;

  switch (option) {
    case "yes":
      s.AUTO_REPLY = 'yes';  // Enable Auto Greet
      responseMessage = "✅ Greet mode has been *enabled* successfully.";
      break;

    case "no":
      s.AUTO_REPLY = 'no';   // Disable Auto Greet
      responseMessage = "❌ Greet mode has been *disabled* successfully.";
      break;

    default:
      responseMessage = "❌ Invalid option.\nUse: *greet yes* or *greet no*.";
  }

  // Send the response message in a box
  const replyBox = `
╔══════════════════╗
   👋 *GREET MODE* 👋
╚══════════════════╝

${responseMessage}
  `;

  try {
    await zk.sendMessage(chatId, { text: replyBox, ...newsletterContext }, { quoted: ms });
  } catch (error) {
    console.error("Error processing greet command:", error);
    await zk.sendMessage(chatId, { text: '⚠️ Error processing your request.' }, { quoted: ms });
  }
});
