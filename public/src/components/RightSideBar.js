import React from "react";
import WhoToFollow from "./WhoToFollow";
import Signature from "./Signature";

const RightSideBar = (props) => {
  return (
    <div className='rightsidebar'>
      <WhoToFollow fetchUser={props.fetchUser} />
      <Signature />
    </div>
  );
};

export default RightSideBar;
