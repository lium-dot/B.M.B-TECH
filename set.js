const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiK0hqdDdzcStPdlJIT1BhS1BYdjAwekttRFNPWVYrVFk0VjdWQzh2aFgxdz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQmFGZkZ3TnluOHhhaGd1MWFxeGI4RlJDYkRvZng5VWppc055Q1BVak9GWT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIyRloyRTQwTVM2OWdYR09WY29Kb2dhTStTdjArSUU2c3hGYlM3czJGeDFvPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJEczJDN0N0QkR4VngxcUp3NFgzcVdqUS9QWW9XUnRPZ0VyOGJXZCtncVV3PSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjBFSVdtUnpFMmc3UnRBalF3eTcxZFgrVTBQWVl3VldOMGZVZ2UxUm5hVTQ9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ik5WZmpjcmtIY1FXZmE3NkdJM2lkdnNEOGZiZzcyaGtWeU84c2VFQTV5bnc9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiWUgxRURiY251Z3JoSnpYck5mM1dNV1VNME9ONTFhc0FYVTJsTDJXMzRVbz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNE9EakoyRHF3b0RML1d4dTEvNlNBcWN3d1NaZkMwNkRydWIydEtnYWp5OD0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InpUMENsaHg4aHFvSFBWem9rNnZRd2x1M2FTSGhEYkFQUW9RRUxJTE9HT1NFUG54dHk0YmNmdk5yeC9hM2dLZDhmMG8rUTBuazNkdzZrMXU2YVl2YkJRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6OSwiYWR2U2VjcmV0S2V5IjoicDN2bnlIVGR1V1R6UGZLb3BhZWFMT2VjY1F6R055UmVUeW5ZVEpDYTBUMD0iLCJwcm9jZXNzZWRIaXN0b3J5TWVzc2FnZXMiOlt7ImtleSI6eyJyZW1vdGVKaWQiOiIyNTQ3NTg0NDMxMTFAcy53aGF0c2FwcC5uZXQiLCJmcm9tTWUiOnRydWUsImlkIjoiNTU5MkZGQUFFRjk3QjRDRkJBNDZFNjAxQTk5QTIwQjEifSwibWVzc2FnZVRpbWVzdGFtcCI6MTc0Nzg5MjQwMn0seyJrZXkiOnsicmVtb3RlSmlkIjoiMjU0NzU4NDQzMTExQHMud2hhdHNhcHAubmV0IiwiZnJvbU1lIjp0cnVlLCJpZCI6IkZEMjcwMDBDNjMxQTgzMkE0NjAzMjNCM0IzMkQzMzI2In0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3NDc4OTI0MDN9XSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjEsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJyZWdpc3RlcmVkIjp0cnVlLCJwYWlyaW5nQ29kZSI6IjI2MlFRVEVDIiwibWUiOnsiaWQiOiIyNTQ3NTg0NDMxMTE6MTFAcy53aGF0c2FwcC5uZXQiLCJsaWQiOiIxMTc0ODA4Mjc2NTgyNTA6MTFAbGlkIiwibmFtZSI6IuKcnu+4juKYheGOr+KYvO+4juKEkuKYvO+4juKEkuKcqeKEsOKcq+KEleKZq+KYoO+4ju+4jiJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDTUxSOG9rRUVLSHh1c0VHR0FFZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiOFI3QmdLeGJ2T043R25qU1ZYUmNOc0UzQ3pDRmwxaGdtZDU4T0drelJsYz0iLCJhY2NvdW50U2lnbmF0dXJlIjoiVmpYUXpTK1hoOWppbGZneisyS3V4MUx6TTNjQ0p3dURUWjYvbVVUNTZna3VkSnJzbDY2NDVaNDRLdDVTYVhZMVNQRnF6V0ErYnFHdlpQUElPTUhtRGc9PSIsImRldmljZVNpZ25hdHVyZSI6ImNwc3NMRnRrYlRzZ3hoRGZ2eWFtZll6NVhRQWdDeGNSUFo1YmpydmZUa3JrR1RwQURVVDBiZHJoNm9DZWt2aGlnRWpoUTJaOW9XZnJWRFdlekh2S0JRPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjU0NzU4NDQzMTExOjExQHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQmZFZXdZQ3NXN3pqZXhwNDBsVjBYRGJCTndzd2haZFlZSm5lZkRocE0wWlgifX1dLCJwbGF0Zm9ybSI6ImFuZHJvaWQiLCJyb3V0aW5nSW5mbyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkNBVUlFZz09In0sImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTc0Nzg5MjM5OCwibGFzdFByb3BIYXNoIjoiMlY3N3FVIiwibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFMOWQifQ==',
    PREFIXE: process.env.PREFIX || "*",
    OWNER_NAME: process.env.OWNER_NAME || "MR ΛĿĿƐИ",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "✞︎★Ꭿ☼︎ℒ☼︎ℒ✩ℰ✫ℕ♫☠︎︎ ke",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "no",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    BOT : process.env.BOT_NAME || 'B.M.B-TECH',
    URL : process.env.BOT_MENU_LINKS || 'https://files.catbox.moe/hvi870.jpg',
    MODE: process.env.PUBLIC_MODE || "no",
    PM_PERMIT: process.env.PM_PERMIT || 'no',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || '',
    ANTICALL : process.env.ANTICALL || 'yes',   
    AUTO_BIO : process.env.AUTO_BIO || 'no',               
    DP : process.env.STARTING_BOT_MESSAGE || "no",
    ANTIDELETE1 : process.env.ANTI_DELETE_MESSAGE || 'no',
    AUTO_REACT : process.env.AUTO_REACT || 'no',
    AUTO_REACT : process.env.AUTO_REACT || 'no',              
    AUTO_REACT_STATUS : process.env.AUTO_REACT_STATUS || 'yes',
    AUTO_READ : process.env.AUTO_READ || 'no',
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

