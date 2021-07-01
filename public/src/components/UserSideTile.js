const UserSideTile = (props) => {
  // Status button
  const status = (status) => {
    if (status === "current user") return null;
    else if (status === "following")
      return (
        <button
          id='btn-follow'
          className='btn btn--following  userSideTile__btn--following '
          onClick={() => props.updateArray(props.user._id, "not following")}
        ></button>
      );
    else
      return (
        <button
          id='btn-follow'
          className='btn btn--follow userSideTile__btn--follow'
          onClick={() => props.updateArray(props.user._id, "following")}
        >
          Follow
        </button>
      );
  };

  const nameClickHandler = (e) => {
    const btns = Array.from(document.querySelectorAll(".btn"));

    // If a button is clicked, the user hasn't clicked a 'name': cancel the operation.
    if (btns.includes(e.target)) return;
    props.fetchUser(props.user._id);
  };

  return (
    <div className='userSideTile' onClick={nameClickHandler}>
      <div className='userSideTile__col-1'>
        <img
          className='tweet__avatar'
          src={`img/users/${props.user.photo}`}
          alt={`${props.user.name}`}
        />
      </div>
      <div className='userSideTile__col-2'>
        <div className='userSideTile__col-2__row-1'>
          <div>
            <div className='userSideTile__name' onClick={nameClickHandler}>
              {props.user.name}
            </div>
            <div className='userSideTile__handle'>@{props.user.handle}</div>
          </div>
          {status(props.status)}
        </div>
        <div className='userSideTile__col-2__row-2'>{props.user.bio}</div>
      </div>
    </div>
  );
};

export default UserSideTile;
