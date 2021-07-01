const UserTile = (props) => {
  const status = (status) => {
    if (status === "current user") return null;
    else if (status === "following")
      return (
        <button
          className='btn btn--following '
          onClick={() => props.updateArray(props.user._id, "not following")}
        ></button>
      );
    else
      return (
        <button
          className='btn btn--follow'
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
    <div className='userPreviewTile' onClick={nameClickHandler}>
      <div className='userPreviewTile__col-1'>
        <img
          className='tweet__avatar'
          src={`img/users/${props.user.photo}`}
          alt={`${props.user.name}`}
        />
      </div>
      <div className='userPreviewTile__col-2'>
        <div className='userPreviewTile__col-2__row-1'>
          <div>
            <div className='userPreviewTile__name' onClick={nameClickHandler}>
              {props.user.name}
            </div>
            <div className='userPreviewTile__handle'>@{props.user.handle}</div>
          </div>
          {status(props.status)}
        </div>
        <div className='userPreviewTile__col-2__row-2'>{props.user.bio}</div>
      </div>
    </div>
  );
};

export default UserTile;
