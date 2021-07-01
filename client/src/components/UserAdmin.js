import React from "react";
import SvgEllipsis from "./../iconComponents/SvgEllipsis";

const UserAdmin = (props) => {
  return (
    <div className='leftsidebar__container'>
      <div className='leftsidebar__useradmin' onClick={props.menu}>
        <img
          className='leftsidebar__useradmin__avatar'
          src={`img/users/${props.currentUser.photo}`}
          alt={`${props.currentUser.name}`}
        />
        <div>
          <div className='leftsidebar__useradmin__name'>
            {props.currentUser.name}
          </div>
          <div className='leftsidebar__useradmin__handle'>
            @{props.currentUser.handle}
          </div>
        </div>
        <SvgEllipsis className='leftsidebar__useradmin__ellipsis' />
      </div>
    </div>
  );
};

export default UserAdmin;
