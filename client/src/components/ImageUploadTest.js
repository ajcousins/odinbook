const ImageUploadTest = () => {
  return (
    <div>
      Image Upload Test
      <form action='/upload' method='POST' encType='multipart/form-data'>
        <div>
          <input type='file' name='file' id='file' />
          <label htmlFor='file'>Choose File</label>
        </div>
        <input type='submit' value='Submit' />
        <img src='http://localhost:3000/image/277fa8f7f7d87199cb58995594a61d1a.jpg'></img>
      </form>
    </div>
  );
};
export default ImageUploadTest;
