import React, { useState, useEffect } from "react";
import axios from "axios";
import Tweet from "./../components/Tweet";
import ComposeTweet from "./../components/ComposeTweet";
import LoadingTile from "./../components/LoadingTile";
import MessageTile from "./MessageTile";
import SvgTwitterRetweet from "./../iconComponents/SvgTwitterRetweet";
import removeDuplicates from "./../utils/removeDuplicates";

const MainFeedIndex = (props) => {
  const [tweets, setTweets] = useState([]);
  const [tweetPosted, setTweetPosted] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/tweets/", {
        method: "GET",
      });
      const data = await response.json();

      setTweets(removeDuplicates(data.data.tweets));
      setTweetPosted(false);
    }
    fetchData();
  }, [tweetPosted]);

  const tweetHandler = () => {
    setTweetPosted(true);
  };

  const deleteTweet = (tweetId) => {
    // Delete from database
    axios.delete(`/api/v1/tweets/${tweetId}`).then((res) => {
      // If delete successful..
      // Delete from state array.
      const newTweets = [...tweets];

      let index = newTweets.findIndex((tweet) => tweet.id === tweetId);
      newTweets.splice(index, 1);
      setTweets(newTweets);
    });
  };

  return (
    <div className='mainfeed'>
      <div className='mainfeed__header'>
        <div className='mainfeed__header__text'>{props.title}</div>
      </div>
      <ComposeTweet
        currentUser={props.currentUser}
        tweetHandler={tweetHandler}
      />
      <div className='mainfeed__divider' />
      {tweets.length === 0 ? (
        <MessageTile
          heading={"Welcome to Twittr!"}
          message="This is the best place to see what's happening in your world. Find some people to follow now."
        />
      ) : null}
      {!props.isLoaded ? (
        <LoadingTile />
      ) : (
        tweets.map((tweet) => {
          return (
            <div
              className='tweet__hover-wrapper'
              key={`${tweet.retweetChild ? tweet.retweetChild._id : tweet._id}`}
            >
              {tweet.retweetChild ? (
                // RETWEET
                <div>
                  <div className='retweet__header'>
                    <SvgTwitterRetweet height='16' />
                    {tweet.user.name} retweeted
                  </div>
                  <Tweet
                    className='tweet'
                    name={tweet.retweetChild.user.name}
                    id={tweet.retweetChild.user._id}
                    tweetId={tweet.retweetChild._id}
                    parentTweetId={tweet._id}
                    handle={`@${tweet.retweetChild.user.handle}`}
                    profilePic={tweet.retweetChild.user.photo}
                    time={tweet.retweetChild.tweetAge}
                    message={tweet.retweetChild.textContent}
                    replies={tweet.retweetChild.replies_short}
                    retweets={tweet.retweetChild.retweets_short}
                    likes={tweet.retweetChild.likes}
                    fetchUser={props.fetchUser}
                    changePage={props.changePage}
                    currentUser={props.currentUser}
                    deleteTweet={deleteTweet}
                    likeTweet={props.likeTweet}
                    retweetTweet={props.retweetTweet}
                    fetchTweet={props.fetchTweet}
                    tweetHandler={tweetHandler}
                  />
                </div>
              ) : (
                <Tweet
                  className='tweet'
                  name={tweet.user.name}
                  id={tweet.user._id}
                  tweetId={tweet._id}
                  handle={`@${tweet.user.handle}`}
                  profilePic={tweet.user.photo}
                  time={tweet.tweetAge}
                  message={tweet.textContent}
                  replies={tweet.replies_short}
                  retweets={tweet.retweets_short}
                  likes={tweet.likes}
                  fetchUser={props.fetchUser}
                  changePage={props.changePage}
                  currentUser={props.currentUser}
                  deleteTweet={deleteTweet}
                  likeTweet={props.likeTweet}
                  retweetTweet={props.retweetTweet}
                  fetchTweet={props.fetchTweet}
                  tweetHandler={tweetHandler}
                />
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default MainFeedIndex;
