//=============== DOWNLOAD STATUS ===============//
const { bmbtz } = require("../devbmb/bmbtz");
const s = require("../settings");

// Download-status function setup
bmbtz({
  nomCom: 'downloadstatus',
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

  // Validate user input and respond accordingly
  if (!arg[0]) {
    const helpBox = `
╔══════════════════╗
   ⬇️ *DOWNLOAD STATUS* ⬇️
╚══════════════════╝

👉 Usage:
- Type: *downloadstatus yes*  to enable
- Type: *downloadstatus no*   to disable
    `;
    return zk.sendMessage(chatId, { text: helpBox, ...newsletterContext }, { quoted: ms });
  }

  const option = arg.join(' ').toLowerCase();
  let responseMessage;

  switch (option) {
    case "yes":
      s.AUTO_DOWNLOAD_STATUS = 'yes';  // Enable download status
      responseMessage = "✅ Download-status has been *enabled* successfully.";
      break;

    case "no":
      s.AUTO_DOWNLOAD_STATUS = 'no';   // Disable download status
      responseMessage = "❌ Download-status has been *disabled* successfully.";
      break;

    default:
      responseMessage = "❌ Invalid option.\nUse: *downloadstatus yes* or *downloadstatus no*.";
  }

  // Send the response message in a box
  const replyBox = `
╔══════════════════╗
   ⬇️ *DOWNLOAD STATUS* ⬇️
╚══════════════════╝

${responseMessage}
  `;

  try {
    await zk.sendMessage(chatId, { text: replyBox, ...newsletterContext }, { quoted: ms });
  } catch (error) {
    console.error("Error processing downloadstatus command:", error);
    await zk.sendMessage(chatId, { text: '⚠️ Error processing your request.' }, { quoted: ms });
  }
});
