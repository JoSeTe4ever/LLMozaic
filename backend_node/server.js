const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const mockDb = require('./utils/mock-db');
const route = require('./route');

const Nylas = require('nylas');
const { WebhookTriggers } = require('nylas/lib/models/webhook');
const { Scope } = require('nylas/lib/models/connect');
const { openWebhookTunnel } = require('nylas/lib/services/tunnel');

dotenv.config();

const app = express();

// Enable CORS
app.use(cors());

// The port the express app will run on
const port = 9000;

// Middleware for errors
app.use((err, req, res, next) => {
	console.error('MIDDLEWARE ', err.stack);
	res.status(500).json({ error: 'Internal Server Error' + err.stack });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize the Nylas SDK using the client credentials
Nylas.config({
	clientId: process.env.NYLAS_CLIENT_ID,
	clientSecret: process.env.NYLAS_CLIENT_SECRET,
	apiServer: process.env.NYLAS_API_SERVER,
});

// Before we start our backend, we should register our frontend as a redirect
// URI to ensure the auth completes
const CLIENT_URI =
	process.env.CLIENT_URI || `http://localhost:${process.env.PORT || 3000}`;
Nylas.application({
	redirectUris: [CLIENT_URI],
}).then((applicationDetails) => {
	console.log(
		'Application registered. Application Details: ',
		JSON.stringify(applicationDetails)
	);
});

// Start the Nylas webhook
openWebhookTunnel({
	// Handle when a new message is created (sent)
	onMessage: function handleEvent(delta) {
		switch (delta.type) {
			case WebhookTriggers.MessageCreated:
				console.log(
					'Webhook trigger received, message created. Details: ',
					JSON.stringify(delta.objectData, undefined, 2)
				);
				break;
			case WebhookTriggers.AccountConnected:
				console.log(
					'Webhook trigger received, account connected. Details: ',
					JSON.stringify(delta.objectData, undefined, 2)
				);
				break;
		}
	},
}).then((webhookDetails) => {
	console.log('Webhook tunnel registered. Webhook ID: ' + webhookDetails.id);
});

// '/nylas/generate-auth-url': This route builds the URL for
// authenticating users to your Nylas application via Hosted Authentication
app.post('/nylas/generate-auth-url', express.json(), async (req, res) => {
	const { body } = req;

	const authUrl = Nylas.urlForAuthentication({
		loginHint: body.email_address,
		redirectURI: (CLIENT_URI || '') + body.success_url,
		scopes: [
			Scope.EmailModify,
			Scope.EmailSend,
			Scope.Calendar,
			Scope.Contacts,
		],
	});

	return res.send(authUrl);
});

// '/nylas/exchange-mailbox-token': This route exchanges an authorization
// code for an access token
// and sends the details of the authenticated user to the client
app.post('/nylas/exchange-mailbox-token', express.json(), async (req, res) => {
	const body = req.body;

	const { accessToken, emailAddress } = await Nylas.exchangeCodeForToken(
		body.token
	);

	// Normally store the access token in the DB
	console.log('Access Token was generated for: ' + emailAddress);

	// Replace this mock code with your actual database operations
	const user = await mockDb.createOrUpdateUser(emailAddress, {
		accessToken,
		emailAddress,
	});

	// Return an authorization object to the user
	return res.json({
		id: user.id,
		emailAddress: user.emailAddress,
	});
});

// Middleware to check if the user is authenticated
async function isAuthenticated(req, res, next) {
	if (!req.headers.authorization) {
		return res.status(401).json('Unauthorized');
	}

	// Query our mock db to retrieve the stored user access token
	const user = await mockDb.findUser(req.headers.authorization);

	if (!user) {
		return res.status(401).json('Unauthorized');
	}

	// Add the user to the response locals
	res.locals.user = user;

	next();
}

app.get('/nylas/greeting-info', isAuthenticated, (req, res, next) => {
	//log this to the console
	route.greetingInfo(req, res, next);
});

app.post('/nylas/create-draft', isAuthenticated, (req, res, next) => {
	route.createDraft(req, res, next);
});

app.get('/nylas/send-draft', isAuthenticated, (req, res, next) => {
	route.sendDraft(req, res, next);
});

app.delete('/nylas/delete-draft', isAuthenticated, (req, res, next) => {
	route.deleteDraft(req, res, next);
});

app.get('/nylas/read-drafts', isAuthenticated, (req, res, next) => {
	route.readDrafts(req, res, next);
});

app.get('/nylas/read-labels', isAuthenticated, (req, res, next) => {
	route.readLabels(req, res, next);
});

app.post('/nylas/send-email', isAuthenticated, (req, res, next) => {
	route.sendEmail(req, res, next);
});

app.get('/nylas/read-emails', isAuthenticated, (req, res, next) => {
	route.readEmails(req, res, next);
});

app.get('/nylas/message', isAuthenticated, async (req, res, next) => {
	route.getMessage(req, res, next);
});

app.get('/nylas/file', isAuthenticated, async (req, res, next) => {
	route.getFile(req, res, next);
});

// Add route for getting 20 latest calendar events
app.post(
	'/nylas/read-events',
	isAuthenticated,
	express.json(),
	(req, res, next) => {
		route.readEvents(req, res, next);
	}
);

app.get('/nylas/read-events', isAuthenticated, (req, res, next) => {
	route.getReadEvents(req, res, next);
});

// Add route for getting 20 latest calendar events
app.get('/nylas/read-calendars', isAuthenticated, (req, res, next) => {
	route.readCalendars(req, res, next);
});

// Add route for creating calendar events
app.post(
	'/nylas/create-events',
	isAuthenticated,
	express.json(),
	(req, res, next) => {
		route.createEvents(req, res, next);
	}
);

// Add route for getting all contacts
app.get(
	'/nylas/contacts',
	isAuthenticated,
	express.json(),
	(req, res, next) => {
		route.getAllContacts(req, res, next);
	}
);

app.get(
	'/nylas/contacts/{id}',
	isAuthenticated,
	express.json(),
	(req, res, next) => {
		route.getContactById(req, res, next);
	}
);

// Start listening on port 9000
app.listen(port, () => console.log('App listening on port ' + port));
