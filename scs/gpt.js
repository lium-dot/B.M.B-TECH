const { bmbtz } = require('../devbmb/bmbtz');
const pkg = require('@whiskeysockets/baileys');
const { generateWAMessageFromContent, proto } = pkg;
const fetch = require('node-fetch'); 

// API mpya
const apiKey = "";
const davidApiUrl = (query) =>
  `https://apis.davidcyriltech.my.id/ai/chatbot?query=${encodeURIComponent(query)}&apikey=${apiKey}`;

bmbtz({ nomCom: 'gpt', reaction: '🤦', categorie: 'bmbai' }, async (from, conn, ctx) => {
  const { arg, repondre } = ctx;

  try {
    if (!arg || !arg.length) {
      return repondre('Hello.\n\nWhat help can I offer you today?');
    }

    const prompt = arg.join(' ').trim().toLowerCase();

    // Logic ya "name recognition"
    if (
      prompt.includes("unaitwa nani") ||
      prompt.includes("what is your name") ||
      prompt.includes("jina lako ni nani")
    ) {
      return repondre("My name is Bmb Tech");
    }

    // Fallback GPT API
    let answer = "";
    try {
      // Jaribu API mpya ya David Cyril Tech
      const res = await fetch(davidApiUrl(prompt));
      const json = await res.json();
      if (json?.response) {
        answer = json.response;
      } else {
        throw new Error("David API failed, fallback to GPT");
      }
    } catch (err) {
      // Fallback kwa GPT API ya awali
      const gptRes = await fetch(
        `https://api.gurusensei.workers.dev/llama?prompt=${encodeURIComponent(prompt)}`
      );
      const gptJson = await gptRes.json();
      if (!gptJson?.response?.response) throw new Error("Invalid GPT API response");
      answer = gptJson.response.response;
    }

    // COPY + NEWSLETTER buttons
    const buttons = [
      {
        name: 'cta_copy',
        buttonParamsJson: JSON.stringify({
          display_text: 'COPY RESPONSE',
          id: 'copy_gpt',
          copy_code: answer
        })
      },
      {
        name: 'cta_newsletter',
        buttonParamsJson: JSON.stringify({
          display_text: 'JOIN NEWSLETTER',
          id: 'newsletter_join',
          newsletter_jid: newsletterJid || ''
        })
      },
      {
        name: 'cta_verify',
        buttonParamsJson: JSON.stringify({
          display_text: 'VERIFY CONTACT',
          id: 'contact_verify',
          contact_jid: contactVerify || ''
        })
      }
    ];

    const msg = generateWAMessageFromContent(
      from,
      {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({
                text: answer
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: '> *B.M.B-TECH*'
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                title: 'GPT RESPONSE',
                subtitle: 'Powered by B.M.B-TECH',
                hasMediaAttachment: false
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons
              })
            })
          }
        }
      },
      {
        contextInfo: {
          ...newsletterContext,
          quotedMessage: quotedContact?.message
        }
      }
    );

    await conn.relayMessage(from, msg.message, { messageId: msg.key.id });

  } catch (err) {
    console.error(err);
    repondre(`Error getting response: ${err.message}`);
  }
});
