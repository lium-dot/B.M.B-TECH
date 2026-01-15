const axios = require("axios");
const { bmbtz } = require(__dirname + "/../devbmb/bmbtz");
const { format } = require(__dirname + "/../devbmb/mesfonctions");
const os = require('os');
const moment = require("moment-timezone");
const settings = require(__dirname + "/../settings");
const { repondre } = require(__dirname + "/../devbmb/context");
const { fetchGitHubStats } = require(__dirname + "/Dev-bmbtech");
const { showLoadingAnimation } = require(__dirname + "/System");

const readMore = String.fromCharCode(8206).repeat(4001);

const formatUptime = (seconds) => {
    seconds = Number(seconds);
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return [
        days > 0 ? `${days} ${days === 1 ? "day" : "days"}` : '',
        hours > 0 ? `${hours} ${hours === 1 ? "hour" : "hours"}` : '',
        minutes > 0 ? `${minutes} ${minutes === 1 ? "minute" : "minutes"}` : '',
        remainingSeconds > 0 ? `${remainingSeconds} ${remainingSeconds === 1 ? "second" : "seconds"}` : ''
    ].filter(Boolean).join(', ');
};

// Function to handle ping button
const handlePingButton = async (dest, zk) => {
    await showLoadingAnimation(dest, zk); // Use the showLoadingAnimation from System.js
    zk.sendMessage(dest, { text: "Ping results sent!" });
};

// Function to handle repo info button
const handleRepoButton = async (dest, zk) => {
    try {
        const { stars, forks, totalUsers } = await fetchGitHubStats(); // Use fetchGitHubStats from beltahh.js
        const message = `
Repo Information:
⭐ Stars: ${stars}
🍴 Forks: ${forks}
👥 Total Users: ${totalUsers}
        `;
        zk.sendMessage(dest, { text: message });
    } catch (error) {
        console.error("Error fetching repo info:", error);
        zk.sendMessage(dest, { text: "Failed to fetch repository information." });
    }
};

// Function to handle uptime button
const handleUptimeButton = async (dest, zk) => {
    const botUptime = process.uptime(); // Get the bot uptime in seconds
    const formattedUptime = formatUptime(botUptime);

    zk.sendMessage(dest, {
        text: `🤖 Bot Uptime: ${formattedUptime}`
    });
};

// Function to handle owner button
const handleOwnerButton = async (dest, zk) => {
    const ownerjid = settings.NUMERO_OWNER.replace(/[^0-9]/g) + "@s.whatsapp.net";
    const vcard =
        'BEGIN:VCARD\n' +
        'VERSION:3.0\n' +
        `FN:${settings.OWNER_NAME}\n` +
        'ORG:undefined;\n' +
        `TEL;type=CELL;type=VOICE;waid=${settings.NUMERO_OWNER}:+${settings.NUMERO_OWNER}\n` +
        'END:VCARD';

    zk.sendMessage(dest, {
        contacts: {
            displayName: settings.OWNER_NAME,
            contacts: [{ vcard }],
        },
    });
};

// Define the menus command with buttons
devbmb({ nomCom: "menus", aliases: ["liste", "helplist", "commandlist"], categorie: "SYSTEM" }, async (message, client, config) => {
    const { ms, respond, prefix, nomAuteurMessage } = config;
    moment.tz.setDefault("Africa/Nairobi");
    const currentTime = moment();
    const formattedTime = currentTime.format("HH:mm:ss");
    const formattedDate = currentTime.format("DD/MM/YYYY");
    const currentHour = currentTime.hour();

    const greetings = ["Good Morning 🌄", "Good Afternoon 🌅", "Good Evening ⛅", "Good Night 🌙"];
    const greeting = currentHour < 12 ? greetings[0] : currentHour < 17 ? greetings[1] : currentHour < 21 ? greetings[2] : greetings[3];

    const messageWithButtons = {
        text: `
${greeting}, *${nomAuteurMessage || "User"}*

💡 Select an option:
1️⃣ Check Ping
2️⃣ View Repo Info
3️⃣ Bot Uptime
4️⃣ Contact Owner
        `,
        buttons: [
            { buttonId: 'ping_button', buttonText: { displayText: 'Check Ping' }, type: 1 },
            { buttonId: 'repo_button', buttonText: { displayText: 'View Repo Info' }, type: 1 },
            { buttonId: 'uptime_button', buttonText: { displayText: 'Bot Uptime' }, type: 1 },
            { buttonId: 'owner_button', buttonText: { displayText: 'Contact Owner' }, type: 1 }
        ],
        headerType: 1
    };

    await client.sendMessage(message.chatId, messageWithButtons, { quoted: ms });

    // Listen for button responses
    client.on('button_click', async (button) => {
        if (button.buttonId === 'ping_button') {
            await handlePingButton(button.chatId, client);
        } else if (button.buttonId === 'repo_button') {
            await handleRepoButton(button.chatId, client);
        } else if (button.buttonId === 'uptime_button') {
            await handleUptimeButton(button.chatId, client);
        } else if (button.buttonId === 'owner_button') {
            await handleOwnerButton(button.chatId, client);
        }
    });
});
