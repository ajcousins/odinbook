import { useState, useEffect } from "react";
import { Storage } from "aws-amplify";

const ImageUploadTest = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    // Keys that we get here are keys that we pass in as a name
    let imageKeys = await Storage.list("");
    console.log("ImageKeys 1: ", imageKeys);
    // For secure access we need to sign each key which gives it a temporary url, which allows us to render in our app.
    imageKeys = await Promise.all(
      imageKeys.map(async (k) => {
        const signedUrl = await Storage.get(k.key);
        // Return signed version of key.
        return signedUrl;
      })
    );
    console.log("ImageKeys 2: ", imageKeys);
    setImages(imageKeys);
  };

  const onChange = async (e) => {
    const file = e.target.files[0];
    const result = await Storage.put(file.name, file);
    console.log("result: ", result);
    fetchImages();
  };

  return (
    <div>
      <h1>Image Upload Test</h1>
      <input type='file' onChange={onChange} />
      {images.map((image) => {
        return (
          <img
            src={image}
            key={image}
            alt='test'
            style={{ width: 300, height: 200, marginBottom: 10 }}
          />
        );
      })}
    </div>
  );
};
export default ImageUploadTest;
