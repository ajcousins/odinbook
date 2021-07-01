import React, { useEffect, useState } from "react";
import "./App.scss";
import MenuPopUp from "./components/MenuPopUp";
import LeftSideBar from "./components/LeftSideBar";
import MainFeed from "./components/MainFeed";
import RightSideBar from "./components/RightSideBar";
import axios from "axios";
import Login from "./components/Login";

function App() {
  const [header, setHeader] = useState({});
  const [isAuth, setIsAuth] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [selectedUser, setSelectedUser] = useState({});
  const [selectedTweet, setSelectedTweet] = useState({});
  const [curUserLikes, setCurUserLikes] = useState([]);
  const [curUserRetweets, setCurUserRetweets] = useState([]);
  const [menuVis, setMenuVis] = useState(false);
  const [page, setPage] = useState(0);

  const tokenHandler = (token) => {
    let tokenCopy = token;
    setHeader({ Authorization: `Bearer ${tokenCopy}` });
    setIsAuth(true);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/tweets/", {
          method: "GET",
        });
        const data = await response.json();
        if (
          data.status === "fail" ||
          data.status === "error" ||
          data.status === null
        )
          setIsAuth(false);
        else {
          setIsAuth(true);
          setIsLoaded(true);
          const currentUserCopy = { ...data.data.currentUser };
          const curUserLikesCopy = [...data.data.currentUser.likedTweets];
          const curUserRetweetsCopy = [
            ...data.data.currentUser.retweetedTweets,
          ];

          setCurrentUser(currentUserCopy);
          setCurUserLikes(curUserLikesCopy);
          setCurUserRetweets(curUserRetweetsCopy);
        }
      } catch (err) {
        console.log(err);
        setIsAuth(false);
      }
    }
    fetchData();
  }, [isAuth]);

  const refreshCurrentUser = async () => {
    await axios.get("/api/v1/users/current").then((res) => {
      const currentUserCopy = { ...res.data.data.currentUser };
      setCurrentUser(currentUserCopy);

      const curUserRetweetsCopy = currentUserCopy.retweetedTweets;
      setCurUserRetweets(curUserRetweetsCopy);
    });
  };

  const refreshSelectedUser = async () => {
    if (!selectedUser._id) return;
    await axios.get(`/api/v1/users/${selectedUser._id}`).then((res) => {
      const selectedUserCopy = { ...res.data.data.user };
      setSelectedUser(selectedUserCopy);
      // console.log("selectedUser refreshed");
    });
  };

  const fetchUser = (id) => {
    axios.get(`/api/v1/users/${id}`).then((res) => {
      setSelectedUser(res.data.data.user);
    });
    changePage(1);
  };

  const fetchTweet = (tweetId) => {
    const selectedTweetCopy = { ...selectedTweet };

    axios.get(`/api/v1/tweets/${tweetId}`).then((res) => {
      const tweetDetails = {
        tweetId: res.data.data.tweet._id,
        textContent: res.data.data.tweet.textContent,
        dateAdded: res.data.data.tweet.dateAdded_expand,
        likes: res.data.data.tweet.likes,
        likesQty: res.data.data.tweet.likes.length,
      };

      // Get user details associated to tweet.
      axios.get(`/api/v1/users/${res.data.data.tweet.user}`).then((res) => {
        const userDetails = {
          name: res.data.data.user.name,
          handle: res.data.data.user.handle,
          photo: res.data.data.user.photo,
          id: res.data.data.user._id,
        };

        selectedTweetCopy.tweetDetails = tweetDetails;
        selectedTweetCopy.userDetails = userDetails;

        setSelectedTweet(selectedTweetCopy);
      });
    });

    changePage(5);
  };

  const menuHandler = () => {
    if (menuVis) setMenuVis(false);
    else setMenuVis(true);
  };

  const logOut = async () => {
    try {
      await fetch("/api/v1/users/logout", {
        method: "GET",
      });
      setHeader({});
      setIsAuth(false);
      setIsLoaded(false);
      setCurrentUser({});
      setSelectedUser({});
      setCurUserLikes([]);
      setMenuVis(false);
      setPage(0);
    } catch (err) {
      console.log(err);
    }
  };

  const changePage = (page) => {
    if (page === 0) {
      setSelectedUser({});
      setSelectedTweet({});
    }
    setPage(page);
  };

  const likeTweet = (tweetId, add) => {
    // If second attribute is true-- add to array. If false, remove from array.
    const curUserLikesCopy = [...curUserLikes];

    if (add) {
      axios.patch(`/api/v1/tweets/${tweetId}/like`).then((res) => {
        curUserLikesCopy.push(tweetId);
        setCurUserLikes(curUserLikesCopy);
      });
    } else {
      axios.patch(`/api/v1/tweets/${tweetId}/unlike`).then((res) => {
        // Remove tweet from array.
        const index = curUserLikesCopy.findIndex((tweet) => tweet === tweetId);
        curUserLikesCopy.splice(index, 1);
        setCurUserLikes(curUserLikesCopy);
      });
    }
  };

  const retweetTweet = (tweetId, add) => {
    if (add) {
      axios({
        method: "POST",
        url: "/api/v1/tweets/",
        data: {
          user: currentUser._id,
          retweetChild: tweetId,
        },
      }).then((res) => {
        refreshCurrentUser();
        refreshSelectedUser();
      });
    } else {
      // tweetId needs to be parent ID.
      // Delete parent tweet.
      axios({
        method: "POST",
        url: "/api/v1/tweets/undoRetweet",
        data: {
          retweetParent: tweetId,
        },
      }).then((res) => {
        refreshCurrentUser();
        refreshSelectedUser();
      });
    }
  };

  if (!isAuth) {
    // Login/ register screen
    return (
      <div className='App'>
        <Login tokenHandler={tokenHandler} logOut={logOut} />
      </div>
    );
  } else {
    // Main screen
    return (
      <div className='App'>
        <div className='wrapper-main'>
          <MenuPopUp
            menuVis={menuVis}
            menuHandler={menuHandler}
            logOut={logOut}
            currentUser={currentUser}
          />
          <LeftSideBar
            menu={menuHandler}
            currentUser={currentUser}
            changePage={changePage}
            fetchUser={fetchUser}
          />
          <MainFeed
            header={header}
            currentUser={currentUser}
            selectedUser={selectedUser}
            page={page}
            changePage={changePage}
            fetchUser={fetchUser}
            isLoaded={isLoaded}
            refreshCurrentUser={refreshCurrentUser}
            refreshSelectedUser={refreshSelectedUser}
            likeTweet={likeTweet}
            retweetTweet={retweetTweet}
            fetchTweet={fetchTweet}
            selectedTweet={selectedTweet}
            curUserRetweets={curUserRetweets}
          />
          <RightSideBar fetchUser={fetchUser} />
        </div>
      </div>
    );
  }
}

export default App;
