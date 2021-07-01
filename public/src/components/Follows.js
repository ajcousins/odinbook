const Follows = (props) => {
  const numberFormat = (int) => {
    let intCopy = int * 1;

    return intCopy.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <span
      style={{ marginRight: "1.5em" }}
      className='follow'
      onClick={() => {
        props.changePage(props.page);
        props.refreshCurrentUser();
        props.refreshSelectedUser();
      }}
    >
      <strong>{numberFormat(props.number)}</strong>&nbsp;{props.type}
    </span>
  );
};

export default Follows;
