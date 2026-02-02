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

  const { arg } = context;
  const q = arg.join(" ").toLowerCase().trim();

  try {

    /* ===== BOT NAME RESPONSE ===== */
    if (
      q === "unaitwa nani" ||
      q === "wewe unaitwa nani" ||
      q === "what is your name" ||
      q === "what's your name"
    ) {
      return conn.sendMessage(
        from,
        {
          text:
`╭───〔 GPT AI 〕───
│
My name is Bmb Tech Ai
│
╰──────────────`,
          contextInfo: newsletterContext
        },
        { quoted: verifiedContact }
      );
    }

    /* ===== NO QUESTION ===== */
    if (!q) {
      return conn.sendMessage(
        from,
        {
          text:
`╭───〔 GPT AI 〕───
│
Usage:
.gpt your question
│
Example:
.gpt Hello
│
╰──────────────`,
          contextInfo: newsletterContext
        },
        { quoted: verifiedContact }
      );
    }

    /* ===== GPT API ===== */
    const url = `https://api.giftedtech.web.id/api/ai/gpt4?apikey=gifted&q=${encodeURIComponent(query)}`;
      console.log("API URL:", url);
      const response = await axios.get(url); // Use axios instead of fetch
      console.log("API Response Status:", response.status);

      if (response.status !== 200) {
        const errorText = response.data.error || "Unknown error";
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

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
