//=============== READ STATUS ===============//
const { bmbtz } = require("../devbmb/bmbtz");
const s = require("../settings");

// Read Status function setup
bmbtz({
  nomCom: 'readstatus',
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
   👀 *READ STATUS MODE* 👀
╚══════════════════╝

👉 Usage:
- Type: *readstatus yes*  to enable
- Type: *readstatus no*   to disable
    `;
    return zk.sendMessage(chatId, { text: helpBox, ...newsletterContext }, { quoted: ms });
  }

  const option = arg.join(' ').toLowerCase();
  let responseMessage;

  switch (option) {
    case "yes":
      s.AUTO_READ_STATUS = 'yes';  // Enable read status
      responseMessage = "✅ Read status has been *enabled* successfully.";
      break;

    case "no":
      s.AUTO_READ_STATUS = 'no';  // Disable read status
      responseMessage = "❌ Read status has been *disabled* successfully.";
      break;

    default:
      responseMessage = "❌ Invalid option.\nUse: *readstatus yes* or *readstatus no*.";
  }

  // Send the response message in a box
  const replyBox = `
╔══════════════════╗
   👀 *READ STATUS MODE* 👀
╚══════════════════╝

${responseMessage}
  `;

  try {
    await zk.sendMessage(chatId, { text: replyBox, ...newsletterContext }, { quoted: ms });
  } catch (error) {
    console.error("Error processing readstatus command:", error);
    await zk.sendMessage(chatId, { text: '⚠️ Error processing your request.' }, { quoted: ms });
  }
});
