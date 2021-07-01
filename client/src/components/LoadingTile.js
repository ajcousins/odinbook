import loader from "./../static/loader-gif.gif";

const LoadingTile = () => {
  return (
    <div className='loading-tile'>
      <img className='loading-tile__gif' src={loader} alt='loading'></img>
    </div>
  );
};

export default LoadingTile;
