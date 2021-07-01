// Attribute 1: 'arr': array of user objects.
// Attribute 2: 'userFollows': array of IDs. CurrentUser follower IDs to check against.
// Attribute 3: 'id': currentUser ID.

const appendToList = (arr, userFollows, id) => {
  // Appends follow status (whether current user is following any of the users in the array)
  let arrayNew = [...arr];
  const appendedArr = arrayNew.map((user) => {
    if (user._id === id) {
      user.followStatus = "current user";
    } else if (userFollows.includes(user._id)) {
      user.followStatus = "following";
    } else {
      user.followStatus = "not following";
    }
    return user;
  });
  return appendedArr;
};

export default appendToList;
