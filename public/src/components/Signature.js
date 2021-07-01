const Signature = () => {
  return (
    <div className='signature'>
      <div>alvin.cousins@googlemail.com</div>
      <div>
        <strong className='signature__label'>Back-end:</strong>&nbsp;
        <a
          className='signature__link'
          target='_blank'
          rel='noreferrer'
          href='https://github.com/ajcousins/odinbook'
        >
          github.com/ajcousins/odinbook
        </a>
      </div>
      <div>
        <strong className='signature__label'>Front-end:</strong>&nbsp;
        <a
          className='signature__link'
          target='_blank'
          rel='noreferrer'
          href='https://github.com/ajcousins/odinbook-react'
        >
          github.com/ajcousins/odinbook-react
        </a>
      </div>
    </div>
  );
};

export default Signature;
