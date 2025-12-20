//=============== AUTO-RECORD ===============//
const { bmbtz } = require("../devbmb/bmbtz");
const s = require("../settings");

// Autorecord function setup
bmbtz({
  nomCom: 'autorecord',
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
   🎙️ *AUTO-RECORD* 🎙️
╚══════════════════╝

👉 Usage:
- Type: *autorecord yes*  to enable
- Type: *autorecord no*   to disable
    `;
    return zk.sendMessage(chatId, { text: helpBox, ...newsletterContext }, { quoted: ms });
  }

  const option = arg.join(' ').toLowerCase();
  let responseMessage;

  switch (option) {
    case "yes":
      s.ETAT = '3';  // Enable Autorecord
      responseMessage = "✅ Autorecord has been *enabled* successfully.";
      break;

    case "no":
      s.ETAT = 'no';  // Disable Autorecord
      responseMessage = "❌ Autorecord has been *disabled* successfully.";
      break;

    default:
      responseMessage = "❌ Invalid option.\nUse: *autorecord yes* or *autorecord no*.";
  }

  // Send the response message in a box
  const replyBox = `
╔══════════════════╗
   🎙️ *AUTO-RECORD* 🎙️
╚══════════════════╝

${responseMessage}
  `;

  try {
    await zk.sendMessage(chatId, { text: replyBox, ...newsletterContext }, { quoted: ms });
  } catch (error) {
    console.error("Error processing autorecord command:", error);
    await zk.sendMessage(chatId, { text: '⚠️ Error processing your request.' }, { quoted: ms });
  }
});
