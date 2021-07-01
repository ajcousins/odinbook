import React, { useState, useEffect } from "react";
import axios from "axios";
import SvgBackArrow from "./../iconComponents/SvgBackArrow";
import Follows from "./Follows";
import Tweet from "./Tweet";
import SvgTwitterRetweet from "./../iconComponents/SvgTwitterRetweet";
import LoadingTile from "./../components/LoadingTile";
import removeDuplicates from "./../utils/removeDuplicates";

const MainFeedUser = (props) => {
  const [userTweets, setUserTweets] = useState([]);
  const [tweetPosted, setTweetPosted] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [isFollowingState, setIsFollowingState] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [followerList, setFollowerList] = useState([]);
  const [followerListLength, setFollowerListLength] = useState(0);

  // Get tweets from selected user
  const loadTweets = () => {
    if (!props.selectedUser._id) return;
    async function fetchData() {
      const response = await fetch(
        `/api/v1/tweets/user/${props.selectedUser._id}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      setUserTweets(removeDuplicates(data.userTweets));
      setTweetPosted(false);
      setIsLoaded(true);
    }
    fetchData();
  };

  useEffect(() => {
    loadTweets();
  }, [tweetPosted]);

  useEffect(() => {
    // A separate variable (selectedUserId) is required as the server crashes if not fed a string.

    if (!selectedUserId) {
      setSelectedUserId(props.selectedUser._id);
    } else {
      loadTweets();
    }
  }, [selectedUserId, props.selectedUser._id]);

  const deleteTweet = (tweetId) => {
    // Delete from database
    axios.delete(`/api/v1/tweets/${tweetId}`).then((res) => {
      // If delete successful..
      // Delete from state array.
      const newTweets = [...userTweets];
      let index = newTweets.findIndex((tweet) => tweet.id === tweetId);
      newTweets.splice(index, 1);
      setUserTweets(newTweets);
    });
  };

  const followHandler = () => {
    if (isFollowingState) {
      return null;
    }
    axios
      .post("/api/v1/users/follow", {
        userToFollow: selectedUserId,
      })
      .then(
        (res) => {
          const followerListCopy = [...followerList];
          followerListCopy.push(props.currentUser._id);
          setFollowerList(followerListCopy);
          setIsFollowingState(true);

          let length = followerListLength;
          length++;
          setFollowerListLength(length);
        },
        (err) => {
          console.log(err);
        }
      );
  };

  const unfollowHandler = () => {
    axios
      .post("/api/v1/users/unfollow", {
        userToUnfollow: selectedUserId,
      })
      .then(
        (res) => {
          const followerListCopy = [...followerList];
          let index = followerListCopy.indexOf(props.currentUser._id);
          followerListCopy.splice(index, 1);
          setFollowerList(followerListCopy);
          setIsFollowingState(false);

          let length = followerListLength;
          length--;
          setFollowerListLength(length);
        },
        (err) => {
          console.log(err);
        }
      );
  };

  useEffect(() => {
    if (isLoaded) {
      const followerListCopy = [...props.selectedUser.followers];
      setFollowerListLength(followerListCopy.length);
    }
  }, [isLoaded]);

  // Check if selected user is being followed by current user.
  useEffect(() => {
    if (!isLoaded) return;
    else {
      const followerListCopy = [...props.selectedUser.followers];
      setFollowerList(followerListCopy);

      if (followerList.includes(props.currentUser._id)) {
        setIsFollowingState(true);
      } else {
        setIsFollowingState(false);
      }
    }
  }, [isLoaded, isFollowingState]);

  const editHandler = () => {
    props.changePage(4);
  };

  const tweetHandler = () => {
    setTweetPosted(true);
    loadTweets();
  };

  const followBtn = () => {
    if (!isLoaded) return null;
    if (props.selectedUser._id === props.currentUser._id)
      return (
        <button className='btn--follow btn--edit' onClick={editHandler}>
          Edit profile
        </button>
      );
    if (isFollowingState) {
      return <button className='btn--following' onClick={unfollowHandler} />;
    } else {
      return (
        <button className='btn--follow' onClick={followHandler}>
          Follow
        </button>
      );
    }
  };

  return (
    <div className='mainfeed'>
      <div className='mainfeed__header'>
        <SvgBackArrow height='22.5px' changePage={() => props.changePage(0)} />
        <div className='mainfeed__header__col-2'>
          <div className='mainfeed__header__text'>
            {props.selectedUser.name}
          </div>
          <span className='mainfeed__user__tweets'>
            {userTweets ? userTweets.length : "0"} Tweets
          </span>
        </div>
      </div>
      <div className='mainfeed__banner'>
        <div className='mainfeed__user-avatar--wrapper'>
          <img
            className='mainfeed__user-avatar'
            src={`img/users/${props.selectedUser.photo}`}
            alt={`${props.selectedUser.name}`}
          />
        </div>
      </div>
      <div className='mainfeed__bio'>
        <div className='mainfeed__bio__row-1'>{followBtn()}</div>
        <div className='mainfeed__bio__row-2'>
          <h2 className='mainfeed__user-title'>{props.selectedUser.name}</h2>
          <p>@{props.selectedUser.handle}</p>
        </div>
        <div className='mainfeed__bio__row-3'>
          <p>{props.selectedUser.bio}</p>
        </div>
        <div className='mainfeed__bio__row-5'>
          <Follows
            type='Following '
            number={props.selectedUser.following_length}
            page={2}
            changePage={props.changePage}
            refreshCurrentUser={props.refreshCurrentUser}
            refreshSelectedUser={props.refreshSelectedUser}
          />
          <Follows
            type='Followers '
            number={followerListLength}
            page={3}
            changePage={props.changePage}
            refreshCurrentUser={props.refreshCurrentUser}
            refreshSelectedUser={props.refreshSelectedUser}
          />
        </div>
        <div className='mainfeed__bio__row-7'>
          <div className='mainfeed__bio--selected'>
            Tweets
            <div className='mainfeed__bio--underline' />
          </div>
          <div>Tweets & replies</div>
          <div>Media</div>
          <div>Likes</div>
        </div>
      </div>
      {!isLoaded ? (
        <LoadingTile />
      ) : (
        userTweets.map((tweet) => {
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

export default MainFeedUser;
