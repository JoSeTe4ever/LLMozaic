import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTimes,
  faRefresh,
  faBedPulse,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import "../src/styles/AudioStream.css";

export default function AudioStream({ onClose }) {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [urlBlob, setUrlBlob] = useState(null);
  const [transcription, setTranscription] = useState("");
  const audioCanvas = useRef();
  let audioCtx;
  var chunks = [];

  const onCloseEvent = () => {
    // Call the parent callback function
    onClose();
  };

  const onSendEvent = () => {
    console.log("send clicked");
    //tell the recorder to stop the recording
    mediaRecorder.stop();
    console.log("recorder stopped");
  };

  const onRetryEvent = () => {
    setIsLoading(false);
    setTranscription("");
    init()
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

  const init = () => {
    if (navigator.mediaDevices) {
      console.log("getUserMedia supported.");
      const constraints = { audio: true };

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          const mediaRecorder = new MediaRecorder(stream);
          visualize(stream);

          mediaRecorder.ondataavailable = function (e) {
            setIsLoading(true);
            chunks.push(e.data);
            const audioURL = window.URL.createObjectURL(e.data);
            setUrlBlob(audioURL);

            //name of .wav file to use during upload and download (without extendion)
            //var filename = new Date().toISOString()  + 'test.wav';
            var filename = new Date().getTime() + "_sentFile.ogg";
            //add controls to the <audio> element

            var xhr = new XMLHttpRequest();
            xhr.onload = function (e) {
              if (this.readyState === 4) {
                console.log("Server returned: ", e.target.responseText);
                setTranscription(e.target.responseText);
                setIsLoading(false);
              } else {
                setIsLoading(false);
              }
            };
            var fd = new FormData();
            fd.append("audio_data", e.data, filename);
            xhr.open("POST", "http://localhost:5000/speech2text", true);
            xhr.send(fd);
          };
          setMediaRecorder(mediaRecorder);
          mediaRecorder.start();
        })
        .catch((err) => {
          console.error("The following getUserMedia error occurred: " + err);
        });
    }
  };

  // Init useEffect.
  useEffect(() => {
    
    init();
  }, []);

  return (
    <div className="audio-stream">
      {isLoading == false && transcription.length == 0 ? (
        <>
          <span className="listening">Now Listening ...</span>
          <canvas
            id="audioCanvas"
            width="500"
            height="200"
            ref={audioCanvas}
          ></canvas>
        </>
      ) : isLoading == true ? (
        <div className="loader">
          <FontAwesomeIcon icon={faBedPulse} />
        </div>
      ) : (
        <></>
      )}

      {transcription?.length > 0 ? (
        <div className="transcription">{transcription}</div>
      ) : (
        <></>
      )}
      <div className="button-container">
        <button className="okButton" onClick={onSendEvent}>
          <FontAwesomeIcon icon={faCheck} />
          Send
        </button>

        <button className="refreshButton" onClick={onRetryEvent}>
          <FontAwesomeIcon icon={faRefresh} />
          Retry
        </button>

        <button className="cancelButton" onClick={onCloseEvent}>
          <FontAwesomeIcon icon={faTimes} />
          Cancel
        </button>
      </div>
    </div>
  );
}
