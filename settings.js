const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('settings.env'))
    require('dotenv').config({ path: __dirname + '/settings.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;

module.exports = {
    session: process.env.SESSION_ID || 'B.M.B-TECH;;;;eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoidURQdnVDcTRrUWFGa2pDdVRoRGVsb1RXSVRmMXRITnJoSjUrWXp2RW5YTT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiWDVhdzUxS2s4Wkt3SC8wNlFWQlRwK05YaGxJUGFRUEtaRUFldURJVlkwbz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJvUHpKR0s3QXdzLzE5UlVHa0VCZVFGeGUrbVVHRDNCWTg4RWg2by9sWjNvPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ5UGhFSGx3ekIrWEtybUNyVWZmMUFERU5iVHJiRER3MHR2SElUN2ZkK0hjPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Im9QR1ByWkt2ZkJIKzVLVWFWd0RlcmFyYVZ6L2NJeGJBcW1uTDlQem84bGM9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImxSa0ZtQlJ4eFRyc0tXSjBlVHQzQWxXZC9TaWtnRHpkd2lha0I1ODJpblk9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoib1ByK2tWaFJRWDV1VU1xUHhzbkt1ZERCbHZ5MFlCaXFieWhWdE9ERmhuMD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNGtmREN4bThULzEzNE1ZMXg2U1gwUVVHWERPUnNFQlgxTmZEaFBEZ0FTVT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjJIZEdRUERYeU9QUnkyS0dlTGJ2cGQyTjN6YkNhdHBPVUZ0UkJjajlacVRkMTVVZVczbUFyUEp3SkZWWmU0eEREZlRUd0k4OUlmNHRkbkdaSEV3amd3PT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6NiwiYWR2U2VjcmV0S2V5IjoidGo5eTVFUys5U2xWcnAyeHRwN0Y2ZVJVMnFBTmF2TExzdDhlN3RsOEx5VT0iLCJwcm9jZXNzZWRIaXN0b3J5TWVzc2FnZXMiOlt7ImtleSI6eyJyZW1vdGVKaWQiOiIyNTQ3Njk1Mjk3OTFAcy53aGF0c2FwcC5uZXQiLCJmcm9tTWUiOnRydWUsImlkIjoiQUNGRjM2NkM2MzQwOTJENUIyMUU1REQzRTEwRUZBQkIifSwibWVzc2FnZVRpbWVzdGFtcCI6MTc2Nzg2MDc0MX0seyJrZXkiOnsicmVtb3RlSmlkIjoiMjU0NzY5NTI5NzkxQHMud2hhdHNhcHAubmV0IiwiZnJvbU1lIjp0cnVlLCJpZCI6IkFDNENERUY4NDg4OUFENTgyREYwMkQ4MUMzMzRBM0NCIn0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3Njc4NjA3NDR9XSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjIsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6dHJ1ZX0sImRldmljZUlkIjoiQ3cwY1VMMWlRUkNKRlJkMVRDcXotQSIsInBob25lSWQiOiJkYjBjMzhmMS0yOWE3LTQwMTMtYjJkZC03NWY0MjRhOGZhNjAiLCJpZGVudGl0eUlkIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiVG5Xek4zdEdZcXdjK3hndXpadVlFaU5iY1dJPSJ9LCJyZWdpc3RlcmVkIjp0cnVlLCJiYWNrdXBUb2tlbiI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlRUa3QwdDhUMzRNL3hJVnRLdHd1K29UcGxzMD0ifSwicmVnaXN0cmF0aW9uIjp7fSwicGFpcmluZ0NvZGUiOiI3TEdTVDRNWCIsIm1lIjp7ImlkIjoiMjU0NzY5NTI5NzkxOjY4QHMud2hhdHNhcHAubmV0IiwibGlkIjoiMjk5MzIyMzEwODIxNDI6NjhAbGlkIiwibmFtZSI6ImJtYiJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDT0tTekJVUThOUDl5Z1lZQmlBQUtBQT0iLCJhY2NvdW50U2lnbmF0dXJlS2V5Ijoic2pEREFiM3Z1Qnl4ZndldTVxSFlXVVdYZ0w0TGZWWkNwcVFzaFpwQ0gxMD0iLCJhY2NvdW50U2lnbmF0dXJlIjoiNDRiNWNBWElHT3ZaQXVMdEtuREFKcEdMWW1rYytsZ0VDY0p6RC84TVZld1ptaEUvZ1pFajA4K0tHdGRwbG4zRWN4YXhYRHZUUGVpZ25TSWhKQUptQ2c9PSIsImRldmljZVNpZ25hdHVyZSI6IjZ4blJhcHhVY0JzQjlEK1pQeVlXZWY0WlFtUFNTLy85RU9OUFVMdEJHY2JXcVdnQ0JFYVVMaUFDRUxWY0tvY2JsUjBwY2YyeGJrVk96Zldia1Jlamp3PT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjU0NzY5NTI5NzkxOjY4QHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQmJJd3d3Rzk3N2djc1g4SHJ1YWgyRmxGbDRDK0MzMVdRcWFrTElXYVFoOWQifX1dLCJwbGF0Zm9ybSI6ImFuZHJvaWQiLCJyb3V0aW5nSW5mbyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkNBVVFBeEFBIn0sImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTc2Nzg2MDczNSwibGFzdFByb3BIYXNoIjoiM1I5WjM5IiwibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFPQnUifQ==',
    PREFIXE: process.env.PREFIX || "+",
    OWNER_NAME: process.env.OWNER_NAME || "𝐛𝐦𝐛 𝐭𝐞𝐜𝐡",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "254769529791",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    BOT : process.env.BOT_NAME || '𝐛𝐦𝐛 𝐭𝐞𝐜𝐡',
    URL : process.env.BOT_MENU_LINKS || 'https://files.catbox.moe/8qq3l4.jpg',
    MODE: process.env.PUBLIC_MODE || "yes",
    PM_PERMIT: process.env.PM_PERMIT || 'yes',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_API_KEY : process.env.HEROKU_API_KEY, 
    WARN_COUNT : process.env.WARN_COUNT || '3',
    ETAT : process.env.PRESENCE || '',
    ANTICALL : process.env.ANTICALL || 'yes',   
    AUTO_BIO : process.env.AUTO_BIO || 'yes',               
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ANTIDELETE : process.env.ANTI_DELETE_MESSAGE || 'no',
    AUTO_REACT : process.env.AUTO_REACT || 'no',
    AUTO_REACT_STATUS : process.env.AUTO_REACT_STATUS || 'yes',
    AUTO_READ : process.env.AUTO_READ || 'yes',
    AUTO_SAVE_CONTACTS : process.env.AUTO_SAVE_CONTACTS || 'yes',
    CHATBOT: process.env.CHATBOT || 'no',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway"
        : "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway",
};

let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
