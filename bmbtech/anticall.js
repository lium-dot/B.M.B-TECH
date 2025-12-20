//=============== ANTI-CALL ===============//
const { bmbtz } = require("../devbmb/bmbtz");
const s = require("../settings");

// Anti-call function setup
bmbtz({
  nomCom: 'anticall',
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
   📵 *ANTI-CALL MODE* 📵
╚══════════════════╝

👉 Usage:
- Type: *anticall yes*  to enable
- Type: *anticall no*   to disable
    `;
    return zk.sendMessage(chatId, { text: helpBox, ...newsletterContext }, { quoted: ms });
  }

  const option = arg.join(' ').toLowerCase();
  let responseMessage;

  switch (option) {
    case "yes":
      s.ANTICALL = 'yes';  // Enable Anti-Call
      responseMessage = "✅ Anti-call has been *enabled* successfully.";
      break;

    case "no":
      s.ANTICALL = 'no';  // Disable Anti-Call
      responseMessage = "❌ Anti-call has been *disabled* successfully.";
      break;

    default:
      responseMessage = "❌ Invalid option.\nUse: *anticall yes* or *anticall no*.";
  }

  // Send the response message in a box
  const replyBox = `
╔══════════════════╗
   📵 *ANTI-CALL MODE* 📵
╚══════════════════╝

${responseMessage}
  `;

  try {
    await zk.sendMessage(chatId, { text: replyBox, ...newsletterContext }, { quoted: ms });
  } catch (error) {
    console.error("Error processing anticall command:", error);
    await zk.sendMessage(chatId, { text: '⚠️ Error processing your request.' }, { quoted: ms });
  }
});
