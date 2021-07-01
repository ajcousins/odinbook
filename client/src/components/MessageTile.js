const MessageTile = (props) => {
  return (
    <div className='message-tile'>
      <div className='message-tile__heading'>{props.heading}</div>
      <div className='message-tile__message'>{props.message}</div>
    </div>
  );
};

export default MessageTile;
