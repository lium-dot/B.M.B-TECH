const { bmbtz } = require(__dirname + '/../devbmb/bmbtz');
const moment = require("moment-timezone");
const set = require(__dirname + '/../settings');

moment.tz.setDefault(set.TZ);

timoth(
  {
    nomCom: "ping",
    categorie: "General"
  },
  async (chatId, client, message) => {
    const { ms, sender } = message; // sender ni number ya mtu aliyetoa command

    const currentTime = moment().format("HH:mm:ss");
    const currentDate = moment().format("DD/MM/YYYY");

    const pong = Math.floor(Math.random() * 100) + 1;

    try {
      // Pata profile picture ya sender
      let profilePicUrl = "https://files.catbox.moe/mgce79.jpg"; // default kama mtu hana pic
      try {
        profilePicUrl = await client.profilePictureUrl(sender);
      } catch {
        // hakikisha hata kama error, inabaki na default
      }

      // Tuma message bila audio
      await client.sendMessage(
        chatId,
        {
          text: `⚪ Pong: ${pong}ms\n📅 Date: ${currentDate}\n⏰ Time: ${currentTime}`,
          contextInfo: {
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: "120363382023564830@newsletter",
              newsletterName: "𝐛𝐦𝐛 𝐭𝐞𝐜𝐡",
              serverMessageId: 0x8f
            },
            forwardingScore: 1000,
            externalAdReply: {
              title: "B.M.B TECH",
              body: `Pong result for ${sender}`,
              thumbnailUrl: profilePicUrl,
              mediaType: 1,
              renderSmallThumbnail: true
            }
          }
        },
        { quoted: ms }
      );
    } catch (error) {
      console.log("❌ Ping Command Error: " + error);
      repondre("❌ Error: " + error);
    }
  }
);
