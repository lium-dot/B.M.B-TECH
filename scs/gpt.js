const { bmbtz } = require('../devbmb/bmbtz');
const axios = require('axios');

/* ===== VERIFIED CONTACT ===== */
const verifiedContact = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "B.M.B VERIFIED ✅",
      vcard: `BEGIN:VCARD
VERSION:3.0
FN:B.M.B VERIFIED
ORG:B.M.B TECH;
TEL;type=CELL;type=VOICE;waid=255767862457:+255767862457
END:VCARD`
    }
  }
};

/* ===== NEWSLETTER CONTEXT ===== */
const newsletterContext = {
  forwardingScore: 999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: "120363382023564830@newsletter",
    newsletterName: "B.M.B TECH",
    serverMessageId: 1
  }
};

bmbtz(
{
    nomCom: "gpt",
    alias: ["bot", "developer", "ai", "bmbai", "bing"],
    categorie: "AI",
    reaction: "🤖"
},
async (from, conn, context) => {

    const { arg, repondre } = context;
    const q = arg.join(" ");

    try {
        if (!q) {
            return conn.sendMessage(
                from,
                {
                    text:
`╭───〔 GPT AI 〕───
│
│ Usage:
│ .gpt your question
│
│ Example:
│ .gpt Hello
│
╰──────────────`,
                    contextInfo: newsletterContext
                },
                { quoted: verifiedContact }
            );
        }

        const apiUrl =
          `https://lance-frank-asta.onrender.com/api/gpt?q=${encodeURIComponent(q)}`;

        const { data } = await axios.get(apiUrl);

        if (!data || !data.message) {
            return conn.sendMessage(
                from,
                {
                    text: "❌ GPT failed to respond. Please try again later.",
                    contextInfo: newsletterContext
                },
                { quoted: verifiedContact }
            );
        }

        return conn.sendMessage(
            from,
            {
                text:
`╭───〔 GPT RESPONSE 〕───
│
${data.message}
│
╰──────────────`,
                contextInfo: newsletterContext
            },
            { quoted: verifiedContact }
        );

    } catch (error) {
        console.error("GPT ERROR:", error);

        return conn.sendMessage(
            from,
            {
                text: "❌ An error occurred while communicating with the GPT.",
                contextInfo: newsletterContext
            },
            { quoted: verifiedContact }
        );
    }
});
