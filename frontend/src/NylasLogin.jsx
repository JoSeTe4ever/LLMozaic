import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNylas } from "@nylas/nylas-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "react-tooltip";

const NylasLogin = ({ email, setEmail }) => {
  const nylas = useNylas();

  const [isLoading, setIsLoading] = useState(false);

  const optionsCursorTrueWithMargin = {
    followCursor: true,
    shiftX: 20,
    shiftY: 0,
  };

  const loginUser = (e) => {
    e.preventDefault();
    setIsLoading(true);
    sessionStorage.setItem("userEmail", email);

    nylas.authWithRedirect({
      emailAddress: email,
      successRedirectUrl: "",
    });
  };

  return (
    <section className="login">
      <form onSubmit={loginUser}>
        <img src="/Mosaic.jpeg" alt="logo" width="200" height="200" />
        <section className="titleSection">
          <h2 className="title">VIRTUAL ASSISTANT</h2>

          <FontAwesomeIcon
            icon={faInfoCircle}
            data-tooltip-id="my-tooltip-data-html"
            data-tooltip-html="  <p>
            <b>Virtual Assistant</b> <br>is a web application based in Nylas Sandbox
            API features, and OpenAI API abilities that allows you to manage
            your emails and calendar events in one place. <br> It provides you with a
            chat interface that displays your emails and calendar events in a
            single view.<br> You can also create new calendar events and send emails
            directly speaking to the virtual assistant.
          </p>"
          />
          <Tooltip id="my-tooltip-data-html" style={{ backgroundColor: "#063462", color: "white" }} />
        </section>

        <input
          required
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Connecting..." : "Connect email"}
        </button>
      </form>
    </section>
  );
};

NylasLogin.propTypes = {
  email: PropTypes.string.isRequired,
  setEmail: PropTypes.func.isRequired,
};
export default NylasLogin;
