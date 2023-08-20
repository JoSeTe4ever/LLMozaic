import React from 'react';
import PropTypes from 'prop-types';
import EmailPreview from './EmailPreview';
import IconEdit from './components/icons/IconEdit.jsx';

function EmailList({
  emails,
  selectedEmail,
  setSelectedEmail,
  composeEmail,
  draftEmail,
  setDraftEmail,
}) {
  const handleEmailSelect = (thread) => {
    console.log('thread', thread);
    setSelectedEmail(thread);
    if (draftEmail?.isOpen) {
      setDraftEmail((prev) => {
        return { ...prev, isOpen: false };
      });
    }
  };

  const handleComposeEmail = () => {
    composeEmail();
  };

  return (
    <div className="email-list-view">
      <section className="title-container">
        <p className="title">Recent emails</p>
        <button
          className="primary small"
          onClick={handleComposeEmail}
          disabled={draftEmail?.isOpen}
        >
          <IconEdit />
          Compose
        </button>
      </section>
      <section className="email-list-container">
        {emails.length === 0 ? (
          <p>Loading emails.</p>
        ) : (
          <ul className="email-list">
            {draftEmail?.object === 'draft' && (
              <div onClick={handleComposeEmail}>
                <EmailPreview
                  thread={draftEmail}
                  selected={draftEmail?.isOpen}
                />
              </div>
            )}
            {emails.map((thread) => (
              <div key={thread.id} onClick={() => handleEmailSelect(thread)}>
                <EmailPreview
                  thread={thread}
                  selected={selectedEmail?.id === thread.id}
                />
              </div>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

EmailList.propTypes = {
  emails: PropTypes.array.isRequired,
  selectedEmail: PropTypes.object,
  setSelectedEmail: PropTypes.func,
  composeEmail: PropTypes.func.isRequired,
  draftEmail: PropTypes.object,
  setDraftEmail: PropTypes.func.isRequired,
};

export default EmailList;
