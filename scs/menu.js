const { bmbtz } = require(__dirname + "/../devbmb/bmbtz");
const os = require('os');
const moment = require("moment-timezone");
const s = require(__dirname + "/../settings");
const fs = require("fs");
const path = require("path");

const quotedContact = {
  key: {
    fromMe: false,
    participant: `0@s.whatsapp.net`,
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "B.M.B VERIFIED ✅",
      vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:B.M.B VERIFIED ✅\nORG:BMB-TECH BOT;\nTEL;type=CELL;type=VOICE;waid=255767862457:+254769529791\nEND:VCARD"
    }
  }
};

bmbtz({
  nomCom: "menu",
  categorie: "Menu"
}, async (_0x466846, _0x35dd19, _0x42e541) => {

  let {
    ms,
    repondre,
    prefixe
  } = _0x42e541;

  let { cm } = require(__dirname + "/../devbmb/bmbtz");
  let categories = {};
  let mode = s.MODE.toLowerCase() !== "yes" ? "private" : "public";

  cm.map(cmd => {
    if (!categories[cmd.categorie]) {
      categories[cmd.categorie] = [];
    }
    categories[cmd.categorie].push(cmd.nomCom);
  });

  moment.tz.setDefault("Etc/GMT");
  const date = moment().format("DD/MM/YYYY");

  let introText = `
╭━━✧★☞  𝗕.𝗠.𝗕-𝗧𝗘𝗖𝗛 ✧━━❖
┊✺┌────••••────⊷
┃★│◎ Owner : ${s.BOT}
┃★│◎ Prefix : [ ${s.PREFIXE} ]
┃★│◎ Mode : ${mode}
┃★│◎ Ram : 12/228 GB
┃★│◎ Date : ${date}
┃★│◎ Platform : ${os.platform()}
┃★│◎ Creator : bmb tech 
┃★│◎ Commands : ${cm.length}
┊★└────••••────⊷
╰━━━••✧ 𝐛𝐦𝐛 𝐭𝐞𝐜𝐡 ✧••━━━◆
`;

  let menuText = "";

  for (const cat in categories) {
    menuText += `\n╭━━━❂ *${cat}* 🖥️\n║╭━━══••══━━••⊷ `;
    for (const cmdName of categories[cat]) {
      menuText += `\n║┊❂ ${s.PREFIXE}  *${cmdName}*`;
    }
    menuText += `\n║╰━━══••══━━••⊷\n╰════────════`;
  }

  menuText += "\n> @B.M.B-TECH\n";

  try {
    const folderPath = path.join(__dirname, "../scs");
    const files = fs.readdirSync(folderPath).filter(f =>
      /\.(jpe?g|png|webp)$/i.test(f)
    );
    const randomImage = files[Math.floor(Math.random() * files.length)];
    const imagePath = path.join(folderPath, randomImage);
    const imageBuffer = fs.readFileSync(imagePath);

    await _0x35dd19.sendMessage(_0x466846, {
      image: imageBuffer,
      caption: introText + menuText,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        quotedMessage: quotedContact.message,
        participant: quotedContact.key.participant,
        remoteJid: quotedContact.key.remoteJid,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363382023564830@newsletter",
          newsletterName: "𝗕.𝗠.𝗕-𝗧𝗘𝗖𝗛",
          serverMessageId: 143
        }
      }
    });

  } catch (err) {
    console.error("Menu error: ", err);
    repondre("Menu error: " + err);
  }
});
