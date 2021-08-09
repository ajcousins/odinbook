import React, { useState } from "react";
import UserTile from "./UserTile";

const WhoToFollowMain = () => {
  const [allUsers, setAllUsers] = useState([]);

  return (
    <div>
      <UserTile
        user={user}
        status={user.followStatus}
        updateArray={updateArray}
        fetchUser={props.fetchUser}
        key={user._id}
        imgToUrl={props.imgToUrl}
      />
    </div>
  );
};

export default WhoToFollowMain;
