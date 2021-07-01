const orderFollowList = (arr) => {
  // Sorts array: 1) following, 2) not following, 3) current user.
  let arrayNew = [...arr];
  return arrayNew.sort((cur, next) => {
    const rank = (user) => {
      if (user.followStatus === "current user") return 2;
      if (user.followStatus === "following") return 0;
      else return 1;
    };

    if (rank(cur) > rank(next)) return 1;
    if (rank(cur) < rank(next)) return -1;
    else return 0;
  });
};

export default orderFollowList;
