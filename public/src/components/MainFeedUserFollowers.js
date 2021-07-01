import React, { useState, useEffect } from "react";
import axios from "axios";
import FollowHeader from "./FollowHeader";
import MessageTile from "./MessageTile";
import UserTile from "./UserTile";
import appendToList from "./../utils/apendToList";
import updateDatabase from "./../utils/updateDatabase";
import orderFollowList from "./../utils/orderFollowList";

const MainFeedUserFollowers = (props) => {
  const [followersArr, setFollowersArr] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    axios
      .get(`/api/v1/users/${props.selectedUser._id}/followers`)
      .then((res) => {
        setFollowersArr(
          orderFollowList(
            appendToList(
              res.data.followersInfo,
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
    const newFollowersArr = [...followersArr];
    const index = newFollowersArr.findIndex((user) => {
      return user._id === id;
    });
    newFollowersArr[index].followStatus = request;

    updateDatabase(id, request);
    setFollowersArr(newFollowersArr);
  };

  return (
    <div className='mainfeed'>
      <FollowHeader
        type='Followers'
        selectedUser={props.selectedUser}
        changePage={props.changePage}
        fetchUser={props.fetchUser}
      />
      <div className='mainfeed__follow-list'>
        {props.selectedUser.followers.length === 0 ? (
          <MessageTile
            heading={`@${props.selectedUser.handle} doesn't have any followers`}
            message="When someone follows them, they'll be listed here."
          />
        ) : (
          followersArr.map((user) => {
            return (
              <UserTile
                user={user}
                status={user.followStatus}
                updateArray={updateArray}
                fetchUser={props.fetchUser}
                key={user._id}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default MainFeedUserFollowers;
