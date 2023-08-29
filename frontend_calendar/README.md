# Read and create calendar events Nylas sample app - Frontend

An implementation with React.

## Requirements

- Node 18.0.0 or later (see [checking the Node version](#checking-the-nodejs-version))

## Running this app independently

### Install Node dependencies

Run the following command to install the Node dependencies for this frontend sample app.

```bash
npm install
```

The `package.json` in this sample already includes the Nylas React package. If you were installing this on your own app, you would add the package as a dependency by running:

`npm install --save @nylas/nylas-react`

### Build the app

<!-- LR: is this step needed? I got by without it-->
```bash
npm run build
```

### Confirm that a backend is running

Start a backend server before you start the frontend. You will need two terminal sessions so you can run both at the same time.

Confirm that a backend API server is running on [http://localhost:9000](http://localhost:9000) (see the backend README for more information).

### Run the frontend server locally

Start the frontend client.

```bash
npm start
```

Visit the frontend client at [http://localhost:3000](http://localhost:3000) to try it out!

## Checking the Node.js version

To check which Node version you have, run the following command in your terminal:

```bash
node -v
```

If the command doesn't return a version, you might not have Node installed.

You can go to [nodejs.org](https://nodejs.org/en/) to download and set up Node (`v18.0.0` or later) on your machine. If you use a version manager for Node, use it to install Node 18.

Once you install node, run `node -v` again to confirm the version. You might need to restart your terminal for the changes to take effect.
