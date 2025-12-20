//=============== CHATBOT ===============//
const { bmbtz } = require("../devbmb/bmbtz");
const s = require("../settings");

// Chatbot function setup
bmbtz({
  nomCom: 'chatbot',
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
   🤖 *CHATBOT MODE* 🤖
╚══════════════════╝

👉 Usage:
- Type: *chatbot yes*  to enable
- Type: *chatbot no*   to disable
    `;
    return zk.sendMessage(chatId, { text: helpBox, ...newsletterContext }, { quoted: ms });
  }

  const option = arg.join(' ').toLowerCase();
  let responseMessage;

  switch (option) {
    case "yes":
      s.CHAT_BOT = 'yes';  // Enable Chatbot
      responseMessage = "✅ Chatbot has been *enabled* successfully.";
      break;

    case "no":
      s.CHAT_BOT = 'no';   // Disable Chatbot
      responseMessage = "❌ Chatbot has been *disabled* successfully.";
      break;

    default:
      responseMessage = "❌ Invalid option.\nUse: *chatbot yes* or *chatbot no*.";
  }

  // Send the response message in a box
  const replyBox = `
╔══════════════════╗
   🤖 *CHATBOT MODE* 🤖
╚══════════════════╝

${responseMessage}
  `;

  try {
    await zk.sendMessage(chatId, { text: replyBox, ...newsletterContext }, { quoted: ms });
  } catch (error) {
    console.error("Error processing chatbot command:", error);
    await zk.sendMessage(chatId, { text: '⚠️ Error processing your request.' }, { quoted: ms });
  }
});
