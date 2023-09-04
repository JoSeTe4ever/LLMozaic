import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import '../src/styles/AudioStream.css';

export default function AudioStream({ onClose }) {

    const [isLoading, setIsLoading] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [mediaAudioEnabled, setMediaAudioEnabled] = useState(false);
    const audioCanvas = useRef();
    let chunks = [];
    let audioCtx;

    const onCloseEvent = () => {
        // Call the parent callback function
        onClose()
    }

    const onSendEvent = () => {
        mediaRecorder.stop();
        console.log(mediaRecorder.state);
        //onClose()
    }

    const onMediaRecorderStop = (e) => {
        console.log("data available after MediaRecorder.stop() called.");
        setIsLoading(true)

    }

    const onMediaDataAvailable = (e) => {
        chunks.push(e.data);
    }


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

        draw()

        function draw() {
            let canvasCtx = audioCanvas.current.getContext('2d');
            const WIDTH = audioCanvas.current.width
            const HEIGHT = audioCanvas.current.height;

            requestAnimationFrame(draw);

            analyser.getByteTimeDomainData(dataArray);

            canvasCtx.fillStyle = 'rgb(200, 200, 200)';
            canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

            canvasCtx.lineWidth = 3;
            canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

            canvasCtx.beginPath();

            let sliceWidth = WIDTH * 1.0 / bufferLength;
            let x = 0;
            for (let i = 0; i < bufferLength; i++) {

                let v = dataArray[i] / 128.0;
                let y = v * HEIGHT / 2;

                if (i === 0) {
                    canvasCtx.moveTo(x, y);
                } else {
                    canvasCtx.lineTo(x, y);
                }

                x += sliceWidth;
            }

            canvasCtx.lineTo(audioCanvas.current.width, audioCanvas.current.height / 2);
            canvasCtx.stroke();

        }
    }

    // Init useEffect.
    useEffect(() => {
        if (navigator.mediaDevices) {
            console.log("getUserMedia supported.");
            setMediaAudioEnabled(true);
            const constraints = { audio: true };

            navigator.mediaDevices
                .getUserMedia(constraints)
                .then((stream) => {
                    const mediaR = new MediaRecorder(stream);
                    setMediaRecorder(mediaR);

                    mediaR.onstop = onMediaRecorderStop;
                    mediaR.ondataavailable = onMediaDataAvailable;
                    //start recording
                    mediaR.start();
                    visualize(stream);
                    console.log(mediaR.state);
                    console.log("recorder started");
                })
                .catch((err) => {
                    console.error("The following getUserMedia error occurred: " + err);
                });
        }
    }, []);

    return (
        <div className="audio-stream">
           isLoading {{ isLoading }}
            <canvas id="audioCanvas" width="500" height="200" ref={audioCanvas}></canvas>
            <div className="button-container">
                <button className='okButton' onClick={onSendEvent}>
                    <FontAwesomeIcon icon={faCheck} />
                </button>
                <button className='cancelButton' onClick={onCloseEvent}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            </div>
        </div>
    )
}
