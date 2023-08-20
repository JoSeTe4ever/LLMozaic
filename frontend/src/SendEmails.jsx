import { useNylas } from '@nylas/nylas-react';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import IconDelete from './components/icons/IconDelete.jsx';

function SendEmails({
  userId,
  draftEmail,
  setDraftEmail,
  onEmailSent,
  setToastNotification,
  discardComposer,
  style,
}) {
  const nylas = useNylas();

  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    setTo(draftEmail.to);
    setSubject(draftEmail.subject);
    setBody(draftEmail.body);
  }, []);

  useEffect(() => {
    const updateTimer = setTimeout(function () {
      const currentDate = new Date();
      const draftUpdates = {
        to: to,
        subject,
        body,
        last_message_timestamp: Math.floor(currentDate.getTime() / 1000),
      };
      setDraftEmail(draftUpdates);
    }, 500);
    return () => clearTimeout(updateTimer);
  }, [to, subject, body]);

  const sendEmail = async ({ userId, to, body }) => {
    try {
      const url = nylas.serverBaseUrl + '/nylas/send-email';

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: userId,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...draftEmail, to, subject, body }),
      });

      if (!res.ok) {
        setToastNotification('error');
        throw new Error(res.statusText);
      }

      const data = await res.json();

      return data;
    } catch (error) {
      console.warn(`Error sending emails:`, error);
      setToastNotification('error');

      return false;
    }
  };

  const send = async (e) => {
    e.preventDefault();

    if (!userId) {
      return;
    }
    setIsSending(true);
    const message = await sendEmail({ userId, to, body });
    console.log('message sent', message);
    setIsSending(false);
    onEmailSent();
  };

  return (
    <form onSubmit={send} className={`email-compose-view ${style}`}>
      {!style && <h3 className="title">New message</h3>}
      <div className="input-container">
        <label className="input-label" htmlFor="To">
          To
        </label>
        <input
          aria-label="To"
          type="email"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        {!style && (
          <>
            <div className="line"></div>

            <label className="input-label" htmlFor="Subject">
              Subject
            </label>
            <input
              aria-label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <div className="line"></div>
          </>
        )}
      </div>
      <textarea
        className="message-body"
        aria-label="Message body"
        placeholder="Type your message..."
        rows={style === 'small' ? 3 : 20}
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />

      <div className="composer-button-group">
        <button
          className={`primary ${style}`}
          disabled={!to || !body || isSending}
          type="submit"
        >
          {isSending ? 'Sending...' : 'Send email'}
        </button>
        <button className="icon" onClick={discardComposer}>
          <IconDelete />
        </button>
      </div>
    </form>
  );
}

SendEmails.propTypes = {
  userId: PropTypes.string.isRequired,
  draftEmail: PropTypes.object.isRequired,
  setDraftEmail: PropTypes.func.isRequired,
  onEmailSent: PropTypes.func.isRequired,
  setToastNotification: PropTypes.func.isRequired,
  discardComposer: PropTypes.func.isRequired,
  style: PropTypes.string,
};

export default SendEmails;
