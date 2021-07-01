import axios from "axios";

const updateDatabase = (id, request) => {
  if (request === "following") {
    axios
      .post("/api/v1/users/follow", {
        userToFollow: id,
      })
      .then(
        (res) => {
          console.log(res);
        },
        (err) => {
          console.log(err);
        }
      );
  } else if (request === "not following") {
    axios
      .post("/api/v1/users/unfollow", {
        userToUnfollow: id,
      })
      .then(
        (res) => {
          console.log(res);
        },
        (err) => {
          console.log(err);
        }
      );
  }
};

export default updateDatabase;
