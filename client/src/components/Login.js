import React, { useState } from "react";
import axios from "axios";
import SvgTwitterLogo from "./../iconComponents/SvgTwitterLogo";
import RegisterForm from "./RegisterForm";

const Login = (props) => {
  const [input, setInput] = useState({});
  const [token, setToken] = useState("");
  const [formActive, setFormActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const changeHandler = (e) => {
    let inputCopy = input;
    inputCopy[e.target.name] = e.target.value;
    setInput(inputCopy);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    login();
  };

  const login = async () => {
    axios
      .post("/api/v1/users/login", input)
      .then((res) => {
        const data = res.data;
        setToken(data.token);
        props.tokenHandler(token);
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage(
          "The username and password you entered did not match our records. Please double-check and try again."
        );
      });
  };

  const clickHandler = () => {
    if (formActive) setFormActive(false);
    else setFormActive(true);
  };

  return (
    <div className='wrapper-login'>
      <RegisterForm
        formActive={formActive}
        clickHandler={clickHandler}
        logOut={props.logOut}
      />
      <form className='login'>
        <SvgTwitterLogo height='40px' />
        <h1 className='login__title'>Log in to Twittr</h1>
        {errorMessage ? (
          <div className='login__error-message'>{errorMessage}</div>
        ) : null}

        <input
          id='email'
          name='email'
          className='login__input'
          type='text'
          placeholder='Email'
          onChange={changeHandler}
        />
        <input
          id='password'
          name='password'
          className='login__input'
          type='password'
          placeholder='Password'
          onChange={changeHandler}
        />
        <button type='submit' onClick={submitHandler}>
          Log in
        </button>
        <div className='login__footer'>
          <button className='link-btn' onClick={clickHandler}>
            Sign up for Twittr
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
