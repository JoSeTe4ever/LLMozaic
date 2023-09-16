import React, { useState, useEffect } from 'react';
import { useNylas } from '@nylas/nylas-react';
import NylasLogin from './NylasLogin';
import CircularProgress from '@mui/material/CircularProgress';
import Layout from './components/Layout';
import Chat from './Chat';
import axios from 'axios';

function App() {
	const nylas = useNylas();
	const [userId, setUserId] = useState('');
	const [userEmail, setUserEmail] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [greetingInfo, setGreetingInfo] = useState(null); // New state for storing the response
	const [emails, setEmails] = useState([]);
	const [toastNotification, setToastNotification] = useState('');
	const SERVER_URI = import.meta.env.VITE_SERVER_URI || 'http://localhost:9000';

	useEffect(() => {
		if (!nylas) {
			return;
		}

		// Handle the code that is passed in the query params from Nylas after a successful login
		const params = new URLSearchParams(window.location.search);
		if (params.has('code')) {
			nylas
				.exchangeCodeFromUrlForToken()
				.then((user) => {
					const { id } = JSON.parse(user);
					setUserId(id);
					sessionStorage.setItem('userId', id);
				})
				.catch((error) => {
					console.error('An error occurred parsing the response:', error);
				});
		}
	}, [nylas]);

	useEffect(() => {
		const userIdString = sessionStorage.getItem('userId');
		const userEmail = sessionStorage.getItem('userEmail');
		if (userIdString) {
			setUserId(userIdString);
		}
		if (userEmail) {
			setUserEmail(userEmail);
		}
	}, []);

	useEffect(() => {
		if (userId?.length) {
			window.history.replaceState({}, '', `/?userId=${userId}`);
			//   getEmails();
		} else {
			window.history.replaceState({}, '', '/');
		}
	}, [userId]);

	const getEmails = async () => {
		setIsLoading(true);
		try {
			const url = SERVER_URI + '/nylas/read-emails';
			const res = await fetch(url, {
				method: 'GET',
				headers: {
					Authorization: userId,
					'Content-Type': 'application/json',
				},
			});
			const data = await res.json();
			if (Array.isArray(data)) {
				setEmails(data);
			} else {
				setEmails([]);
			}
		} catch (e) {
			console.warn(`Error retrieving emails:`, e);
			return false;
		}
		setIsLoading(false);
	};

	const disconnectUser = () => {
		sessionStorage.removeItem('userId');
		sessionStorage.removeItem('userEmail');
		setUserId('');
		setUserEmail('');
	};

	const refresh = () => {
		getEmails();
	};

	useEffect(() => {
		// Code where userId is obtained (this might be different in your case)
		if (userId) {
			console.log('UserId obtained:', userId); // Debugging

			// API call to greeting endpoint
			const ENDPOINT = SERVER_URI + '/nylas/greeting-info';
			axios
				.get(ENDPOINT, {
					headers: {
						Authorization: userId,
					},
				})
				.then((response) => {
					console.log('Response from greeting endpoint:', response.data); // Debugging
					setGreetingInfo(response.data);
				})
				.catch((error) => {
					console.log('Error fetching greeting info:', error); // Debugging
				});
		}
	}, [userId]); // Dependency array

	return (
		<Layout
			showMenu={!!userId}
			disconnectUser={disconnectUser}
			refresh={refresh}
			isLoading={isLoading}
			title=''
			toastNotification={toastNotification}
			setToastNotification={setToastNotification}
		>
			{!userId ? (
				<NylasLogin email={userEmail} setEmail={setUserEmail} />
			) : (
				<div className='app-card'>
					{greetingInfo ? (
						<Chat greetingInfo={greetingInfo} />
					) : (
						<div>
							<p>DEBUG: Loading user profile...</p>
							<div>
								<CircularProgress />
							</div>
						</div>
					)}{' '}
				</div>
			)}
		</Layout>
	);
}

export default App;
