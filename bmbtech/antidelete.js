//=============== ANTI-DELETE ===============//
const { bmbtz } = require("../devbmb/bmbtz");
const s = require("../settings");

// Anti-delete function setup
bmbtz({
  nomCom: 'antidelete',
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

  // Validate user input
  if (!arg[0]) {
    const helpBox = `
╔══════════════════╗
   🗑️ *ANTI-DELETE MODE* 🗑️
╚══════════════════╝

👉 Usage:
- Type: *antidelete yes*  to enable
- Type: *antidelete no*   to disable
    `;
    return zk.sendMessage(chatId, { text: helpBox, ...newsletterContext }, { quoted: ms });
  }

  const option = arg.join(' ').toLowerCase();
  let responseMessage;

  switch (option) {
    case "yes":
      s.ADM = 'yes';  // Enable Anti-delete
      responseMessage = "✅ Anti-delete has been *enabled* successfully.";
      break;

    case "no":
      s.ADM = 'no';  // Disable Anti-delete
      responseMessage = "❌ Anti-delete has been *disabled* successfully.";
      break;

    default:
      responseMessage = "❌ Invalid option.\nUse: *antidelete yes* or *antidelete no*.";
  }

  // Send the response in a box
  const replyBox = `
╔══════════════════╗
   🗑️ *ANTI-DELETE MODE* 🗑️
╚══════════════════╝

${responseMessage}
  `;

  try {
    await zk.sendMessage(chatId, { text: replyBox, ...newsletterContext }, { quoted: ms });
  } catch (error) {
    console.error("Error processing antidelete command:", error);
    await zk.sendMessage(chatId, { text: '⚠️ Error processing your request.' }, { quoted: ms });
  }
});
