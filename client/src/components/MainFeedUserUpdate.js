import React, { useState, useEffect } from "react";
import { Storage } from "aws-amplify";
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

  const saveHandler = async () => {
    const form = {};
    form.name = userInfo.name;
    form.bio = userInfo.bio;
    // form.append("photo", document.getElementById("photo").files[0]);

    // 1. Generate filename/ key
    const newFilename = `user-${props.currentUser._id}-${Date.now()}.jpeg`;

    // 2. Pass filename/key to database update
    // form.append("photo", newFilename);

    // console.log("form", form);

    // 3. Save file to AWS storage
    if (document.getElementById("photo").files[0]) {
      const file = document.getElementById("photo").files[0];
      const result = await Storage.put(newFilename, file);
      console.log("file: ", file);
      console.log("result: ", result);
      form.photo = newFilename;
      props.fetchImages();
    }

    axios.post("/api/v1/users/updateUser", form).then(
      (res) => {
        console.log(res);
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
    // console.log("saveBtn: ", e);
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
            // onChange={changeHandler}
            accept='image/*'
            id='photo'
            name='photo'
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
        <div className='mainfeed__bio__row-5'></div>
      </div>
    </div>
  );
};

export default MainFeedUserUpdate;
