import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNylas } from '@nylas/nylas-react';

const NylasLogin = ({ email, setEmail }) => {
  const nylas = useNylas();

  const [isLoading, setIsLoading] = useState(false);

  const loginUser = (e) => {
    e.preventDefault();
    setIsLoading(true);

    sessionStorage.setItem('userEmail', email);

    nylas.authWithRedirect({
      emailAddress: email,
      successRedirectUrl: '',
    });
  };

  return (
    <section className="login">
      <form onSubmit={loginUser}>
        <input
          required
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Connecting...' : 'Connect email'}
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
