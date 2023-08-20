# Send and read email Nylas sample app

An implementation with Node Express.

## Requirements

- Node 18.0.0 or later (see [checking the Node version](#checking-the-nodejs-version))
- [a .env file with your Quickstart app secrets](#set-up-your-env-file)

## Running this app independently

### Set up your `.env` file

Go to the Nylas Dashboard, and choose the Quickstart Application.

Click **App Settings** to see the `client_id` and `client_secret` for the Quickstart app.

Add these to a `.env` in this directory as in the example below.

```yaml
# Nylas application keys - see https://developer.nylas.com/docs/developer-guide/authentication/authorizing-api-requests/#sdk-authentication
CLIENT_ID=client_id...
CLIENT_SECRET=client_secret...
```

### Install Node dependencies

Run the following command to install the Node dependencies for this sample app.

```bash
npm install
```

The `package.json` in this sample already includes the Nylas package. If you were installing this on your own app, you would add the package as a dependency by running:

`npm install --save nylas`

### Run the backend server locally

Start the backend server before you start the frontend. You will need two terminal sessions so you can run both at the same time.

```bash
npm start
```

Your backend server is now running on `localhost:9000` and you can now make API calls, or start a frontend for this sample application to run on top of it.
(See the README file in the `frontend` folder for more information.)

### Checking the Node.js version

To check which Node version you have, run the following command in your terminal:

```bash
node -v
```

If the command doesn't return a version, you might not have Node installed.

You can go to [nodejs.org](https://nodejs.org/en/) to download and set up Node (`v18.0.0` or later) on your machine. If you use a version manager for Node, use it to install Node 18.

Once you install node, run `node -v` again to confirm the version. You might need to restart your terminal for the changes to take effect.
