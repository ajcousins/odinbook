import React from "react";

const SideButton = (props) => {
  return (
    <div className='leftsidebar__button' onClick={props.clickHandler}>
      {props.children}
      <div className={props.text == null ? "" : "leftsidebar__text"}>
        {props.text}
      </div>
    </div>
  );
};

export default SideButton;
