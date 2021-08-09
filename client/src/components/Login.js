import React, { useState, useEffect } from "react";
import axios from "axios";
import SvgTwitterLogo from "./../iconComponents/SvgTwitterLogo";
import RegisterForm from "./RegisterForm";

const Login = (props) => {
  const [input, setInput] = useState({});
  const [token, setToken] = useState("");
  const [formActive, setFormActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [runDemo, setRunDemo] = useState(false);

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

  const clickHandler = (e) => {
    if (e) e.preventDefault();

    if (formActive) setFormActive(false);
    else setFormActive(true);
  };

  const demoHandler = (e) => {
    e.preventDefault();
    setInput({ email: "51@twitter.com", password: "password" });
    setRunDemo(true);
  };

  useEffect(() => {
    if (input.email === "51@twitter.com") login();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runDemo]);

  return (
    <div className='wrapper-login'>
      <RegisterForm
        formActive={formActive}
        clickHandler={clickHandler}
        logOut={props.logOut}
        fetchImages={props.fetchImages}
        imgToUrl={props.imgToUrl}
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
          <br />
          <button
            className='link-btn'
            onClick={demoHandler}
            style={{ marginTop: "-2em" }}
          >
            Sign in with a DEMO ACOUNT
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
