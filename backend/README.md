# Send and read email Nylas sample app

A Python implementation with Flask.

## Requirements

- Python 3.7 or later
- [a .env file with your Quickstart app secrets](#set-up-your-env-file)

### Python set up

If you use a `python` backend for your demo application, make sure you have `python 3.7` or later installed. You can check what version you have by running:

```bash
python3 --version
```

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

### Create and activate a new virtual environment

**MacOS / Unix**

```bash
python3 -m venv env
source env/bin/activate
```

**Windows (PowerShell)**

```bash
python3 -m venv env
.\env\Scripts\activate.bat
```

### Install Python dependencies

Run the following command to install the Python dependencies for this sample app.

```bash
pip install -r requirements.txt
```

The `requirements.txt` in this sample already includes the Nylas package. If you were installing this on your own app, you would add the package as a dependency by running `pip install nylas`.

### Export and run the backend server locally

Set your Flask app file, and start the backend server.

**MacOS / Unix**

```bash
export FLASK_APP=server.py
python3 -m flask run --port=9000
```

**Windows (PowerShell)**

```bash
$env:FLASK_APP=server.py
python3 -m flask run --port=9000
```

Your backend server is now running on `localhost:9000` and you can now make API calls, or start a frontend for this sample application to run on top of it.

Start the backend before you start the frontend. You will need two terminal sessions so you can run both at the same time. (See the README file in the `frontend` folder for more information.)
