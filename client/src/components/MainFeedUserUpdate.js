import React, { useState, useEffect } from "react";
import axios from "axios";
import SvgBackArrow from "./../iconComponents/SvgBackArrow";

const MainFeedUserUpdate = (props) => {
  const [userInfo, setUserInfo] = useState({ name: " ", bio: "" });

  useEffect(() => {
    setUserInfo({ name: props.currentUser.name, bio: props.currentUser.bio });
  }, []);

  const changeHandler = (e) => {
    if (e.target.name === "name" && e.target.value.length > 35) return;
    if (e.target.name === "bio" && e.target.value.length > 160) return;
    const userInfoCopy = { ...userInfo };
    userInfoCopy[e.target.name] = e.target.value;
    setUserInfo(userInfoCopy);
  };

  const saveHandler = () => {
    const form = new FormData();
    form.append("name", userInfo.name);
    form.append("bio", userInfo.bio);
    form.append("photo", document.getElementById("photo").files[0]);

    axios.post("/api/v1/users/updateUser", form).then(
      (res) => {
        props.refreshCurrentUser();
        props.refreshSelectedUser();
        props.changePage(1);
      },
      (err) => {
        console.log(err);
      }
    );
  };

  const saveBtn = () => {
    return (
      <button className='btn--save' onClick={saveHandler}>
        Save
      </button>
    );
  };

  return (
    <div className='mainfeed'>
      <div className='mainfeed__header'>
        <SvgBackArrow height='22.5px' changePage={() => props.changePage(1)} />
        <div className='mainfeed__header__col-2'>
          <div className='mainfeed__header__text'>{props.currentUser.name}</div>
          {/* <span className='mainfeed__user__tweets'>
            {userTweets ? userTweets.length : "0"} Tweets
          </span> */}
        </div>
      </div>
      <div className='mainfeed__banner'>
        <div className='mainfeed__user-avatar--wrapper'>
          <label htmlFor='photo'>
            <img
              className='mainfeed__user-avatar update-user__avatar'
              src={`img/users/${props.currentUser.photo}`}
              alt={`${props.currentUser.name}`}
            />
          </label>
        </div>
      </div>
      <div className='mainfeed__bio'>
        <div className='mainfeed__bio__row-1'>{saveBtn()}</div>
        <div className='update-user__photo-upload'>
          <input
            className='register__upload'
            type='file'
            accept='image/*'
            id='photo'
            name='photo'
            // style={{ display: "none" }}
          />
        </div>
        <div className='update-user__bio__row-2'>
          <input
            className='update-user__name-input'
            onChange={changeHandler}
            name='name'
            value={userInfo.name}
            placeholder='Full Name'
          />

          {/* <h2 className='mainfeed__user-title'>{props.currentUser.name}</h2> */}
          <p>@{props.currentUser.handle}</p>
        </div>
        <div className='mainfeed__bio__row-3'>
          <textarea
            className='bioInput'
            onChange={changeHandler}
            value={userInfo.bio}
            id='bio'
            name='bio'
          />
          <div className='update-user__bio-counter'>
            {userInfo.bio ? userInfo.bio.length : "0"}/160
          </div>
        </div>
        <div className='mainfeed__bio__row-5'>
          {/* <Follows
            type='Following '
            number={props.selectedUser.following_length}
            page={2}
            changePage={props.changePage}
            refreshCurrentUser={props.refreshCurrentUser}
            refreshSelectedUser={props.refreshSelectedUser}
          /> */}
          {/* <Follows
            type='Followers '
            number={followerListLength}
            page={3}
            changePage={props.changePage}
            refreshCurrentUser={props.refreshCurrentUser}
            refreshSelectedUser={props.refreshSelectedUser}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default MainFeedUserUpdate;
