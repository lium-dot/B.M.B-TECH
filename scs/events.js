const { bmbtz } = require('../devbmb/bmbtz');
const { attribuerUnevaleur } = require('../bdd/welcome');

const newsletterContext = {
  forwardingScore: 999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: "120363382023564830@newsletter",
    newsletterName: "B.M.B TECH",
    serverMessageId: 1
  }
};

async function events(nomCom) {
bmbtz({
    nomCom: nomCom,
    categorie: 'Group'
}, async (dest, zk, commandeOptions) => {

    const { arg, superUser, verifAdmin } = commandeOptions;

    if (verifAdmin || superUser) {

        // Hakuna argument
        if (!arg[0] || arg.join(' ') === ' ') {
            return zk.sendMessage(dest, {
                text:
`╭───〔 ${nomCom.toUpperCase()} 〕───
│
│ ▶ ${nomCom} on
│    Activate feature
│
│ ▶ ${nomCom} off
│    Deactivate feature
│
╰──────────────`,
                contextInfo: newsletterContext
            });
        }

        // on / off
        if (arg[0] === 'on' || arg[0] === 'off') {

            await attribuerUnevaleur(dest, nomCom, arg[0]);

            return zk.sendMessage(dest, {
                text:
`╭───〔 SUCCESS 〕───
│
│ Feature : ${nomCom}
│ Status  : ${arg[0].toUpperCase()}
│
╰──────────────`,
                contextInfo: newsletterContext
            });
        }

        // Argument mbaya
        return zk.sendMessage(dest, {
            text:
`╭───〔 ERROR 〕───
│
│ Invalid option
│ Use only:
│ • on
│ • off
│
╰──────────────`,
            contextInfo: newsletterContext
        });

    } else {
        return zk.sendMessage(dest, {
            text:
`╭───〔 ACCESS DENIED 〕───
│
│ Admin only command
│
╰──────────────`,
            contextInfo: newsletterContext
        });
    }
});
}

// Group features
events('welcome');
events('goodbye');
events('antipromote');
events('antidemote');
