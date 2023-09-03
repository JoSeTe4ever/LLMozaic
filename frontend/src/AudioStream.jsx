import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import '../src/styles/AudioStream.css';

export default function AudioStream({ onClose }) {

    const onCloseEvent = () => {
        // Call the parent callback function
        onClose()
    }

    return (
        <div className="audio-stream">
            <canvas id="audio-canvas" width="400" height="200"></canvas>
            <div className="button-container">
                <button className='okButton'>
                    <FontAwesomeIcon icon={faCheck} />
                </button>
                <button className='cancelButton' onClick={onCloseEvent}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            </div>
        </div>
    )
}
