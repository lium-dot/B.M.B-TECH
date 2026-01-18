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
    const q = arg.join(" ").trim();
    const lower = q.toLowerCase();

    try {
        /* ===== HAKUNA INPUT ===== */
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
│ Image:
│ .gpt generator picha ya simba
│
╰──────────────`,
                    contextInfo: newsletterContext
                },
                { quoted: verifiedContact }
            );
        }

        /* ===== BOT NAME LOGIC ===== */
        if (
            lower.includes("unaitwa nani") ||
            lower.includes("jina lako") ||
            lower.includes("what is your name") ||
            lower.includes("who are you") ||
            lower.includes("your name")
        ) {
            return conn.sendMessage(
                from,
                {
                    text:
`╭───〔 GPT AI 〕───
│
│ Mimi naitwa *Bmb Tech*
│ My name is *Bmb Tech*
│
╰──────────────`,
                    contextInfo: newsletterContext
                },
                { quoted: verifiedContact }
            );
        }

        /* ===== IMAGE GENERATOR ===== */
        if (lower.startsWith("generator picha")) {
            const prompt = q.replace(/generator picha/i, "").trim();

            if (!prompt) {
                return conn.sendMessage(
                    from,
                    {
                        text: "⚠️ Andika maelezo ya picha unayotaka.",
                        contextInfo: newsletterContext
                    },
                    { quoted: verifiedContact }
                );
            }

            const imageUrl = `https://img.hazex.workers.dev/?prompt=${encodeURIComponent(prompt)}`;

            return conn.sendMessage(
                from,
                {
                    image: { url: imageUrl },
                    caption:
`╭───〔 IMAGE GENERATED 〕───
│
│ Prompt:
│ ${prompt}
│
╰──────────────`,
                    contextInfo: newsletterContext
                },
                { quoted: verifiedContact }
            );
        }

        /* ===== GPT CHAT (COPILOT – KISWAHILI SUPPORT) ===== */
        const apiUrl = `https://eliteprotech-apis.zone.id/copilot?message=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data || !data.response) {
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
${data.response}
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
