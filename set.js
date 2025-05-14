const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoic0NiV3hvRHZrMCsrK2l1RTV3bDRxNUtFaUo1WFNCL0k5aFRjWEg3UmwzMD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiT3JtNEFtK1IraGhaZm83RHV3RzNKWkxtQk84TWVsdUhCWkFDQXVzb0RGRT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJFRlM5Y2g1WXRaRHp2amw3cXlGZWJSeDJlSlVVbzMyeC9UYUpnbVoyKzFFPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJLVmswY3hab3JRblVaMjVHdHpnQ3JFdW9yU0RZR094SXpleFVNbmRzZEFZPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkFGT3ZWYzE4SnFYa2RlM2paS1RxWWV1SW9EZDMxOERPeEk0c2NKRktJazg9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlptVzVZZ0V4Y0N1eXRwR056NVg5SGZEM3hra3BsWXlJR3RRMDlSTWZYa3M9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiRUdJTWJwaktIc2Z4b1NSWkJBRFVBYkdPaVRIUFNZNnRiQm55VzQ3SEpFUT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiTEVCTStpbmkzV3hYR21oaUpWaHp3bzVQRVBEbzI4NkM0T2x2NXB1MlZuST0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ill0SmthN2pncUtHL2NwVXk4TzFiN2hvTkduWFQvNlBsYlM4Yk1nQmZQVTVsSzJoZ3pXU1pkSjJQMFFmdWwzbWJwVnhBZ3N1UDBrcFRvWXdySGpnUmpnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjAyLCJhZHZTZWNyZXRLZXkiOiJ0N0dycURSYXhqajd5RkdFNTZHRjUyOVhVR0djQ25RL1l4eHRoMmpqM2YwPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W3sia2V5Ijp7InJlbW90ZUppZCI6IjI1NDc3ODYyMDk2MUBzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6dHJ1ZSwiaWQiOiI4Mzc5QzAzODIyOEFENEJBNUIzQ0QwRDI0NTRENzIzRCJ9LCJtZXNzYWdlVGltZXN0YW1wIjoxNzQ3MjAzMzUwfSx7ImtleSI6eyJyZW1vdGVKaWQiOiIyNTQ3Nzg2MjA5NjFAcy53aGF0c2FwcC5uZXQiLCJmcm9tTWUiOnRydWUsImlkIjoiRDFBMzc1MUY4MjUwMDZGNTZGNkE0NEQ1OUI3RTc4OEIifSwibWVzc2FnZVRpbWVzdGFtcCI6MTc0NzIwMzM1MX0seyJrZXkiOnsicmVtb3RlSmlkIjoiMjU0Nzc4NjIwOTYxQHMud2hhdHNhcHAubmV0IiwiZnJvbU1lIjp0cnVlLCJpZCI6Ijg4QUQwNzMxNEJCQ0JCQkZCRjg4OTU5MzYzMzBERDYzIn0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3NDcyMDMzNjF9XSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjEsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJkZXZpY2VJZCI6IjIzT3NJcDVLUW0tampDVnV3enhVSXciLCJwaG9uZUlkIjoiNWExMWQ0ZDQtZWEwOS00MWYyLWI3MDktZTM4NGU1NGYzMDMwIiwiaWRlbnRpdHlJZCI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkF1Sll2VUYwOWI1NEh3UVAxOG9sOGFoWExoTT0ifSwicmVnaXN0ZXJlZCI6dHJ1ZSwiYmFja3VwVG9rZW4iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI2alpmS1V3ZDl1dThaWDlRYlN0WmQrRGllK2s9In0sInJlZ2lzdHJhdGlvbiI6e30sInBhaXJpbmdDb2RlIjoiOThMNzNESjQiLCJtZSI6eyJpZCI6IjI1NDc3ODYyMDk2MToxNkBzLndoYXRzYXBwLm5ldCIsIm5hbWUiOiLimIXhjq/imLzvuI7ihJLimLzvuI7ihJLinKnihLDinKvihJXimasifSwiYWNjb3VudCI6eyJkZXRhaWxzIjoiQ0lPSnYvUUZFSWpxa01FR0dBUWdBQ2dBIiwiYWNjb3VudFNpZ25hdHVyZUtleSI6IkJkd2pldUpqTG9tQm81QmovOU02Tm5LdzQvazlma0tCMTNXNURvYXZpbDg9IiwiYWNjb3VudFNpZ25hdHVyZSI6IkdlV3c1aFh2dW02K1RNaEt5WER5eGJxMGFRZzZ0OVhRb2hIWGFmNUlnaDRxZWRpanRwaGN3OExGeldGS0pHK2VpVDVrdm9XNG5xdm84eFduTkxUbkFRPT0iLCJkZXZpY2VTaWduYXR1cmUiOiJUWDRWVU0xV1hlTmVoaEJ5NnN3Z0QwQzZ4NndUa0IvOFdEekxjOWJWd1ZSUER0MHlhTWwxYmE0NFdHdWFnbnlCeVpzcGh3V01sbWMvb2VFdVRmVTdqdz09In0sInNpZ25hbElkZW50aXRpZXMiOlt7ImlkZW50aWZpZXIiOnsibmFtZSI6IjI1NDc3ODYyMDk2MToxNkBzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJRWGNJM3JpWXk2SmdhT1FZLy9UT2paeXNPUDVQWDVDZ2RkMXVRNkdyNHBmIn19XSwicGxhdGZvcm0iOiJhbmRyb2lkIiwibGFzdEFjY291bnRTeW5jVGltZXN0YW1wIjoxNzQ3MjAzMzQ4LCJteUFwcFN0YXRlS2V5SWQiOiJBQUFBQUlsOCJ9',
    PREFIXE: process.env.PREFIX || ".",
    OWNER_NAME: process.env.OWNER_NAME || "✞︎★Ꭿ☼︎ℒ☼︎ℒ✩ℰ✫ℕ♫☠︎︎",
    NUMERO_OWNER : process.env.NUMERO_OWNER || " 𝙱.𝙼.𝙱-𝚇𝙼𝙳 ke",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "no",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    BOT : process.env.BOT_NAME || 'B.M.B-TECH',
    URL : process.env.BOT_MENU_LINKS || 'https://i.ibb.co/S4xJ3MBz/file-1361.jpg',
    MODE: process.env.PUBLIC_MODE || "no",
    PM_PERMIT: process.env.PM_PERMIT || 'yes',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || 'typing',
    ANTICALL : process.env.ANTICALL || 'yes',   
    AUTO_BIO : process.env.AUTO_BIO || 'no',               
    DP : process.env.STARTING_BOT_MESSAGE || "no",
    ANTIDELETE1 : process.env.ANTI_DELETE_MESSAGE || 'no',
    AUTO_REACT : process.env.AUTO_REACT || 'no',
    AUTO_REACT : process.env.AUTO_REACT || 'no',              
    AUTO_REACT_STATUS : process.env.AUTO_REACT_STATUS || 'yes',
    AUTO_READ : process.env.AUTO_READ || 'yes',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway" : "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway",
   
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});

