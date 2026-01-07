const { bmbtz } = require('../devbmb/bmbtz');
const pkg = require('@whiskeysockets/baileys');
const { generateWAMessageFromContent, proto } = pkg;
const fetch = require('node-fetch'); // hakikisha fetch iko

const apiKey = ''; // Ikiwa una API key ya davidcyriltech, weka hapa

bmbtz({ nomCom: 'gpt', reaction: '🤦', categorie: 'bmbai' }, async (from, conn, ctx) => {
    const { arg, repondre } = ctx;

    try {
        if (!arg || !arg.length) {
            return repondre('Hello.\n\nWhat help can I offer you today?');
        }

        const prompt = arg.join(' ');

        // Hapa tunatumia API mpya
        const apiUrl = `https://apis.davidcyriltech.my.id/ai/chatbot?query=${encodeURIComponent(prompt)}&apikey=${apiKey}`;

        const res = await fetch(apiUrl);
        const json = await res.json();

        if (!json?.result) { // David Cyril API response inakuwa na 'result'
            throw new Error('Invalid API response');
        }

        const answer = json.result; // chukua jibu kutoka API

        // COPY button
        const buttons = [
            {
                name: 'cta_copy',
                buttonParamsJson: JSON.stringify({
                    display_text: 'COPY RESPONSE',
                    id: 'copy_gpt',
                    copy_code: answer
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
                                text: '> B.M.B-TECH'
                            }),
                            header: proto.Message.InteractiveMessage.Header.create({
                                title: '',
                                subtitle: '',
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
                    quotedMessage: quotedContact.message
                }
            }
        );

        await conn.relayMessage(from, msg.message, { messageId: msg.key.id });

    } catch (err) {
        console.error(err);
        repondre('Error getting response.');
    }
});
