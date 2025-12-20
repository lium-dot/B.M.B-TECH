//=============== START MESSAGE ===============//
const { bmbtz } = require("../devbmb/bmbtz");
const s = require("../settings");

// Start message function setup
bmbtz({
  nomCom: 'startmessage',
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
   ✨ *START MESSAGE MODE* ✨
╚══════════════════╝

👉 Usage:
- Type: *startmessage yes*  to enable
- Type: *startmessage no*   to disable
    `;
    return zk.sendMessage(chatId, { text: helpBox, ...newsletterContext }, { quoted: ms });
  }

  const option = arg.join(' ').toLowerCase();
  let responseMessage;

  switch (option) {
    case "yes":
      s.DP = 'yes';  // Enable Start Message
      responseMessage = "✅ Start message has been *enabled* successfully.";
      break;

    case "no":
      s.DP = 'no';  // Disable Start Message
      responseMessage = "❌ Start message has been *disabled* successfully.";
      break;

    default:
      responseMessage = "❌ Invalid option.\nUse: *startmessage yes* or *startmessage no*.";
  }

  // Send the response message in a box
  const replyBox = `
╔══════════════════╗
   ✨ *START MESSAGE MODE* ✨
╚══════════════════╝

${responseMessage}
  `;

  try {
    await zk.sendMessage(chatId, { text: replyBox, ...newsletterContext }, { quoted: ms });
  } catch (error) {
    console.error("Error processing startmessage command:", error);
    await zk.sendMessage(chatId, { text: '⚠️ Error processing your request.' }, { quoted: ms });
  }
});
