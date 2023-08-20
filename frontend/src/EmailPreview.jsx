import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { formatPreviewDate } from './utils/date.js';
import AttachmentIcon from './components/icons/icon-attachment.svg';
import CalendarIcon from './components/icons/icon-calendar.svg';

function EmailPreview({ thread, selected }) {
  const [emailFrom, setEmailFrom] = useState('Unknown');
  const [hasAttachment, setHasAttachment] = useState(false);
  const [hasCalendar, setHasCalendar] = useState(false);

  useEffect(() => {
    if (thread?.messages?.length) {
      setEmailFrom(thread.messages[0].from?.[0]?.name || 'Unknown');

      checkFiles: for (const msg of thread.messages) {
        if (msg.files?.length) {
          for (const file of msg.files) {
            if (
              file.content_type.includes('calendar') ||
              file.content_type.includes('ics')
            ) {
              setHasCalendar(true);
            } else if (file.content_disposition === 'attachment') {
              setHasAttachment(true);
            }

            if (hasAttachment && hasCalendar) break checkFiles;
          }
        }
      }
    }

    if (thread?.object === 'draft') {
      setEmailFrom('(draft)');
    }
  }, [thread]);

  return (
    <li className={`email-preview-container ${selected ? 'selected' : ''}`}>
      <div className="email-content">
        <p className="sender">
          {emailFrom}
          <span className="message-count">
            {thread.messages?.length > 1 ? thread.messages?.length : ''}
          </span>
        </p>
        <div className="subject-container">
          <p className="subject">{thread.subject || '(no subject)'}</p>
        </div>
        <p className="snippet">
          {thread?.object === 'draft' ? thread.body : thread.snippet}
        </p>
      </div>
      <div className="email-info">
        {hasCalendar && (
          <img src={CalendarIcon} alt="calendar icon" width="20" />
        )}
        {hasAttachment && (
          <img src={AttachmentIcon} alt="attachment icon" width="20" />
        )}
        <div className="time">
          {formatPreviewDate(
            new Date(Math.floor(thread.last_message_timestamp * 1000))
          )}
        </div>
      </div>
    </li>
  );
}

EmailPreview.propTypes = {
  thread: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
};

export default EmailPreview;
