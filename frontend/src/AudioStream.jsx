import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import "../src/styles/AudioStream.css";

export default function AudioStream({ onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const audioCanvas = useRef();
  let audioCtx;
  const onCloseEvent = () => {
    // Call the parent callback function
    onClose();
  };

  const onSendEvent = () => {
    console.log("send clicked");
    //tell the recorder to stop the recording
    mediaRecorder.stop();

    //create the wav blob and pass it on to createDownloadLink
    mediaRecorder.exportWAV(uploadFile);
    //onClose()

    function uploadFile(blob) {
      //name of .wav file to use during upload and download (without extendion)
      var filename = new Date().toISOString();

      //add controls to the <audio> element

      var xhr = new XMLHttpRequest();
      xhr.onload = function (e) {
        if (this.readyState === 4) {
          console.log("Server returned: ", e.target.responseText);
        }
      };
      var fd = new FormData();
      fd.append("audio_data", blob, filename);
      xhr.open("POST", "http://localhost:5000/speech2text", true);
      xhr.send(fd);
    }
  };

  const onMediaRecorderStop = (e) => {
    console.log("data available after MediaRecorder.stop() called.");
    setIsLoading(true);
  };

  const visualize = (stream) => {
    if (!audioCtx) {
      audioCtx = new AudioContext();
    }

    const source = audioCtx.createMediaStreamSource(stream);

    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);

    draw();

    function draw() {
      let canvasCtx = audioCanvas.current.getContext("2d");
      const WIDTH = audioCanvas.current.width;
      const HEIGHT = audioCanvas.current.height;

      requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = "rgb(200, 200, 200)";
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      canvasCtx.lineWidth = 3;
      canvasCtx.strokeStyle = "rgb(0, 0, 0)";

      canvasCtx.beginPath();

      let sliceWidth = (WIDTH * 1.0) / bufferLength;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        let v = dataArray[i] / 128.0;
        let y = (v * HEIGHT) / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(
        audioCanvas.current.width,
        audioCanvas.current.height / 2
      );
      canvasCtx.stroke();
    }
  };

  // Init useEffect.
  useEffect(() => {
    if (navigator.mediaDevices) {
      console.log("getUserMedia supported.");
      const constraints = { audio: true };

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          visualize(stream);

          //start the recording process
          let audioContext = new AudioContext();
          /*  assign to gumStream for later use  */
          let gumStream = stream;

          /* 
			Create the Recorder object and configure to record mono sound (1 channel)
			Recording 2 channels  will double the file size
		    */
          let input = audioContext.createMediaStreamSource(stream);
          let rec = new Recorder(input, { numChannels: 1 });
          setMediaRecorder(rec);
          //start the recording process
          rec.record();

          console.log("Recording started");
        })
        .catch((err) => {
          console.error("The following getUserMedia error occurred: " + err);
        });
    }
  }, []);

  return (
    <div className="audio-stream">
      <canvas
        id="audioCanvas"
        width="500"
        height="200"
        ref={audioCanvas}
      ></canvas>
      <div className="button-container">
        <button className="okButton" onClick={onSendEvent}>
          <FontAwesomeIcon icon={faCheck} />
        </button>
        <button className="cancelButton" onClick={onCloseEvent}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    </div>
  );
}
