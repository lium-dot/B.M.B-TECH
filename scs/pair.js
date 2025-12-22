// VCard Contact kwa quoting
const quotedContact = {
  key: {
    fromMe: false,
    participant: `0@s.whatsapp.net`,
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "B.M.B TECH VERIFIED ✅",
      vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:B.M.B TECH VERIFIED ✅\nORG:BMB-TECH BOT;\nTEL;type=CELL;type=VOICE;waid=255767862457:+255767862457\nEND:VCARD"
    }
  }
};

bmbtz(
  {
    nomCom: "pair",
    aliases: ["session", "pair", "paircode", "qrcode"],
    reaction: "🔑",
    categorie: "General",
  },
  async (dest, origine, msg) => {
    const { repondre, arg, ms } = msg;  // <-- hakikisha unapata ms (message object) hapa

    try {
      if (!arg || arg.length === 0) {
        return repondre("*Please provide a number in the format: 25474........*");
      }

      await repondre("*Please wait... Generating pair code*");

      const encodedNumber = encodeURIComponent(arg.join(" "));
      const apiUrl = `https://bmb-tech-pair-site.onrender.com/code?number=${encodedNumber}`;
      
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (data?.code) {
        await origine.sendMessage(dest, { // Tuma kama reply, with quoted contact
          text: data.code,
          contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            mentionedJid: [],
            forwardedNewsletterMessageInfo: {
              newsletterJid: "120363382023564830@newsletter",
              newsletterName: "B.M.B TECH",
              serverMessageId: 1
            }
          }
        }, { quoted: quotedContact });

        await repondre("*Copy the above code and use it to link your WhatsApp via linked devices*");
      } else {
        throw new Error("Invalid response from API - no code found");
      }
    } catch (error) {
      console.error("Error getting API response:", error.message);
      repondre("Error: Could not get response from the pairing service.");
    }
  }
);
