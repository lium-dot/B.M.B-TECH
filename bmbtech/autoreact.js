const { bmbtz } = require("../devbmb/bmbtz");
const s = require("../settings");

bmbtz({
  nomCom: 'autoreact',
  categorie: "settings"
}, async (chatId, zk, context) => {
  const { ms, repondre, superUser, auteurMessage, arg } = context;

  if (!superUser) {
    return repondre("*This command is restricted to the bot owner or B.M.B TECH owner.* 👑");
  }

  if (!arg[0]) {
    const boxMessage = `╭──────༺♡༻──────╮
*B.M.B TECH OFFICIAL*
╰──────༺♡༻──────╯

*Command:* autoreact

*Instructions:*
Type "autoreact yes" to enable
Type "autoreact no" to disable

*Status:* ${s.AUTO_REACT === 'yes' ? 'ENABLED ✅' : 'DISABLED ❌'}`;
    
    return await zk.sendMessage(chatId, {
      text: boxMessage,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363382023564830@newsletter",
          newsletterName: "B.M.B TECH OFFICIAL"
        }
      }
    }, { quoted: ms });
  }

  const option = arg.join(' ').toLowerCase();
  switch (option) {
    case "yes":
      s.AUTO_REACT = 'yes';
      break;
    case "no":
      s.AUTO_REACT = 'no';
      break;
    default:
      return repondre("Please type 'autoreact yes' or 'autoreact no'.");
  }

  // Ki-box cha status baada ya kubadilisha
  const statusBox = `╭──────༺♡༻──────╮
*B.M.B TECH OFFICIAL*
╰──────༺♡༻──────╯

*Command:* autoreact
*New Status:* ${option.toUpperCase() === 'YES' ? 'ENABLED ✅' : 'DISABLED ❌'}

*Note:* Automatic reactions setting has been updated.`;

  try {
    await zk.sendMessage(chatId, {
      text: statusBox,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363382023564830@newsletter",
          newsletterName: "B.M.B TECH OFFICIAL"
        }
      }
    }, { quoted: ms });
  } catch (err) {
    console.error("Error sending autoreact ki-box:", err);
    await zk.sendMessage(chatId, { text: 'Error processing your request.' }, { quoted: ms });
  }
});
