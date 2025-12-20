//=============== READ MESSAGE ===============//
const { bmbtz } = require("../devbmb/bmbtz");
const s = require("../settings");

// Read message function setup
bmbtz({
  nomCom: 'readmessage',
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

  // Validate user input and show help if missing
  if (!arg[0]) {
    const helpBox = `
╔══════════════════╗
   📖 *AUTO READ MESSAGE* 📖
╚══════════════════╝

👉 Usage:
- Type: *readmessage yes*  to enable
- Type: *readmessage no*   to disable
    `;
    return zk.sendMessage(chatId, { text: helpBox, ...newsletterContext }, { quoted: ms });
  }

  const option = arg.join(' ').toLowerCase();
  let responseMessage;

  switch (option) {
    case "yes":
      s.AUTO_READ_MESSAGES = 'yes';  // Enable Auto Read
      responseMessage = "✅ Auto read messages has been *enabled* successfully.";
      break;

    case "no":
      s.AUTO_READ_MESSAGES = 'no';  // Disable Auto Read
      responseMessage = "❌ Auto read messages has been *disabled* successfully.";
      break;

    default:
      responseMessage = "❌ Invalid option.\nUse: *readmessage yes* or *readmessage no*.";
  }

  // Send the response message in a box
  const replyBox = `
╔══════════════════╗
   📖 *AUTO READ MESSAGE* 📖
╚══════════════════╝

${responseMessage}
  `;

  try {
    await zk.sendMessage(chatId, { text: replyBox, ...newsletterContext }, { quoted: ms });
  } catch (error) {
    console.error("Error processing readmessage command:", error);
    await zk.sendMessage(chatId, { text: '⚠️ Error processing your request.' }, { quoted: ms });
  }
});
