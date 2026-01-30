const { bmbtz } = require('../devbmb/bmbtz');
const axios = require('axios');
const fs = require('fs-extra');
const { sendMessage, repondre } = require(__dirname + "/../devbmb/context");
const { igdl } = require('ruhend-scraper');
const conf = require(__dirname + "/../settings");
const getFBInfo = require("@xaviabot/fb-downloader");

// Context info function (cleaned)
function commonContextInfo() {
  try {
    return {
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363382023564830@newsletter",
        newsletterName: "Bmb Tech Updates",
        serverMessageId: Math.floor(100000 + Math.random() * 900000),
      },
    };
  } catch (error) {
    console.error(`Error in commonContextInfo: ${error.message}`);
    return {};
  }
}

function formatViews(views) {
  if (typeof views === 'number') {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + 'M';
    } else if (views >= 1000) {
      return (views / 1000).toFixed(1) + 'K';
    }
    return views.toString();
  }
  return views;
}

// TWITTER
    bmbtz({
      nomCom: "twitter",
      aliases: ["twitdl", "twitterdl", "tw", "xdl"],
      categorie: "Download",
      reaction: "🐦"
    }, async (dest, zk, commandeOptions) => {
      const { ms, arg } = commandeOptions;
    
      if (!arg || !arg[0]) {
        return repondre(zk, dest, ms, 'Please provide a Twitter video URL!');
      }
    
      const tweetUrl = arg[0].trim();
      if (!tweetUrl.includes('https://') || !tweetUrl.includes('twitter.com')) {
        return repondre(zk, dest, ms, "Please provide a valid Twitter URL.");
      }
    
      try {
        const apiUrl = `https://apis-keith.vercel.app/download/twitter?url=${encodeURIComponent(tweetUrl)}`;
        const response = await axios.get(apiUrl);
        const tweetData = response.data;
    
        if (!tweetData.status || !tweetData.result) {
          return repondre(zk, dest, ms, "Could not retrieve video information. The tweet may be private or not contain media.");
        }
    
        const videoInfo = tweetData.result;
    
        const caption = `
         *${conf.BOT || 'Twitter Downloader'} twitter Downloader*
        |__________________________|
        |       *ᴅᴇsᴄʀɪᴘᴛɪᴏɴ*  
        ${videoInfo.desc || 'No description available'}
        |_________________________|
        | REPLY WITH BELOW NUMBERS
        |_________________________|
        |____  *ᴠɪᴅᴇᴏ ᴅᴏᴡɴʟᴏᴀᴅ*  ____
        |-᳆  1. SD Quality (480p)
        |-᳆  2. HD Quality (720p)
        |_________________________|
        |____  *ᴀᴜᴅɪᴏ ᴅᴏᴡɴʟᴏᴀᴅ*  ____
        |-᳆  3. Audio Only
        |-᳆  4. As Document
        |__________________________|
        `;
    
        const message = await zk.sendMessage(dest, {
          image: { url: videoInfo.thumb || '' },
          caption: caption,
          contextInfo: commonContextInfo()
        }, { quoted: ms });
    
        const messageId = message.key.id;
    
        const replyHandler = async (update) => {
          try {
            const messageContent = update.messages[0];
            if (!messageContent.message) return;
    
            const isReply = messageContent.message.extendedTextMessage?.contextInfo?.stanzaId === messageId;
            if (!isReply) return;
    
            const responseText = messageContent.message.conversation ||
              messageContent.message.extendedTextMessage?.text;
    
            if (!['1', '2', '3', '4'].includes(responseText)) {
              return await zk.sendMessage(dest, {
                text: "Invalid option. Please reply with a number between 1-4.",
                quoted: messageContent,
                contextInfo: commonContextInfo()
              });
            }
    
            await zk.sendMessage(dest, {
              react: { text: '⬇️', key: messageContent.key },
            });
    
            switch (responseText) {
              case '1':
                await zk.sendMessage(dest, {
                  video: { url: videoInfo.video_sd },
                  caption: `*${conf.BOT || 'Twitter Downloader'}* - SD Quality`,
                  contextInfo: commonContextInfo()
                }, { quoted: messageContent });
                break;
    
              case '2':
                if (videoInfo.video_hd) {
                  await zk.sendMessage(dest, {
                    video: { url: videoInfo.video_hd },
                    caption: `*${conf.BOT || 'Twitter Downloader'}* - HD Quality`,
                    contextInfo: commonContextInfo()
                  }, { quoted: messageContent });
                } else {
                  await zk.sendMessage(dest, {
                    text: "HD quality not available. Sending SD quality instead.",
                    quoted: messageContent,
                    contextInfo: commonContextInfo()
                  });
                  await zk.sendMessage(dest, {
                    video: { url: videoInfo.video_sd },
                    caption: `*${conf.BOT || 'Twitter Downloader'}* - SD Quality`,
                    contextInfo: commonContextInfo()
                  }, { quoted: messageContent });
                }
                break;
    
              case '3':
                await zk.sendMessage(dest, {
                  audio: { url: videoInfo.audio },
                  mimetype: "audio/mpeg",
                  caption: `*${conf.BOT || 'Twitter Downloader'}* - Audio`,
                  contextInfo: commonContextInfo()
                }, { quoted: messageContent });
                break;
    
              case '4':
                await zk.sendMessage(dest, {
                  document: { url: videoInfo.video_sd },
                  mimetype: "video/mp4",
                  fileName: `${conf.BOT || 'Twitter'}_${Date.now()}.mp4`,
                  caption: `*${conf.BOT || 'Twitter Downloader'}* - Video Document`,
                  contextInfo: commonContextInfo()
                }, { quoted: messageContent });
                break;
            }
    
            await zk.sendMessage(dest, {
              react: { text: '✅', key: messageContent.key },
            });
    
          } catch (error) {
            console.error("Error handling reply:", error);
            await zk.sendMessage(dest, {
              text: "An error occurred while processing your request. Please try again.",
              quoted: update.messages[0],
              contextInfo: commonContextInfo()
            });
          }
        };
    
        zk.ev.on("messages.upsert", replyHandler);
        setTimeout(() => {
          zk.ev.off("messages.upsert", replyHandler);
        }, 300000);
    
      } catch (error) {
        console.error("Twitter download error:", error);
        repondre(zk, dest, ms, `Failed to download tweet. Error: ${error.message}\nYou can try with another link or check if the tweet is public.`);
      }
    });
    
    // INSTAGRAM
    bmbtz({
      nomCom: "instagram",
      aliases: ["igdl", "insta", "ig"],
      categorie: "Download",
      reaction: "📸"
    }, async (dest, zk, commandeOptions) => {
      const { ms, arg } = commandeOptions;
    
      if (!arg || !arg[0]) {
        return repondre(zk, dest, ms, 'Please provide an Instagram URL!');
      }
    
      const igUrl = arg[0].trim();
      if (!igUrl.includes('https://') || !igUrl.includes('instagram.com')) {
        return repondre(zk, dest, ms, "Please provide a valid Instagram URL.");
      }
    
      try {
        const apiUrl = `https://apis-keith.vercel.app/download/instagramdl?url=${encodeURIComponent(igUrl)}`;
        const response = await axios.get(apiUrl);
        const data = response.data;
    
        if (!data.status || !data.result || !data.result.downloadUrl) {
          return repondre(zk, dest, ms, "Could not retrieve video. The post may be private or unavailable.");
        }
    
        const downloadUrl = data.result.downloadUrl;
        const isVideo = data.result.type === 'mp4';
    
        const caption = `
         *${conf.BOT || 'Instagram Downloader'} Instagram Downloader*
        |__________________________|
        | Media Type: ${isVideo ? 'Video' : 'Unknown'}
        |_________________________|
        | REPLY WITH BELOW NUMBERS
        |_________________________|
        |-᳆  1. Video
        |-᳆  2. Video as Document
        |-᳆  3. Audio Only
        |-᳆  4. Audio as Document
        |__________________________|
        `;
    
        const message = await zk.sendMessage(dest, {
          image: { url: conf.URL || '' },
          caption: caption,
          contextInfo: commonContextInfo()
        }, { quoted: ms });
    
        const messageId = message.key.id;
    
        const replyHandler = async (update) => {
          try {
            const messageContent = update.messages[0];
            if (!messageContent.message) return;
    
            const isReply = messageContent.message.extendedTextMessage?.contextInfo?.stanzaId === messageId;
            if (!isReply) return;
    
            const responseText = messageContent.message.conversation ||
              messageContent.message.extendedTextMessage?.text;
    
            if (!['1', '2', '3', '4'].includes(responseText)) {
              return await zk.sendMessage(dest, {
                text: "Invalid option. Please reply with a number between 1-4.",
                quoted: messageContent,
                contextInfo: commonContextInfo()
              });
            }
    
            await zk.sendMessage(dest, {
              react: { text: '⬇️', key: messageContent.key },
            });
    
            switch (responseText) {
              case '1':
                await zk.sendMessage(dest, {
                  video: { url: downloadUrl },
                  caption: `*${conf.BOT || 'Instagram Downloader'}* - Video`,
                  contextInfo: commonContextInfo()
                }, { quoted: messageContent });
                break;
    
              case '2':
                await zk.sendMessage(dest, {
                  document: { url: downloadUrl },
                  mimetype: "video/mp4",
                  fileName: `${conf.BOT || 'Instagram'}_${Date.now()}.mp4`,
                  caption: `*${conf.BOT || 'Instagram Downloader'}* - Video Document`,
                  contextInfo: commonContextInfo()
                }, { quoted: messageContent });
                break;
    
              case '3':
                await zk.sendMessage(dest, {
                  audio: { url: downloadUrl },
                  mimetype: "audio/mpeg",
                  caption: `*${conf.BOT || 'Instagram Downloader'}* - Audio`,
                  contextInfo: commonContextInfo()
                }, { quoted: messageContent });
                break;
    
              case '4':
                await zk.sendMessage(dest, {
                  document: { url: downloadUrl },
                  mimetype: "audio/mpeg",
                  fileName: `${conf.BOT || 'Instagram'}_${Date.now()}.mp3`,
                  caption: `*${conf.BOT || 'Instagram Downloader'}* - Audio Document`,
                  contextInfo: commonContextInfo()
                }, { quoted: messageContent });
                break;
            }
    
            await zk.sendMessage(dest, {
              react: { text: '✅', key: messageContent.key },
            });
    
          } catch (error) {
            console.error("Error handling reply:", error);
            await zk.sendMessage(dest, {
              text: "An error occurred while processing your request. Please try again.",
              quoted: update.messages[0],
              contextInfo: commonContextInfo()
            });
          }
        };
    
        zk.ev.on("messages.upsert", replyHandler);
        setTimeout(() => {
          zk.ev.off("messages.upsert", replyHandler);
        }, 300000);
    
      } catch (error) {
        console.error("Instagram download error:", error);
        repondre(zk, dest, ms, `Failed to download Instagram media. Error: ${error.message}\nYou can try with another link or check if the post is public.`);
      }
    });
    
    // TIKTOK
    bmbtz({
      nomCom: "tiktok",
      aliases: ["ttdl", "tiktokdl", "tt"],
      categorie: "Download",
      reaction: "🎵"
    }, async (dest, zk, commandeOptions) => {
      const { ms, arg } = commandeOptions;
    
      if (!arg || !arg[0]) {
        return repondre(zk, dest, ms, 'Please provide a TikTok URL!');
      }
    
      const tiktokUrl = arg[0].trim();
      if (!tiktokUrl.includes('https://') || !(tiktokUrl.includes('tiktok.com') || tiktokUrl.includes('vt.tiktok.com'))) {
        return repondre(zk, dest, ms, "Please provide a valid TikTok URL.");
      }
    
      try {
        const apiUrl = `https://apis-keith.vercel.app/download/tiktokdl?url=${encodeURIComponent(tiktokUrl)}`;
        const response = await axios.get(apiUrl);
        const data = response.data;
    
        if (!data.status || !data.result) {
          return repondre(zk, dest, ms, "Could not retrieve video. The TikTok may be private or unavailable.");
        }
    
        const videoInfo = data.result;
    
        const caption = `
         *${conf.BOT || 'TikTok Downloader'} TikTok Downloader*
        |__________________________|
        | *Title*: ${videoInfo.title || 'No title'}
        | *Caption*: ${videoInfo.caption || 'No caption'}
        |_________________________|
        | REPLY WITH BELOW NUMBERS
        |_________________________|
        |-᳆  1. Video (No Watermark)
        |-᳆  2. Video as Document
        |-᳆  3. Audio Only
        |-᳆  4. Audio as Document
        |__________________________|
        `;
    
        const message = await zk.sendMessage(dest, {
          image: { url: videoInfo.thumbnail || conf.URL || '' },
          caption: caption,
          contextInfo: commonContextInfo()
        }, { quoted: ms });
    
        const messageId = message.key.id;
    
        const replyHandler = async (update) => {
          try {
            const messageContent = update.messages[0];
            if (!messageContent.message) return;
    
            const isReply = messageContent.message.extendedTextMessage?.contextInfo?.stanzaId === messageId;
            if (!isReply) return;
    
            const responseText = messageContent.message.conversation ||
              messageContent.message.extendedTextMessage?.text;
    
            if (!['1', '2', '3', '4'].includes(responseText)) {
              return await zk.sendMessage(dest, {
                text: "Invalid option. Please reply with a number between 1-4.",
                quoted: messageContent,
                contextInfo: commonContextInfo()
              });
            }
    
            await zk.sendMessage(dest, {
              react: { text: '⬇️', key: messageContent.key },
            });
    
            switch (responseText) {
              case '1':
                await zk.sendMessage(dest, {
                  video: { url: videoInfo.nowm },
                  caption: `*${conf.BOT || 'TikTok Downloader'}* - Video (No Watermark)\n${videoInfo.caption || ''}`,
                  contextInfo: commonContextInfo()
                }, { quoted: messageContent });
                break;
    
              case '2':
                await zk.sendMessage(dest, {
                  document: { url: videoInfo.nowm },
                  mimetype: "video/mp4",
                  fileName: `${conf.BOT || 'TikTok'}_${Date.now()}.mp4`,
                  caption: `*${conf.BOT || 'TikTok Downloader'}* - Video Document\n${videoInfo.caption || ''}`,
                  contextInfo: commonContextInfo()
                }, { quoted: messageContent });
                break;
    
              case '3':
                await zk.sendMessage(dest, {
                  audio: { url: videoInfo.mp3 },
                  mimetype: "audio/mpeg",
                  caption: `*${conf.BOT || 'TikTok Downloader'}* - Audio\n${videoInfo.caption || ''}`,
                  contextInfo: commonContextInfo()
                }, { quoted: messageContent });
                break;
    
              case '4':
                await zk.sendMessage(dest, {
                  document: { url: videoInfo.mp3 },
                  mimetype: "audio/mpeg",
                  fileName: `${conf.BOT || 'TikTok'}_${Date.now()}.mp3`,
                  caption: `*${conf.BOT || 'TikTok Downloader'}* - Audio Document\n${videoInfo.caption || ''}`,
                  contextInfo: commonContextInfo()
                }, { quoted: messageContent });
                break;
            }
    
            await zk.sendMessage(dest, {
              react: { text: '✅', key: messageContent.key },
            });
    
          } catch (error) {
            console.error("Error handling reply:", error);
            await zk.sendMessage(dest, {
              text: "An error occurred while processing your request. Please try again.",
              quoted: update.messages[0],
              contextInfo: commonContextInfo()
            });
          }
        };
    
        zk.ev.on("messages.upsert", replyHandler);
        setTimeout(() => {
          zk.ev.off("messages.upsert", replyHandler);
        }, 300000);
    
      } catch (error) {
        console.error("TikTok download error:", error);
        repondre(zk, dest, ms, `Failed to download TikTok. Error: ${error.message}\nYou can try with another link or check if the video is public.`);
      }
    });
