const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoia0xVcWpzcXEwbWkzM3VHMENCYWtrNVU1aGZTQjdOZXFVcGorNWh3dm9YUT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoieHZTMTd5Uk1yaTh1bkxwTU03eTlhWmVvUndwZGxZa2h5RFZEU25jd0syMD0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJNRWRwTUhPbGJOZnZaU0hMK0k2M3VERXBqZ0huRk8yQks1QitYcmdNbUZFPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI2a1dqTEJPb3ZJQkI2Ukp4TTdSQnFLY3BHS0tkUVUvZVNNU1JRSmxXaDM0PSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkVNTiswQnpPWTVCVitDRmZQV3ByWDdGcnlmYkkyS0xVQ3NsbTZMMzdLbGM9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IisyelRoYlpOemRoNTVoVkxJTWJXbGdkaWdEaCthZFlaWGZGQ0ZhS0FqRHc9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNEhlRms3NDcraWt0T1hsZUFwSElEdFFrQUhDV1krQjVLYzRvQ1FlUWQzWT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoieUNadUpYZ1dVd2VqY2V6UzB3elJGdk1XNUc3Y1VObW05czVpa1lRQWswMD0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlVOVG5BamlLUXdMQitNRXJmQXAxS3IrUjFTMi9zcFN6VXA0eURUMForbjdkMmxMNUNJRE5kL1QxZVhsa2hGTmhILzFOdURqQlRvd3FqNm5lMWZSV0FRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTc5LCJhZHZTZWNyZXRLZXkiOiJvYk85UW9oSm5UT1RIdTRHS09rdXp3b1p1QTZNa1ozUGUrVU5yOUtsM3NnPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W3sia2V5Ijp7InJlbW90ZUppZCI6IjI1NDc1ODQ0MzExMUBzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6dHJ1ZSwiaWQiOiI2OTI2NDk5NzdENkY2QUFBNEE4ODExM0Y4MTQ2NERCQSJ9LCJtZXNzYWdlVGltZXN0YW1wIjoxNzQ3MjA4ODQ1fSx7ImtleSI6eyJyZW1vdGVKaWQiOiIyNTQ3NTg0NDMxMTFAcy53aGF0c2FwcC5uZXQiLCJmcm9tTWUiOnRydWUsImlkIjoiM0NDQjEwODhCQUE0MjIzRkNCQUI5MkIyQzZGQTgzMkEifSwibWVzc2FnZVRpbWVzdGFtcCI6MTc0NzIwODg0Nn1dLCJuZXh0UHJlS2V5SWQiOjMxLCJmaXJzdFVudXBsb2FkZWRQcmVLZXlJZCI6MzEsImFjY291bnRTeW5jQ291bnRlciI6MSwiYWNjb3VudFNldHRpbmdzIjp7InVuYXJjaGl2ZUNoYXRzIjpmYWxzZX0sImRldmljZUlkIjoiY1diVWtSWHFTaXlOT0VrcHBTaU9FZyIsInBob25lSWQiOiI4NDdjMWEwNC0xOGNmLTRmNDQtYjhjZC1lNjE4ZmU1NzVjYTUiLCJpZGVudGl0eUlkIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiR3NGcHJQbk80eHlKa05vcStIOHRITDJVV0NnPSJ9LCJyZWdpc3RlcmVkIjp0cnVlLCJiYWNrdXBUb2tlbiI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjdFL095U1RQZFN0bk5JbWl5WEdYOE0xeUJvWT0ifSwicmVnaXN0cmF0aW9uIjp7fSwicGFpcmluZ0NvZGUiOiJOMk4xNUpEWSIsIm1lIjp7ImlkIjoiMjU0NzU4NDQzMTExOjg4QHMud2hhdHNhcHAubmV0IiwibmFtZSI6IuKYheGOr+KYvO+4juKEkuKYvO+4juKEkuKcqeKEsOKcq+KEleKZqyJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDTURSOG9rRUVQbVVrY0VHR0FNZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiOFI3QmdLeGJ2T043R25qU1ZYUmNOc0UzQ3pDRmwxaGdtZDU4T0drelJsYz0iLCJhY2NvdW50U2lnbmF0dXJlIjoiV2V4aVJnTEJrZ21sVFU2UmRhM3ZZNVZJZktmUUg3MXlOb0dRemdTSlI3alhqUVhuS3hhQTdyYjNZaG02bEkrUWhtTUg0cHJhdWtBU1FCaFhPVXEwRFE9PSIsImRldmljZVNpZ25hdHVyZSI6ImRrWmVQNzZ2aFdIR2RUTk5vcnBBN3R0eE04SHZIUHpXdGU2TlhwMVcycjhOK3FPY1JFTFc5OUFhUGZ6WHBETHFBN0FMWndtZDRDL3VmMEJRbkw2MUFBPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjU0NzU4NDQzMTExOjg4QHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQmZFZXdZQ3NXN3pqZXhwNDBsVjBYRGJCTndzd2haZFlZSm5lZkRocE0wWlgifX1dLCJwbGF0Zm9ybSI6ImFuZHJvaWQiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3NDcyMDg4MzksIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBTDg3In0=',
    PREFIXE: process.env.PREFIX || ".",
    OWNER_NAME: process.env.OWNER_NAME || "*✞︎★Ꭿ☼︎ℒ☼︎ℒ✩ℰ✫ℕ♫☠︎︎*",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "*✞︎★Ꭿ☼︎ℒ☼︎ℒ✩ℰ✫ℕ♫☠︎︎*,              
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

