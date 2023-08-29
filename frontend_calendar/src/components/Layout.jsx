import React, { useState } from 'react';
import IconSync from './icons/IconSync.jsx';
import IconLogout from './icons/IconLogout.jsx';
import NylasLogo from './icons/nylas-logo-horizontal.svg';
import PropTypes from 'prop-types';

const Layout = ({
  children,
  showMenu = false,
  disconnectUser,
  refresh,
  isLoading,
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
        <h1>Calendar sample app</h1>
        {showMenu && (
          <div className="menu">
            <button
              onClick={handleRefresh}
              disabled={isLoading || isDisconnecting}
            >
              <div className={`menu-icon ${isLoading ? 'syncing' : ''}`}>
                <IconSync />
              </div>
              <span className="hidden-mobile">
                {isLoading ? 'Refreshing' : 'Refresh'}
              </span>
            </button>
            <div className="hidden-mobile">·</div>
            <button
              onClick={handleDisconnect}
              disabled={isLoading || isDisconnecting}
            >
              <div className="menu-icon">
                <IconLogout />
              </div>
              <span className="hidden-mobile">
                {isDisconnecting ? 'Disconnecting...' : 'Disconnect account'}
              </span>
            </button>
          </div>
        )}
      </div>
      <main>{children}</main>
      <footer>
        <div className="logo">
          POWERED BY
          <img src={NylasLogo} alt="Nylas Logo" />
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
};

export default Layout;
