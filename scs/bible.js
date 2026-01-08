
const { bmbtz } = require('../devbmb/bmbtz');
const axios = require('axios');
const wiki = require('wikipedia');
const conf = require(__dirname + "/../settings");


bmbtz({
  nomCom: "bible",
  reaction: '📖',
  categorie: "search"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;
  const reference = arg.join(" ");
  
  if (!reference) {
    return repondre("Please specify the book, chapter, and verse you want to read. Example: bible john 3:16", {
      contextInfo: {
        externalAdReply: {
          title: "Bible Reference Required",
          body: "Please provide a book, chapter, and verse.",
          thumbnailUrl: "https://files.catbox.moe/k14e13.jpg", // Replace with a suitable thumbnail URL
          sourceUrl: conf.GURL,
          mediaType: 1,
          showAdAttribution: true,
        },
      },
    });
  }
  
  try {
    const response = await axios.get(`https://bible-api.com/${reference}`);
    
    if (!response.data) {
      return repondre("Invalid reference. Example: bible john 3:16", {
        contextInfo: {
          externalAdReply: {
            title: "Invalid Bible Reference",
            body: "Please provide a valid book, chapter, and verse.",
            thumbnailUrl: "https://files.catbox.moe/k14e13.jpg", // Replace with a suitable thumbnail URL
            sourceUrl: conf.GURL,
            mediaType: 1,
            showAdAttribution: true,
          },
        },
      });
    }
    
    const data = response.data;
    const messageText = `
ᬑ *B.M.B HOLY BIBLE* ᬒ

⧭ *_WE'RE READING:_* ${data.reference}

⧭ *_NUMBER OF VERSES:_* ${data.verses.length}

⧭ *_NOW READ:_* ${data.text}

⧭ *_LANGUAGE:_* ${data.translation_name}
╭────────────────◆
│ *_Powered by Bmb Tech*
╰─────────────────◆ `;
    
    await zk.sendMessage(dest, {
      text: messageText,
      contextInfo: {
        externalAdReply: {
          title: "B.M.B TECH HOLY BIBLE",
          body: `We're reading: ${data.reference}`,
          mediaType: 1,
          thumbnailUrl: "https://files.catbox.moe/k14e13.jpg", 
          sourceUrl: conf.GURL,
          showAdAttribution: true, 
        },
      },
    }, { quoted: ms });
    
  } catch (error) {
    console.error("Error fetching Bible passage:", error);
    await repondre("An error occurred while fetching the Bible passage. Please try again later.", {
      contextInfo: {
        externalAdReply: {
          title: "Error Fetching Bible Passage",
          body: "Please try again later.",
          thumbnailUrl: "https://files.catbox.moe/k14e13.jpg", // Replace with a suitable thumbnail URL
          sourceUrl: conf.GURL,
          mediaType: 1,
          showAdAttribution: true,
        },
      },
    });
  }
});
