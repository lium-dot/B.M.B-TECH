const { bmbtz } = require('../devbmb/bmbtz');
const axios = require('axios');

bmbtz({
    nomCom: 'gpt',
    categorie: 'AI'
}, async (dest, zk, commandeOptions) => {

    const { arg, repondre } = commandeOptions;
    const text = arg.join(' ').trim();

    if (!text) {
        return repondre(
`╭───〔 GPT AI 〕───
│
│ ▶ .gpt habari
│ ▶ .gpt generator picha ya simba
│
╰──────────────`
        );
    }

    const lower = text.toLowerCase();

    /* ======================
       JINA LA BOT
    ====================== */
    if (
        lower.includes('unaitwa nani') ||
        lower.includes('jina lako') ||
        lower.includes('who are you') ||
        lower.includes('what is your name') ||
        lower.includes('your name')
    ) {
        return repondre(
`╭───〔 GPT AI 〕───
│
│ Mimi naitwa *Bmb Tech*
│ My name is *Bmb Tech*
│
╰──────────────`
        );
    }

    /* ======================
       IMAGE GENERATOR
    ====================== */
    if (lower.startsWith('generator picha')) {

        const prompt = text.replace(/generator picha/i, '').trim();

        if (!prompt) {
            return repondre('Andika maelezo ya picha unayotaka.');
        }

        const imageUrl = `https://img.hazex.workers.dev/?prompt=${encodeURIComponent(prompt)}`;

        return zk.sendMessage(dest, {
            image: { url: imageUrl },
            caption:
`╭───〔 IMAGE GENERATED 〕───
│
│ Prompt:
│ ${prompt}
│
╰──────────────`
        });
    }

    /* ======================
       AI CHAT (COPILOT)
    ====================== */
    try {
        const apiUrl = `https://eliteprotech-apis.zone.id/copilot?message=${encodeURIComponent(text)}`;
        const { data } = await axios.get(apiUrl);

        if (!data || !data.response) {
            return repondre('AI imeshindwa kujibu, jaribu tena.');
        }

        return repondre(
`╭───〔 BMB TECH AI 〕───
│
│ ${data.response}
│
╰──────────────`
        );

    } catch (err) {
        console.error(err);
        return repondre('Kuna hitilafu kwenye AI.');
    }
});
