import React, { useState } from "react";
import IconSync from "./icons/IconSync.jsx";
import IconLogout from "./icons/IconLogout.jsx";
import NylasLogo from "./icons/nylas-logo-horizontal.svg";
import PropTypes from "prop-types";
import Toast from "./Toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "react-tooltip";

const Layout = ({
  children,
  showMenu = false,
  disconnectUser,
  refresh,
  isLoading,
  title,
  toastNotification,
  setToastNotification,
}) => {
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const handleRefresh = (e) => {
    e.preventDefault();
    refresh();
  };

  const handleDisconnect = (e) => {
    e.preventDefault();
    setIsDisconnecting(true);
    setTimeout(() => {
      disconnectUser();
      setIsDisconnecting(false);
    }, 1500);
  };

  return (
    <div className="layout">
      <div className="title-menu">
        <h1>{title || ""}</h1>

        <Toast
          toastNotification={toastNotification}
          setToastNotification={setToastNotification}
        />
        {showMenu && (
          <div className="menu">
            <button>
              <div
                className="menu-icon"
                data-tooltip-id="my-tooltip-data-html"
                data-tooltip-html="<p>
                  <p><b>Suggested prompts</b></p>
                  <p>
                    <br> Read my emails <br>Create an event today in my main calendar for working out <br>
                    Create a draft message for test@test.com<br> Create an image of a birthday cake and send it to test@test.com<br>
                    Summarize all the emails from test@test.com<br>
                    Send the latest created draft<br>   
                    Add a new contact called Jose, with email jose@test.com. Create a image of a cute cat for his contact url image<br>  
                  </p>
                  <br>  
                  <p><i>Got the idea? Use the Nylas API through natural language!</i></p>
                  <p><i>Mosaic also supports speech to text, check mic button</i></p>
                </p>"
              >
                <FontAwesomeIcon icon={faQuestionCircle} className="infoIcon" />
                Suggestions
              </div>
              <Tooltip
                id="my-tooltip-data-html"
                style={{ backgroundColor: "black", color: "white" }}
              />
            </button>

            <button
              onClick={handleRefresh}
              disabled={isLoading || isDisconnecting || toastNotification}
            >
              <div className={`menu-icon ${isLoading ? "syncing" : ""}`}>
                <IconSync />
              </div>
              <span className="hidden-mobile">
                {isLoading ? "Refreshing" : "Clean chat"}
              </span>
            </button>
            <div className="hidden-mobile">·</div>
            <button
              onClick={handleDisconnect}
              disabled={isLoading || isDisconnecting || toastNotification}
            >
              <div className="menu-icon">
                <IconLogout />
              </div>
              <span className="hidden-mobile">
                {isDisconnecting ? "Disconnecting..." : "Disconnect account"}
              </span>
            </button>
          </div>
        )}
      </div>
      <main>{children}</main>
      <footer>
        <div className="logo">
          POWERED BY
          <div>
            <img src={NylasLogo} alt="Nylas Logo" />
            <img
              className="openLogo"
              src="/public/openAPI.png"
              alt="Open API Logo"
            />
          </div>
        </div>
      </footer>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.element.isRequired,
  showMenu: PropTypes.bool.isRequired,
  disconnectUser: PropTypes.func,
  refresh: PropTypes.func,
  isLoading: PropTypes.bool.isRequired,
  title: PropTypes.string,
  toastNotification: PropTypes.string,
  setToastNotification: PropTypes.func.isRequired,
};

export default Layout;
