import React, { useState } from "react";
import axios from "axios";
import TextareaAutosize from "react-autosize-textarea";
import SvgBackArrow from "./../iconComponents/SvgBackArrow";
import TweetButton from "./TweetButton";
import TwitterReply from "./../iconComponents/SvgTwitterReply";
import TwitterRetweet from "./../iconComponents/SvgTwitterRetweet";
import TwitterLike from "./../iconComponents/SvgTwitterLike";
import TwitterLikeActive from "./../iconComponents/SvgTwitterLikeActive";
import TwitterShare from "./../iconComponents/SvgTwitterShare";
import { useEffect } from "react/cjs/react.development";
import LoadingTile from "./../components/LoadingTile";
import Tweet from "./../components/Tweet";
import removeDuplicates from "./../utils/removeDuplicates";
import SvgTwitterRetweet from "./../iconComponents/SvgTwitterRetweet";

const MainFeedTweetExpand = (props) => {
  const [selectedTweet, setSelectedTweet] = useState({});
  const [tweetText, setTweetText] = useState("");
  const [replies, setReplies] = useState([]);
  const [tweetPosted, setTweetPosted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesNumber, setLikesNumber] = useState(0);

  useEffect(() => {
    if (selectedTweet.tweetDetails) {
      fetchReplies();
    }
  }, [selectedTweet, tweetPosted]);

  // Check likes list
  useEffect(() => {
    if (isLoaded) {
      if (selectedTweet.tweetDetails.likes.includes(props.currentUser._id)) {
        setIsLiked(true);
      }
      setLikesNumber(selectedTweet.tweetDetails.likes.length);
    }
  }, [selectedTweet, props.currentUser._id, isLoaded]);

  const fetchReplies = () => {
    axios({
      method: "GET",
      url: `/tweets/${selectedTweet.tweetDetails.tweetId}/replies`,
    }).then((res) => {
      setReplies(removeDuplicates(res.data.data.tweets));
      setIsLoaded(true);
      setTweetPosted(false);
    });
  };

  useEffect(() => {
    setSelectedTweet(props.selectedTweet);
  }, [props.selectedTweet]);

  const onChangeHandler = (e) => {
    setTweetText(e.target.value);
  };

  const tweetSubmit = async () => {
    if (!tweetText) return;

    axios({
      method: "POST",
      url: "/api/v1/tweets/",
      data: {
        textContent: tweetText,
        user: props.currentUser._id,
        replyParent: selectedTweet.tweetDetails.tweetId,
      },
    });

    tweetHandler();
    setTweetText("");
  };

  const tweetHandler = () => {
    setTweetPosted(true);
  };

  const deleteTweet = (tweetId) => {
    // Delete from database

    axios.delete(`/api/v1/tweets/${tweetId}`).then((res) => {
      const newTweets = [...replies];
      let index = newTweets.findIndex((tweet) => tweet.id === tweetId);
      newTweets.splice(index, 1);
      setReplies(newTweets);
    });
  };

  const likeHandler = () => {
    if (isLiked) {
      axios
        .patch(`/api/v1/tweets/${selectedTweet.tweetDetails.tweetId}/unlike`)
        .then((res) => {
          setIsLiked(false);
          setLikesNumber(likesNumber - 1);
        });
    } else {
      axios
        .patch(`/api/v1/tweets/${selectedTweet.tweetDetails.tweetId}/like`)
        .then((res) => {
          setIsLiked(true);
          setLikesNumber(likesNumber + 1);
        });
    }
  };

  const childToParent = (childTweetId) => {
    if (!props.curUserRetweets) return;
    if (props.curUserRetweets.length === 0) return;
    const index = props.curUserRetweets.findIndex(
      (retweet) => retweet.retweetChild === childTweetId
    );
    if (index < 0) return;
    return props.curUserRetweets[index]._id;
  };

  return (
    <div className='mainfeed'>
      <div className='mainfeed__header'>
        <SvgBackArrow height='22.5px' changePage={() => props.changePage(0)} />
        <div className='mainfeed__header__col-2'>
          <div className='mainfeed__header__text'>Tweet</div>
        </div>
      </div>
      <div className='tweet-expanded'>
        {selectedTweet.userDetails ? (
          <div>
            <div className='tweet-expanded__row-1'>
              <img
                className='tweet__avatar'
                src={`img/users/${selectedTweet.userDetails.photo}`}
                alt={`${selectedTweet.userDetails.name}`}
              />
              <div className='tweet-expanded__row-1__col-2'>
                <div
                  className='tweet-expanded__row-1__col-2__name'
                  onClick={() => props.fetchUser(selectedTweet.userDetails.id)}
                >
                  {selectedTweet.userDetails.name}
                </div>
                @{selectedTweet.userDetails.handle}
              </div>
            </div>
            <div className='tweet-expanded__row-2'>
              {selectedTweet.tweetDetails.textContent}
            </div>
            <div className='tweet-expanded__row-3'>
              {selectedTweet.tweetDetails.dateAdded}
            </div>
            <div className='tweet-expanded__row-4'>
              <strong>{likesNumber}</strong>
              &nbsp;Likes
            </div>
            <div className='tweet-expanded__row-5'>
              <TweetButton>
                <TwitterReply height='24' />
              </TweetButton>
              <TweetButton>
                <TwitterRetweet height='24' />
              </TweetButton>
              <span className='tweet__like-btn' onClick={likeHandler}>
                <TweetButton>
                  {isLiked ? (
                    <TwitterLikeActive height='24' />
                  ) : (
                    <TwitterLike height='24' />
                  )}
                </TweetButton>
              </span>
              <TweetButton>
                <TwitterShare height='24' />
              </TweetButton>
            </div>
            <div className='tweet-expanded__reply'>
              <div className='tweet-expanded__reply__col-1'>
                <img
                  className='tweet__avatar'
                  src={`img/users/${props.currentUser.photo}`}
                  alt={`${props.currentUser.name}`}
                />
              </div>
              <div className='tweet-expanded__reply__col-2'>
                <TextareaAutosize
                  className='tweet__compose__input'
                  placeholder='Tweet your reply'
                  onChange={onChangeHandler}
                  value={tweetText}
                  maxLength='280'
                />
              </div>
              <div className='tweet-expanded__reply__col-3 tweet-expanded__btn--right'>
                <button
                  className='tweet__compose--submit tweet-expanded__btn'
                  type='submit'
                  onClick={tweetSubmit}
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <div className='mainfeed__divider' />
      <div>
        {!isLoaded ? (
          <LoadingTile />
        ) : (
          replies.map((tweet) => {
            return (
              <div
                className='tweet__hover-wrapper'
                key={`${
                  tweet.retweetChild ? tweet.retweetChild._id : tweet._id
                }`}
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
                    // ID needs to be converted to parent for request to work.
                    parentTweetId={childToParent(tweet._id)} // <-------------------- In tweet expand, only the child tweet is visible.
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
    </div>
  );
};

export default MainFeedTweetExpand;
