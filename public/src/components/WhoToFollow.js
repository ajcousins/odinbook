import React, { useEffect, useState } from "react";
import axios from "axios";
import UserSideTile from "./UserSideTile";
import updateDatabase from "./../utils/updateDatabase";

const WhoToFollow = (props) => {
  const [usersToFollow, setUsersToFollow] = useState([]);

  useEffect(() => {
    getNotFollowing();
  }, []);

  const getNotFollowing = async () => {
    await axios.get("/api/v1/users/whoToFollow").then((res) => {
      const usersToFollowCopy = [...res.data.whoToFollow];
      setUsersToFollow(usersToFollowCopy);
    });
  };

  // Updates 'usersToFollow' array to include whether users are being followed by currentUser.
  // Accepts a 'request' id to add to following list.
  const updateArray = (id, request) => {
    const usersToFollowCopy = [...usersToFollow];
    const index = usersToFollowCopy.findIndex((user) => {
      return user._id === id;
    });
    usersToFollowCopy[index].followStatus = request;

    updateDatabase(id, request);
    setUsersToFollow(usersToFollowCopy);
  };

  return (
    <div className='who-to-follow'>
      <div className='who-to-follow__header__text'>Who To Follow</div>
      {usersToFollow.map((user) => {
        return (
          <UserSideTile
            user={user}
            status={user.followStatus}
            updateArray={updateArray}
            fetchUser={props.fetchUser}
            key={user._id}
          />
        );
      })}
    </div>
  );
};

export default WhoToFollow;
