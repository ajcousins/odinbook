const removeDuplicates = (tweets) => {
  // Removes subsequent duplicates.
  const tweetsCopy = [...tweets];

  const cache = [];
  const filtered = tweetsCopy.filter((tweet) => {
    if (tweet.retweetChild && !cache.includes(tweet.retweetChild._id)) {
      cache.push(tweet.retweetChild._id);
      return true;
    } else if (tweet.retweetChild && cache.includes(tweet.retweetChild._id))
      return false;
    else if (!tweet.retweetChild && cache.includes(tweet._id)) return false;
    else return true;
  });
  return filtered;
};

export default removeDuplicates;
