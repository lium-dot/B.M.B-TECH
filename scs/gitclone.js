const { bmbtz } = require('../devbmb/bmbtz');
const axios = require('axios');
const fs = require('fs-extra');
const { mediafireDl } = require("../devbmb/dl/Function");
const conf = require(__dirname + "/../settings");

// VCard Contact
const quotedContact = {
  key: {
    fromMe: false,
    participant: `0@s.whatsapp.net`,
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "B.M.B VERIFIED ✅",
      vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:B.M.B VERIFIED ✅\nORG:BMB-TECH BOT;\nTEL;type=CELL;type=VOICE;waid=255767862457:+255767862457\nEND:VCARD"
    }
  }
};

// Newsletter context
const contextInfo = {
  forwardingScore: 999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: "120363382023564830@newsletter",
    newsletterName: "𝙱.𝙼.𝙱-𝚇𝙼𝙳",
    serverMessageId: 1
  }
};

// APK Downloader from BK9
bmbtz({
  nomCom: 'apk2',
  aliases: ['app', 'playstore'],
  reaction: '💯',
  categorie: 'Download'
}, async (groupId, client, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;
  const appName = arg.join(" ");
  if (!appName) return repondre("Please provide an app name.");

  try {
    const searchResponse = await axios.get(`https://bk9.fun/search/apk?q=${appName}`);
    const searchData = searchResponse.data;
    if (!searchData.BK9 || searchData.BK9.length === 0) {
      return repondre("No app found with that name.");
    }

    const appDetailsResponse = await axios.get(`https://ws75.aptoide.com/api/7/apps/search?query=${encodeURIComponent(q)}&limit=1`);
    const appDetails = appDetailsResponse.data;
    if (!appDetails.BK9 || !appDetails.BK9.dllink) {
      return repondre("Failed to get download link.");
    }

    const thumb = appDetails.BK9.thumbnail || conf.URL;

    await client.sendMessage(groupId, {
      document: { url: appDetails.BK9.dllink },
      fileName: `${appDetails.BK9.name}.apk`,
      mimetype: "application/vnd.android.package-archive",
      caption: `📲 Downloaded by ${conf.OWNER_NAME}`,
      contextInfo: {
        ...contextInfo,
        externalAdReply: {
          mediaUrl: thumb,
          mediaType: 1,
          thumbnailUrl: thumb,
          title: "𝗕.𝗠.𝗕-𝗧𝗘𝗖𝗛 APK DOWNLOADER",
          body: appDetails.BK9.name,
          sourceUrl: conf.GURL,
          showAdAttribution: true
        }
      }
    }, { quoted: quotedContact });
  } catch (error) {
    console.error("APK download error:", error);
    repondre("APK download failed.");
  }
});

// GitHub ZIP Downloader
bmbtz({
  nomCom: "gitclone",
  aliases: ["zip", "clone"],
  categorie: "Download"
}, async (dest, zk, context) => {
  const { ms, repondre, arg } = context;
  const githubLink = arg.join(" ");

  if (!githubLink || !githubLink.includes("github.com")) {
    return repondre("Please provide a valid GitHub repository link.");
  }

  let [, owner, repo] = githubLink.match(/(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i) || [];
  if (!owner || !repo) return repondre("Invalid GitHub repo URL.");
  repo = repo.replace(/.git$/, '');

  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/zipball`;

  try {
    const response = await axios.head(apiUrl);
    const fileName = response.headers["content-disposition"].match(/attachment; filename=(.*)/)[1];

    await zk.sendMessage(dest, {
      document: { url: apiUrl },
      fileName: `${fileName}.zip`,
      mimetype: "application/zip",
      caption: `📦 Downloaded by ${conf.BOT}`,
      contextInfo: {
        ...contextInfo,
        externalAdReply: {
          title: `${conf.BOT} GIT CLONE`,
          body: conf.OWNER_NAME,
          thumbnailUrl: conf.URL,
          sourceUrl: conf.GURL,
          mediaType: 1,
          showAdAttribution: true
        }
      }
    }, { quoted: quotedContact });
  } catch (error) {
    console.error("GitHub zip error:", error);
    repondre("Failed to fetch GitHub repository.");
  }
});
