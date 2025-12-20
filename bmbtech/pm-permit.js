//=============== PM PERMIT ===============//
const { bmbtz } = require("../devbmb/bmbtz");
const s = require("../settings");

// PM-Permit function setup
bmbtz({
  nomCom: 'pm-permit',
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
   📩 *PM PERMIT MODE* 📩
╚══════════════════╝

👉 Usage:
- Type: *pm-permit yes*  to enable
- Type: *pm-permit no*   to disable
    `;
    return zk.sendMessage(chatId, { text: helpBox, ...newsletterContext }, { quoted: ms });
  }

  const option = arg.join(' ').toLowerCase();
  let responseMessage;

  switch (option) {
    case "yes":
      s.PM_PERMIT = 'yes';  // Enable PM-Permit
      responseMessage = "✅ PM-Permit has been *enabled* successfully.";
      break;

    case "no":
      s.PM_PERMIT = 'no';   // Disable PM-Permit
      responseMessage = "❌ PM-Permit has been *disabled* successfully.";
      break;

    default:
      responseMessage = "❌ Invalid option.\nUse: *pm-permit yes* or *pm-permit no*.";
  }

  // Send the response message in a box
  const replyBox = `
╔══════════════════╗
   📩 *PM PERMIT MODE* 📩
╚══════════════════╝

${responseMessage}
  `;

  try {
    await zk.sendMessage(chatId, { text: replyBox, ...newsletterContext }, { quoted: ms });
  } catch (error) {
    console.error("Error processing pm-permit command:", error);
    await zk.sendMessage(chatId, { text: '⚠️ Error processing your request.' }, { quoted: ms });
  }
});
