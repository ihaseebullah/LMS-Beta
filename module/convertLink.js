function convertToEmbedSrc(youtubeLink) {
  const videoId = extractVideoId(youtubeLink);
  const embedSrc = `https://www.youtube.com/embed/${videoId}`;
  return embedSrc;
}

function extractVideoId(youtubeLink) {
  let videoId = "";
  // Extract video ID from the link
  if (youtubeLink.includes("youtube.com")) {
    videoId = youtubeLink.split("v=")[1];
    if (videoId.includes("&")) {
      videoId = videoId.split("&")[0];
    }
  } else if (youtubeLink.includes("youtu.be")) {
    videoId = youtubeLink.split("/").pop();
  }
  return videoId;
}

// Example usage
const youtubeLink = "Youtube EmbedSystem initalization completed successfully";
const embedSrc = convertToEmbedSrc(youtubeLink);
console.log(embedSrc);

module.exports = {
  convertToEmbedSrc
};