import React, { useState } from "react";
import axios from "axios";
import SvgTwitterLogo from "./../iconComponents/SvgTwitterLogo";
import isEmail from "validator/lib/isEmail";
import isStrongPassword from "validator/lib/isStrongPassword";

const RegisterForm = (props) => {
  const [input, setInput] = useState({});
  const [isValid, setIsValid] = useState({
    email: false,
    name: false,
    handle: false,
    password: false,
    passwordConfirm: false,
  });
  const [bioInput, setBioInput] = useState("");
  const [page, setPage] = useState(0);
  const [photo, setPhoto] = useState("default.jpg");

  const changeHandler = (e) => {
    let inputCopy = input;
    inputCopy[e.target.name] = e.target.value;
    setInput(inputCopy);
    validateDetails();
  };

  const nextPage = () => {
    setPage(page + 1);
  };

  const prevPage = () => {
    setPage(page - 1);
  };

  const validateDetails = () => {
    // TO DO
    const isValidCopy = { ...isValid };

    // Email address
    if (input.email) {
      isValidCopy.email = isEmail(input.email);
    }

    // Name
    if (input.name) {
      // Must be at least 3 chars long.
      isValidCopy.name = input.name.length > 2;
    }

    // Name
    if (input.handle) {
      // Must be at least 3 chars long.
      isValidCopy.handle = input.handle.length > 2;
    }

    // Password
    if (input.password) {
      // Must be minimum 8 chars
      isValidCopy.password = isStrongPassword(input.password, {
        minSymbols: 0,
        minUppercase: 0,
        minLowercase: 0,
        minNumbers: 0,
      });
    }

    // Confirmation
    if (input.passwordConfirm) {
      isValidCopy.passwordConfirm = input.passwordConfirm === input.password;
    }

    setIsValid(isValidCopy);
  };

  const createUser = (e) => {
    e.preventDefault();

    axios.post("/api/v1/users/signup", input).then(
      (res) => {
        if (res.status === 201) {
          nextPage();
          setInput({});
        }
      },
      (err) => {
        console.log(err);
      }
    );
  };

  const backgroundClickHandler = () => {
    setIsValid({
      email: false,
      name: false,
      handle: false,
      password: false,
      passwordConfirm: false,
    });
    setInput({});
    setPage(0);
    props.logOut();
    props.clickHandler();
  };

  const validatePhoto = (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("photo", document.getElementById("photo").files[0]);

    axios.post("/api/v1/users/updateUser", form).then(
      (res) => {
        const photo = res.data.data.user.photo;
        setPhoto(photo);
        nextPage();
      },
      (err) => {
        console.log(err);
      }
    );
  };

  const bioChangeHandler = (e) => {
    if (e.target.value.length > 160) return;
    let bioInputCopy = bioInput;
    bioInputCopy = e.target.value;
    setBioInput(bioInputCopy);
  };

  const validateBio = (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("bio", document.getElementById("bio").value);

    axios.post("/api/v1/users/updateUser", form).then(
      (res) => {
        nextPage();
      },
      (err) => {
        console.log(err);
      }
    );
  };

  if (!props.formActive) return null;

  switch (page) {
    // Blank form
    case 0:
      return (
        <div className='register__wrapper'>
          <div
            className='register__background'
            onClick={backgroundClickHandler}
          />
          <form className='register__form'>
            <div className='register__header'>
              <SvgTwitterLogo height='29px' />
            </div>
            <h2 className='register__title'>Create your account</h2>

            <input
              name='email'
              className={`login__input ${
                !input.email || isValid.email ? null : "login__invalid"
              }`}
              onChange={changeHandler}
              placeholder='Email'
            />
            <input
              name='name'
              className={`login__input ${
                !input.name || isValid.name ? null : "login__invalid"
              }`}
              onChange={changeHandler}
              placeholder='Full Name'
            />
            <input
              name='handle'
              className={`login__input ${
                !input.handle || isValid.handle ? null : "login__invalid"
              }`}
              onChange={changeHandler}
              placeholder='Handle'
            />
            <input
              name='password'
              className={`login__input ${
                !input.password || isValid.password ? null : "login__invalid"
              }`}
              onChange={changeHandler}
              placeholder='Password'
              type='password'
            />
            <input
              name='passwordConfirm'
              className={`login__input ${
                !input.passwordConfirm || isValid.passwordConfirm
                  ? null
                  : "login__invalid"
              }`}
              onChange={changeHandler}
              placeholder='Confirm Password'
              type='password'
            />
            <div className='btn__footer'>
              {Object.values(isValid).every((item) => item === true) ? (
                <button
                  type='submit'
                  className='btn--next'
                  onClick={createUser}
                >
                  Next
                </button>
              ) : (
                <button type='submit' className='btn--next btn--disable'>
                  Next
                </button>
              )}
            </div>
          </form>
        </div>
      );

    // Upload photo
    case 1:
      return (
        <div className='register__wrapper'>
          <div
            className='register__background'
            onClick={backgroundClickHandler}
          />
          <form className='register__form'>
            <div className='register__header'>
              <SvgTwitterLogo height='29px' />
            </div>
            <h2 className='register__title'>Pick a profile picture</h2>
            <p>Have a favourite selfie? Upload it now.</p>

            <input
              className='register__upload'
              type='file'
              accept='image/*'
              id='photo'
              name='photo'
            />
            <div className='btn__footer'>
              <button className='btn--skip' onClick={nextPage}>
                Skip for now
              </button>
              <button
                type='submit'
                className='btn--next'
                onClick={validatePhoto}
              >
                Next
              </button>
            </div>
          </form>
        </div>
      );

    // Check photo
    case 2:
      return (
        <div className='register__wrapper'>
          <div
            className='register__background'
            onClick={backgroundClickHandler}
          />
          <div className='register__form'>
            <div className='register__header'>
              <SvgTwitterLogo height='29px' />
            </div>
            <h2 className='register__title'>Looking good!</h2>
            <p>Not happy with your photo? If not, go back and reupload.</p>

            <div className='register__avatar-wrapper'>
              <img
                className='register__avatar-preview'
                src={`img/users/${photo}`}
                alt='user'
              />
            </div>
            <div className='btn__footer'>
              <button className='btn--skip' onClick={prevPage}>
                Go back
              </button>
              <button type='submit' className='btn--next' onClick={nextPage}>
                Next
              </button>
            </div>
          </div>
        </div>
      );

    // Upload photo
    case 3:
      return (
        <div className='register__wrapper'>
          <div
            className='register__background'
            onClick={backgroundClickHandler}
          />
          <div className='register__form'>
            <div className='register__header'>
              <SvgTwitterLogo height='29px' />
            </div>
            <h2 className='register__title'>Describe yourself</h2>
            <p>
              What makes you special? Don't think too hard, just have fun with
              it.
            </p>

            <textarea
              className='bioInput'
              onChange={bioChangeHandler}
              value={bioInput}
              id='bio'
            />
            <div className='register__bio-counter'>{bioInput.length}/160</div>
            <div className='btn__footer'>
              <button className='btn--skip' onClick={nextPage}>
                Skip for now
              </button>
              <form>
                <button
                  type='submit'
                  className='btn--next'
                  onClick={validateBio}
                >
                  Next
                </button>
              </form>
            </div>
          </div>
        </div>
      );

    // Form submission successful
    case 4:
      return (
        <div className='register__wrapper'>
          <div
            className='register__background'
            onClick={backgroundClickHandler}
          />
          <div className='register__form'>
            <div className='register__success-page'>
              <div className='register__spacer' />
              <SvgTwitterLogo
                height='44px'
                className='register__logo__success'
              />
              <h2 className='register__title'>Success!</h2>
              <p style={{ whiteSpace: "pre-wrap", textAlign: "center" }}>
                Get the most out of Twittr by staying up to date with {"\n"}
                what's happening.
              </p>
            </div>
            <div className='btn__footer'>
              <button
                className='btn--next'
                onClick={() => {
                  props.clickHandler();
                  setPage(0);
                }}
              >
                Go to login!
              </button>
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
};

export default RegisterForm;
