const { bmbtz } = require('../devbmb/bmbtz');
const { attribuerUnevaleur } = require('../bdd/welcome');
const pkg = require('@whiskeysockets/baileys');
const { generateWAMessageFromContent, proto } = pkg;

async function sendBox(zk, dest, title, body, footer = "B.M.B-TECH") {
    const viewOnceMessage = {
        viewOnceMessage: {
            message: {
                messageContextInfo: {
                    deviceListMetadata: {},
                    deviceListMetadataVersion: 2
                },
                interactiveMessage: proto.Message.InteractiveMessage.create({
                    header: proto.Message.InteractiveMessage.Header.create({
                        title,
                        subtitle: "",
                        hasMediaAttachment: false
                    }),
                    body: proto.Message.InteractiveMessage.Body.create({
                        text: body
                    }),
                    footer: proto.Message.InteractiveMessage.Footer.create({
                        text: footer
                    })
                })
            }
        }
    };

    const msg = generateWAMessageFromContent(dest, viewOnceMessage, {});
    await zk.relayMessage(dest, msg.message, { messageId: msg.key.id });
}

async function events(nomCom) {
    bmbtz(
        {
            nomCom,
            categorie: 'Group'
        },
        async (dest, zk, commandeOptions) => {
            const { arg, superUser, verifAdmin } = commandeOptions;

            // Permission check
            if (!(verifAdmin || superUser)) {
                return sendBox(
                    zk,
                    dest,
                    "❌ Permission Denied",
                    "You are not allowed to use this command.\n\nOnly *Admins* can manage group settings."
                );
            }

            // No argument
            if (!arg[0]) {
                return sendBox(
                    zk,
                    dest,
                    "ℹ️ Command Usage",
                    `Use the command as follows:\n\n` +
                    `• *${nomCom} on*  → Activate\n` +
                    `• *${nomCom} off* → Deactivate`
                );
            }

            // Valid arguments
            if (arg[0] === 'on' || arg[0] === 'off') {
                await attribuerUnevaleur(dest, nomCom, arg[0]);

                return sendBox(
                    zk,
                    dest,
                    "✅ Setting Updated",
                    `The feature *${nomCom}* has been successfully set to:\n\n` +
                    `➤ *${arg[0].toUpperCase()}*`
                );
            }

            // Invalid argument
            return sendBox(
                zk,
                dest,
                "⚠️ Invalid Option",
                "Invalid value detected.\n\nPlease use:\n• *on* to activate\n• *off* to deactivate"
            );
        }
    );
}

// Register group events
events('welcome');
events('goodbye');
events('antipromote');
events('antidemote');
