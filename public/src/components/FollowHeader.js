import SvgBackArrow from "./../iconComponents/SvgBackArrow";

const FollowHeader = (props) => {
  return (
    <div>
      <div className='mainfeed__header'>
        <SvgBackArrow
          height='22.5px'
          changePage={() => {
            props.fetchUser(props.selectedUser._id);
            props.changePage(1);
          }}
        />
        <div className='mainfeed__header__col-2'>
          <div className='mainfeed__header__text'>
            {props.selectedUser.name}
          </div>
          <span className='mainfeed__user__tweets'>
            @{props.selectedUser.handle}
          </span>
        </div>
      </div>
      {props.type === "Following" ? (
        <div className='mainfeed__follow__nav'>
          <div
            className='mainfeed__follow__nav-btn'
            onClick={() => props.changePage(3)}
          >
            Followers
          </div>
          <div className='mainfeed__follow__nav-btn--selected'>Following</div>
        </div>
      ) : (
        <div className='mainfeed__follow__nav'>
          <div className='mainfeed__follow__nav-btn--selected'>Followers</div>
          <div
            className='mainfeed__follow__nav-btn'
            onClick={() => props.changePage(2)}
          >
            Following
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowHeader;
