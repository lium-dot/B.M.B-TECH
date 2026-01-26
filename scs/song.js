const { bmbtz } = require("../devbmb/bmbtz");
const axios = require('axios');
const ytSearch = require('yt-search');

// VCard Contact kwa quoting
const quotedContact = {
  key: {
    fromMe: false,
    participant: `0@s.whatsapp.net`,
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "B.M.B TECH VERIFIED ✅",
      vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:B.M.B TECH VERIFIED ✅\nORG:BMB-TECH BOT;\nTEL;type=CELL;type=VOICE;waid=254769529791:+254769529791\nEND:VCARD"
    }
  }
};

const newsletterContext = {
  forwardingScore: 999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: "120363382023564830@newsletter",
    newsletterName: "𝙱.𝙼.𝙱-𝚇𝙼𝙳",
    serverMessageId: 1
  }
};

// MP4 VIDEO DOWNLOAD
bmbtz({
  nomCom: "video2",
  aliases: ["video"],
  categorie: "main",
  reaction: "🎥",
}, async (dest, zk, { arg, repondre }) => {
  try {
    if (!arg[0]) return repondre("Please provide a YouTube URL or video name.");
    const query = arg.join(" ");
    const search = await ytSearch(query);
    if (!search.videos.length) return repondre("No results found!");

    const video = search.videos[0];
    const apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(video.url)}`;
    const res = await axios.get(apiUrl);
    const data = res.data;

    if (!data?.success || !data.result?.download_url) return repondre("Failed to fetch the video.");

    const previewCaption = 
`┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 👤 𝗕.𝗠.𝗕-𝗧𝗘𝗖𝗛 VIDEO
┣━━━━━━━━━━━━━━━━━━━━━━━
┃ 📹 Title: ${video.title}
┣━━━━━━━━━━━━━━━━━━━━━━━ 
┃ ⏱️ Duration: ${video.timestamp || 'N/A'}
┣━━━━━━━━━━━━━━━━━━━━━━━
┃ 👁️ Views: ${video.views || 'N/A'}
┣━━━━━━━━━━━━━━━━━━━━━━━
┃ 🔗 Link: ${video.url}
┣━━━━━━━━━━━━━━━━━━━━━━━
┃   by 𝙱.𝙼.𝙱-𝚃𝙴𝙲𝙷 📺
┗━━━━━━━━━━━━━━━━━━━━━━━┛`;

    await zk.sendMessage(dest, {
      image: { url: `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg` },
      caption: previewCaption,
      contextInfo: newsletterContext
    }, { quoted: quotedContact });

    await zk.sendMessage(dest, {
      video: { url: data.result.download_url },
      caption: `Here is your video: ${video.title}`,
      mimetype: "video/mp4",
      contextInfo: newsletterContext
    }, { quoted: quotedContact });

  } catch (e) {
    console.error(e);
    repondre("An error occurred. Please try again later.");
  }
});

// MP3 SONG DOWNLOAD
bmbtz({
  nomCom: "play2",
  aliases: ["song", "mp3"],
  categorie: "main",
  reaction: "🎶",
}, async (dest, zk, { arg, repondre }) => {
  try {
    if (!arg[0]) return repondre("Please provide a song name or YouTube link.");
    const query = arg.join(" ");
    const search = await ytSearch(query);
    if (!search.videos.length) return repondre("No results found!");

    const song = search.videos[0];
    const apiUrl = `https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(song.url)}`;
    const res = await axios.get(apiUrl);
    const data = res.data;

    if (!data?.result?.downloadUrl) return repondre("Download failed. Try again later.");

    const previewCaption = 
`┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 👤 𝗕.𝗠.𝗕-𝗧𝗘𝗖𝗛 SONG
┣━━━━━━━━━━━━━━━━━━━━━━━
┃ 🎵 Title: ${song.title}
┣━━━━━━━━━━━━━━━━━━━━━━━ 
┃ ⏱️ Duration: ${song.timestamp || 'N/A'}
┣━━━━━━━━━━━━━━━━━━━━━━━
┃ 👁️ Views: ${song.views || 'N/A'}
┣━━━━━━━━━━━━━━━━━━━━━━━
┃ 🔗 Link: ${song.url}
┣━━━━━━━━━━━━━━━━━━━━━━━
┃   by  𝙱.𝙼.𝙱-𝚃𝙴𝙲𝙷 🎵
┗━━━━━━━━━━━━━━━━━━━━━━━┛`;

    await zk.sendMessage(dest, {
      image: { url: `https://i.ytimg.com/vi/${song.videoId}/hqdefault.jpg` },
      caption: previewCaption,
      contextInfo: newsletterContext
    }, { quoted: quotedContact });

    await zk.sendMessage(dest, {
      audio: { url: data.result.downloadUrl },
      mimetype: "audio/mpeg",
      fileName: `${song.title}.mp3`,
      contextInfo: newsletterContext
    }, { quoted: quotedContact });

  } catch (error) {
    console.error(error);
    repondre("An error occurred. Please try again.");
  }
});
      
