import React from "react";
import MainFeedIndex from "./MainFeedIndex";
import MainFeedUser from "./MainFeedUser";
import MainFeedUserFollowing from "./MainFeedUserFollowing";
import MainFeedUserFollowers from "./MainFeedUserFollowers";
import MainFeedUserUpdate from "./MainFeedUserUpdate";
import MainFeedTweetExpand from "./MainFeedTweetExpand";
import ErrorTile from "./ErrorTile";

const MainFeed = (props) => {
  switch (props.page) {
    case 0:
      // Main feed
      return (
        <MainFeedIndex
          title='Home'
          changePage={props.changePage}
          currentUser={props.currentUser}
          fetchUser={props.fetchUser}
          isLoaded={props.isLoaded}
          likeTweet={props.likeTweet}
          retweetTweet={props.retweetTweet}
          fetchTweet={props.fetchTweet}
        />
      );
    case 1:
      // Profile page
      return (
        <MainFeedUser
          title='User'
          changePage={props.changePage}
          selectedUser={props.selectedUser}
          currentUser={props.currentUser}
          fetchUser={props.fetchUser}
          isLoaded={props.isLoaded}
          refreshCurrentUser={props.refreshCurrentUser}
          refreshSelectedUser={props.refreshSelectedUser}
          likeTweet={props.likeTweet}
          retweetTweet={props.retweetTweet}
          fetchTweet={props.fetchTweet}
        />
      );
    case 2:
      // SelectedUser following list
      return (
        <MainFeedUserFollowing
          selectedUser={props.selectedUser}
          changePage={props.changePage}
          currentUser={props.currentUser}
          fetchUser={props.fetchUser}
          refreshCurrentUser={props.refreshCurrentUser}
          refreshSelectedUser={props.refreshSelectedUser}
        />
      );
    case 3:
      // SelectedUser follower list
      return (
        <MainFeedUserFollowers
          selectedUser={props.selectedUser}
          changePage={props.changePage}
          currentUser={props.currentUser}
          fetchUser={props.fetchUser}
          refreshCurrentUser={props.refreshCurrentUser}
          refreshSelectedUser={props.refreshSelectedUser}
        />
      );
    case 4:
      // Profile user update
      return (
        <MainFeedUserUpdate
          title='Update'
          changePage={props.changePage}
          currentUser={props.currentUser}
          refreshCurrentUser={props.refreshCurrentUser}
          refreshSelectedUser={props.refreshSelectedUser}
        />
      );
    case 5:
      // Tweet expand
      return (
        <MainFeedTweetExpand
          changePage={props.changePage}
          selectedTweet={props.selectedTweet}
          currentUser={props.currentUser}
          fetchUser={props.fetchUser}
          likeTweet={props.likeTweet}
          retweetTweet={props.retweetTweet}
          fetchTweet={props.fetchTweet}
          curUserRetweets={props.curUserRetweets}
        />
      );
    default:
      // 404
      return <ErrorTile changePage={props.changePage} />;
  }
};

export default MainFeed;
