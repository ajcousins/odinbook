import React from "react";

const MenuPopUp = (props) => {
  if (!props.menuVis) return null;
  else {
    return (
      <div>
        <div className='menu__click-area' onClick={props.menuHandler}>
          <div className='menu'>
            <div className='menu__item' onClick={props.logOut}>
              Log out @{props.currentUser.handle}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default MenuPopUp;
