import React from "react";
import SideButton from "./SideButton";
import SvgTwitterLogo from "../iconComponents/SvgTwitterLogo";
import SvgHomeIcon from "../iconComponents/SvgHomeIcon";
import SvgProfileIcon from "../iconComponents/SvgProfileIcon";
import UserAdmin from "../components/UserAdmin";

const iconHeight = "26px";

const LeftSideBar = (props) => {
  const clickHandler = (page) => {
    // If page request is '1' (currentUser profile page), then fetchUser of currentUser needs to be called.
    if (page === 1) {
      props.fetchUser(props.currentUser._id);
    }
    props.changePage(page);
  };

  return (
    <div className='leftsidebar'>
      <div className='leftsidebar__upper-container'>
        <SideButton clickHandler={() => clickHandler(0)}>
          <SvgTwitterLogo height='29px' />
        </SideButton>

        <SideButton text='Home' clickHandler={() => clickHandler(0)}>
          <SvgHomeIcon height={iconHeight} />
        </SideButton>

        <SideButton text='Profile' clickHandler={() => clickHandler(1)}>
          <SvgProfileIcon height={iconHeight} />
        </SideButton>
      </div>

      <UserAdmin menu={props.menu} currentUser={props.currentUser} />
    </div>
  );
};

export default LeftSideBar;
