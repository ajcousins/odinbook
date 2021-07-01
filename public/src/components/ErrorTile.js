import SvgBackArrow from "./../iconComponents/SvgBackArrow";
import MessageTile from "./MessageTile";

const ErrorTile = (props) => {
  return (
    <div className='mainfeed'>
      <div className='mainfeed__header'>
        <SvgBackArrow height='22.5px' changePage={() => props.changePage(0)} />

        <div className='mainfeed__header__col-2'>
          <div className='mainfeed__header__text'>Error</div>
        </div>
      </div>
      <MessageTile
        heading={"404: Page Not Found"}
        message='The resource you are looking for cannot be found.'
      />
    </div>
  );
};

export default ErrorTile;
