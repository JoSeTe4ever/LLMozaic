import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import styles from '../src/styles/Home.module.css';
import AudioStream from './AudioStream';

export default function Chat({ greetingInfo }) {
	const [userInput, setUserInput] = useState('');
	const [history, setHistory] = useState([]);
	const [loading, setLoading] = useState(false);
	const [recording, setRecording] = useState(false);
	const [displayMessage, setDisplayMessage] = useState(false);
	const [initialMessageReceived, setInitialMessageReceived] = useState(false);
	const [currentMessage, setCurrentMessage] = useState('');
	const [firstMessageReceived, setFirstMessageReceived] = useState(false);

	const [messages, setMessages] = useState(
		greetingInfo
			? []
			: [
					{
						message: 'Hi there! How can I help?',
						type: 'apiMessage',
					},
			  ]
	);
	const [socketUrl, setSocketUrl] = useState(
		'ws://localhost:5000/ws?userId=' + sessionStorage.getItem('userId')
	);
	const { sendGreeting } = useWebSocket(socketUrl);
	const [messageHistory, setMessageHistory] = useState([]);
	const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
		onOpen: () => {
			console.log('opened ws://localhost:5000/ws');
			setDisplayMessage(() => false);
			setLoading(false);
			setCurrentMessage('');
		},
		onClosed: () => {
			setLoading(false);
		},
		onMessage: (e) => {
			console.log(e.data);
			setMessageHistory((prev) => prev.concat(e.data));
			setMessages((prevMessages) => [
				...prevMessages,
				{ message: e.data, type: 'apiMessage' },
			]);
		},
		shouldReconnect: (closeEvent) => true,
	});

	const messageListRef = useRef(null);
	const textAreaRef = useRef(null);
	const formButton = useRef(null);

	useEffect(() => {
		if (greetingInfo) {
			sendMessage(JSON.stringify(greetingInfo));
		}
	}, [greetingInfo]);

	useEffect(() => {
		if (lastMessage !== null) {
			// Establecer que se ha recibido el primer mensaje
			setInitialMessageReceived(true);

			setMessages((prevMessages) => [
				...prevMessages,
				{ message: lastMessage.data, type: 'apiMessage' },
			]);
		}
	}, [lastMessage]);

	const connectionStatus = {
		[ReadyState.CONNECTING]: 'Connecting',
		[ReadyState.OPEN]: 'Open',
		[ReadyState.CLOSING]: 'Closing',
		[ReadyState.CLOSED]: 'Closed',
		[ReadyState.UNINSTANTIATED]: 'Uninstantiated',
	}[readyState];

	// Auto scroll chat to bottom
	useEffect(() => {
		const messageList = messageListRef.current;
		messageList.scrollTop = messageList.scrollHeight;
	}, [messages]);

	// Init useEffect.
	// Focus on text field on load and init audio recording (check if browser supports it)
	useEffect(() => {
		textAreaRef.current.focus();
	}, []);

	// Handle form submission through WS
	const handleWSSubmit = async (e) => {
		e.preventDefault();

		if (userInput.trim() === '') {
			return;
		}

		setLoading(true);
		setMessages((prevMessages) => [
			...prevMessages,
			{ message: userInput, type: 'userMessage' },
		]);

		// Send user question and history to API
		sendMessage(userInput);
		// Reset user input
		setUserInput('');
	};

	// Handle errors
	const handleError = () => {
		setMessages((prevMessages) => [
			...prevMessages,
			{
				message: 'Oops! There seems to be an error. Please try again.',
				type: 'apiMessage',
			},
		]);
		setLoading(false);
		setUserInput('');
	};

	// Prevent blank submissions and allow for multiline input
	const handleEnter = (e) => {
		if (e.key === 'Enter' && userInput) {
			if (!e.shiftKey && userInput) {
				handleWSSubmit(e);
			}
		} else if (e.key === 'Enter') {
			e.preventDefault();
		}
	};

	const handleRecordClick = () => {
		setRecording(true);
		console.log('recorder started');
	};

	const handleRecorderClose = (event) => {
		if (event && event.length > 0) {
			console.log('desde el chat', event);
			setUserInput(event);

			setTimeout(() => {
				formButton.current.click();
			}, '100');
		}
		setRecording(false);
	};

	// Keep history in sync with messages
	useEffect(() => {
		if (messages.length >= 3) {
			setHistory([
				[
					messages[messages.length - 2].message,
					messages[messages.length - 1].message,
				],
			]);
		}
	}, [messages]);

	return (
		<>
			<main className={styles.main}>
				{/* Mostrar spinner si el primer mensaje aún no ha sido recibido */}
				{!initialMessageReceived && (
					<div className={styles.spinnerContainer}>
						<CircularProgress />
					</div>
				)}
				{/* Condición para mostrar el overlay */}
				{recording && (
					<div className={styles.RecordStreamOverlay}>
						<div className='overlay-content'>
							<AudioStream onClose={handleRecorderClose} />
						</div>
					</div>
				)}

				<div className={styles.cloud}>
					<div ref={messageListRef} className={styles.messagelist}>
						{messages.map((message, index) => {
							return (
								// The latest message sent by the user will be animated while waiting for a response
								<div
									key={index}
									className={
										message.type === 'userMessage' &&
										loading &&
										index === messages.length - 1
											? styles.usermessagewaiting
											: message.type === 'apiMessage'
											? styles.apimessage
											: styles.usermessage
									}
								>
									{/* Display the correct icon depending on the message type */}
									{message.type === 'apiMessage' ? (
										<img
											src='/ideogram.jpeg'
											alt='AI'
											width='80'
											height='80'
											className={styles.boticon}
										/>
									) : (
										<img
											src='/me.jpg'
											alt='Me'
											width='80'
											height='80'
											className={styles.usericon}
										/>
									)}
									<div className={styles.markdownanswer}>
										{/* Messages are being rendered in Markdown format */}
										<ReactMarkdown linkTarget={'_blank'}>
											{message.message}
										</ReactMarkdown>
									</div>
								</div>
							);
						})}
					</div>
				</div>
				<div className={styles.center}>
					<div className={styles.cloudform}>
						<form onSubmit={handleWSSubmit}>
							<textarea
								disabled={loading}
								onKeyDown={handleEnter}
								ref={textAreaRef}
								autoFocus={false}
								rows={1}
								maxLength={512}
								type='text'
								id='userInput'
								name='userInput'
								placeholder={
									loading ? 'Waiting for response...' : 'Type your question...'
								}
								value={userInput}
								onChange={(e) => setUserInput(e.target.value)}
								className={styles.textarea}
							/>

							<button
								ref={formButton}
								type='submit'
								disabled={loading}
								className={styles.generatebutton}
							>
								{loading ? (
									<div className={styles.loadingwheel}>
										<CircularProgress color='inherit' size={20} />{' '}
									</div>
								) : (
									// Send icon SVG in input field
									<>
										<svg
											viewBox='0 0 20 20'
											className={styles.svgicon}
											xmlns='http://www.w3.org/2000/svg'
										>
											<path d='M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z'></path>
										</svg>
									</>
								)}
							</button>
							{!loading ? (
								<FontAwesomeIcon
									icon={faMicrophone}
									className={styles.microButton}
									onClick={handleRecordClick}
								/>
							) : (
								<></>
							)}
						</form>
					</div>
					<div className={styles.footer}>
						<p>
							Powered by{' '}
							<a href='https://github.com/hwchase17/langchain' target='_blank'>
								LangChain
							</a>
							. Built by{' '}
							<a href='https://twitter.com/chillzaza_' target='_blank'>
								TEAM JOSE LUCIA FRAN
							</a>
							.
						</p>
					</div>
				</div>
			</main>
		</>
	);
}
