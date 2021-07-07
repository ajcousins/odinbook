import React from "react";
import WhoToFollow from "./WhoToFollow";
import Signature from "./Signature";

const RightSideBar = (props) => {
  return (
    <div className='rightsidebar'>
      <WhoToFollow fetchUser={props.fetchUser} imgToUrl={props.imgToUrl} />
      <Signature />
    </div>
  );
};

export default RightSideBar;
