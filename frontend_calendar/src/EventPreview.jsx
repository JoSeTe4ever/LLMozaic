import React from 'react';
import PropTypes from 'prop-types';
import { displayMeetingTime, getEventDate } from './utils/date';

function EventPreview({ calendarEvent, selectedEvent }) {
  const eventDate = getEventDate(calendarEvent);
  const isActiveEvent = calendarEvent.id === selectedEvent?.id;

  return (
    <li className={`event-preview-container${isActiveEvent ? ' active' : ''}`}>
      <div className="event-content">
        <div className="date">
          <div className="day">{eventDate.getDate()}</div>
          <div className="month">
            {eventDate.toLocaleString('en-US', { month: 'short' })}
          </div>
        </div>
        <div className="summary">
          <div className="title truncate">{calendarEvent.title}</div>
          <div className="time">
            {calendarEvent.when.object === 'date'
              ? 'all day'
              : displayMeetingTime(calendarEvent.when)}
          </div>
        </div>
      </div>
    </li>
  );
}

EventPreview.propTypes = {
  calendarEvent: PropTypes.object.isRequired,
  selectedEvent: PropTypes.object,
};

export default EventPreview;
