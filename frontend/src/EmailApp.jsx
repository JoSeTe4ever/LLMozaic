import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import EmailList from './EmailList';
import EmailDetail from './EmailDetail';
import SendEmails from './SendEmails';
import './styles/email.scss';

function EmailApp({
  userEmail,
  emails,
  isLoading,
  serverBaseUrl,
  userId,
  reloadEmail,
  setToastNotification,
}) {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [draftEmail, setDraftEmail] = useState(null);

  useEffect(() => {
    setSelectedEmail(null);
  }, [emails]);

  const composeEmail = () => {
    if (draftEmail) {
      // Open the existing draft email
      setDraftEmail((prev) => ({ ...prev, isOpen: true }));
    } else {
      // Create new draft email
      const currentDate = new Date();
      const newDraft = {
        object: 'draft',
        to: '',
        subject: '',
        body: '',
        last_message_timestamp: Math.floor(currentDate.getTime() / 1000),
        isOpen: true,
      };
      setDraftEmail(newDraft);
    }
    setSelectedEmail(null);
  };

  const onEmailSent = () => {
    setDraftEmail(null);
    reloadEmail();
    setToastNotification('success');
  };

  return (
    <>
      <div className="email-app">
        {isLoading ? (
          <p className="loading-text">Loading emails...</p>
        ) : emails.length ? (
          <>
            <EmailList
              emails={emails}
              selectedEmail={selectedEmail}
              setSelectedEmail={setSelectedEmail}
              composeEmail={composeEmail}
              draftEmail={draftEmail}
              setDraftEmail={setDraftEmail}
            />
            {draftEmail?.isOpen ? (
              <SendEmails
                userId={userId}
                draftEmail={draftEmail}
                setDraftEmail={(draftUpdates) =>
                  setDraftEmail((prev) => {
                    return {
                      ...prev,
                      ...draftUpdates,
                    };
                  })
                }
                onEmailSent={onEmailSent}
                setToastNotification={setToastNotification}
                discardComposer={() => setDraftEmail(null)}
              />
            ) : (
              <EmailDetail
                selectedEmail={selectedEmail}
                userEmail={userEmail}
                serverBaseUrl={serverBaseUrl}
                userId={userId}
                onEmailSent={onEmailSent}
                setToastNotification={setToastNotification}
              />
            )}
          </>
        ) : (
          <p className="loading-text">No available email</p>
        )}
      </div>
      <div className="mobile-warning hidden-desktop">
        <h2>
          Email sample app is currently designed for a desktop experience.
        </h2>
        <p>
          Visit Nylas dashboard for more use-cases: https://dashboard.nylas.com
        </p>
      </div>
    </>
  );
}

EmailApp.propTypes = {
  userEmail: PropTypes.string.isRequired,
  emails: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  serverBaseUrl: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  reloadEmail: PropTypes.func.isRequired,
  setToastNotification: PropTypes.func.isRequired,
};

export default EmailApp;
