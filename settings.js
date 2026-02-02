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
    session: process.env.SESSION_ID || 'B.M.B-TECH;;;;eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiY01RakJ5a0VjeXVFalNNdXBYR3JsMlFUVEQ0aUNGOFBoQ28zaEtNSW4xcz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiMVJETWVzeHFBQXlEUHprNEN6Q2VDTll3d1c1MktPaDBLaVBhbktYK3pYWT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJzQmNXWlFMVmNwbldpRWVOb0lWbnNxbjJrMlFuVzBSa3E3R1dYc0NzT1VVPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJFUE1ha3N1NHYrWXBIM2JlT3U0T1lodnFpbUwrQm41bFNrMEo2TVN1ckhRPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IndQZDR1a2NacjR3b2pob2V5VFQ5SnBNQlo5YzBKYVpZREgyd3N6MGw4M0E9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImtXYXpXVFo2UktOaHBhMGxDdnp6bFprM0h6UWxWUG1ITkxnN2tSbHBxUnM9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiWURPeGpNd2hGVGtFWUgxSVZjR1llaGRIbUx6Z09ldkhiMlFmRjYwc0tGWT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoicVVyNkJJMURkandmbVVzUm1uOEFLMGN4b3ROaCtQdFZoWUEwRWZKSkFCWT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlJvQnVJcVNVdWpCYWdER3JaNjljUVZMY1RXcUVjNGIvMndKbUxWNmgzTU0rZGhmSVlSY0pEdmQ1N1ZGWGFKekZYb0w0NUNqUUk0N2h6TUpMRm9FQmdRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6NjEsImFkdlNlY3JldEtleSI6IitoVHE4bXFmejFJU1BIU1k0dE5pdXdRR2pmWkFkRFdnUUtaYU1FMWJCRms9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbeyJrZXkiOnsicmVtb3RlSmlkIjoiMjU0NzU4NDQzMTExQHMud2hhdHNhcHAubmV0IiwiZnJvbU1lIjp0cnVlLCJpZCI6IkFDRkNGQzU0OUIxODAwQThBOUYyNkFGOUE5M0I2OURDIn0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3NzAwMDAwOTN9LHsia2V5Ijp7InJlbW90ZUppZCI6IjI1NDc1ODQ0MzExMUBzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6dHJ1ZSwiaWQiOiJBQzY1Q0UwQjlDMkY0OUNDOEQ2RUYwQ0E4MzVBRThDQSJ9LCJtZXNzYWdlVGltZXN0YW1wIjoxNzcwMDAwMDk0fV0sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjoyLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJMaU1hc3o0clNWYWE5X05qNDkzOWlBIiwicGhvbmVJZCI6ImM0ZTgwODA2LWEyMmYtNGI4My04NDMzLTRiNjBjOGRhYWMyMiIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJJSkhVNzJxQlJ2WnVtK29vNEhQcHdnVkYxdnM9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiaHJOeWJsQWlrUGJCbXZENzVtQllMclVpcHdJPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IlZaTDQyWDVDIiwibWUiOnsiaWQiOiIyNTQ3NTg0NDMxMTE6ODFAcy53aGF0c2FwcC5uZXQiLCJsaWQiOiIxMTc0ODA4Mjc2NTgyNTA6ODFAbGlkIiwibmFtZSI6IkFsbGVuIn0sImFjY291bnQiOnsiZGV0YWlscyI6IkNKalUwT3NCRU15ZGdNd0dHQVFnQUNnQSIsImFjY291bnRTaWduYXR1cmVLZXkiOiI4Wmk2eEI0NWpwTFpjc0VOYkF2Zko4N1pJak5xM1FEcEloeEM2SHZjUVVBPSIsImFjY291bnRTaWduYXR1cmUiOiJrYzR0bFVuTkZ6S09qQW5IaitBc1duZjRuQ05GbTcxNUhtamlHelREdmtiUDZDd3ZuK2RaNzJWYjNpWmxVVXZGeGJsTmduUTQxbUhNVzJFUXFUcjFEdz09IiwiZGV2aWNlU2lnbmF0dXJlIjoibFd6T3VvMExsOUtIU1VzM1FvY2luRHB0MU9nYU9OdnEra2M5ZDZTemtXM0EzNExYRUdMNEhHUTdBQ0NQamQrc3RVcVJCQ0dYM2RTa2NyU1kxVHN2aHc9PSJ9LCJzaWduYWxJZGVudGl0aWVzIjpbeyJpZGVudGlmaWVyIjp7Im5hbWUiOiIyNTQ3NTg0NDMxMTE6ODFAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCZkdZdXNRZU9ZNlMyWExCRFd3TDN5Zk8yU0l6YXQwQTZTSWNRdWg3M0VGQSJ9fV0sInBsYXRmb3JtIjoiYW5kcm9pZCIsInJvdXRpbmdJbmZvIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQ0FVSURRZ0MifSwibGFzdEFjY291bnRTeW5jVGltZXN0YW1wIjoxNzcwMDAwMDkwLCJsYXN0UHJvcEhhc2giOiIyVjc3cVUiLCJteUFwcFN0YXRlS2V5SWQiOiJBQUFBQUpyNiJ9',
    PREFIXE: process.env.PREFIX || ".",
    OWNER_NAME: process.env.OWNER_NAME || "G̸E̸N̸Z̸K̸E̸N̸Y̸A̸",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "+254758443111",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "no",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    BOT : process.env.BOT_NAME || 'ß.M.ß ƬЄƆĦ',
    URL : process.env.BOT_MENU_LINKS || 'https://files.catbox.moe/8qq3l4.jpg',
    MODE: process.env.PUBLIC_MODE || "yes",
    PM_PERMIT: process.env.PM_PERMIT || 'yes',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_API_KEY : process.env.HEROKU_API_KEY, 
    WARN_COUNT : process.env.WARN_COUNT || '3',
    ETAT : process.env.PRESENCE || 'typing',
    ANTICALL : process.env.ANTICALL || 'yes',   
    AUTO_BIO : process.env.AUTO_BIO || 'no',               
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ANTIDELETE : process.env.ANTIDELETE || 'yes',
    AUTO_REACT : process.env.AUTO_REACT || 'no',
    AUTO_REACT_STATUS : process.env.AUTO_REACT_STATUS || 'yes',
    AUTO_READ : process.env.AUTO_READ || 'no',
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
