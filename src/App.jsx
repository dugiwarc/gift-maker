import React, { useState, useEffect } from 'react';
import {createFFmpeg, fetchFile} from "@ffmpeg/ffmpeg"

// Styles
import './App.css';

const ffmpeg = createFFmpeg()

function App() {
  
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();


  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  }

  useEffect(()=>{
    load();
  },[])

  const convertToGif = async () =>{
    console.log("video", video)

    // Write the file to memory
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));

    // Run the FFMpeg command
    await ffmpeg.run('-i', 'test.mp4', '-t', '2.5', '-ss', '2.0', '-f', 'gif', 'out.gif');

    // Read the result
    const data = ffmpeg.FS('readFile', 'out.gif');

    // Create a url
    const url = URL.createObjectURL(new Blob([data.buffer], {type: 'image/gif'}))

    setGif(url)
  }

  const handleOnChange = (evt) => {
    console.log("Video",evt.target.files); 
    setVideo(evt.target.files[0]);
  }

  return ready ? (
    <div className="App">
      {video && <video controls width="250" src={URL.createObjectURL(video)}></video>}
      <input type="file" onChange={handleOnChange}/>

      <button onClick={convertToGif}>Convert</button>  
      {gif && <img src={gif} width="250"/>}
    </div>
  ) : (<p>Loading</p>);
}

export default App;
