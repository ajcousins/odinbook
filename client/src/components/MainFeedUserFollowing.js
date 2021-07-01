import React, { useState, useEffect } from "react";
import axios from "axios";
import FollowHeader from "./FollowHeader";
import MessageTile from "./MessageTile";
import UserTile from "./UserTile";
import appendToList from "./../utils/apendToList";
import orderFollowList from "./../utils/orderFollowList";
import updateDatabase from "./../utils/updateDatabase";

const MainFeedUserFollowing = (props) => {
  const [followingArr, setFollowingArr] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    axios
      .get(`/api/v1/users/${props.selectedUser._id}/following`)
      .then((res) => {
        setFollowingArr(
          orderFollowList(
            appendToList(
              res.data.followingInfo,
              props.currentUser.following,
              props.currentUser._id
            )
          )
        );
        props.refreshSelectedUser();
        props.refreshCurrentUser();
        setIsLoaded(true);
      });
  }, [isLoaded]);

  const updateArray = (id, request) => {
    const newFollowingArr = [...followingArr];
    const index = newFollowingArr.findIndex((user) => {
      return user._id === id;
    });
    newFollowingArr[index].followStatus = request;

    updateDatabase(id, request);
    setFollowingArr(newFollowingArr);
  };

  return (
    <div className='mainfeed'>
      <FollowHeader
        type='Following'
        selectedUser={props.selectedUser}
        changePage={props.changePage}
        fetchUser={props.fetchUser}
      />
      <div className='mainfeed__follow-list'>
        {props.selectedUser.following.length === 0 ? (
          <MessageTile
            heading={`@${props.selectedUser.handle} isn't following anyone`}
            message="When they do, they'll be listed here."
          />
        ) : (
          followingArr.map((user) => {
            return (
              <UserTile
                user={user}
                status={user.followStatus}
                updateArray={updateArray}
                fetchUser={props.fetchUser}
                refreshSelectedUser={props.refreshSelectedUser}
                key={user._id}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default MainFeedUserFollowing;
