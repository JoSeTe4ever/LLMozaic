import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './styles/calendar.scss';
import EventPreview from './EventPreview';
import { initializeScrollShadow, handleScrollShadows } from './utils/calendar';

function EventList({ setSelectedEvent, selectedEvent, isLoading, events }) {
  const [showTopScrollShadow, setShowTopScrollShadow] = useState(false);
  const [showBottomScrollShadow, setShowBottomScrollShadow] = useState(false);

  useEffect(() => {
    initializeScrollShadow('.event-list-container', setShowBottomScrollShadow);
  }, [events, isLoading]);

  useEffect(() => {
    window.addEventListener('resize', () =>
      initializeScrollShadow('.event-list-container', setShowBottomScrollShadow)
    );
  }, []);

  const handleEventSelect = (calendarEvent) => {
    setSelectedEvent(calendarEvent);
  };

  return (
    <section
      className="event-list-container scrollbar"
      onScroll={(event) =>
        handleScrollShadows(
          event,
          setShowTopScrollShadow,
          setShowBottomScrollShadow
        )
      }
    >
      <div
        className={`scroll-shadow top${showTopScrollShadow ? '' : ' hidden'}`}
      ></div>
      {events.length === 0 ? (
        <p className="loading-text">
          {isLoading
            ? 'Loading events.'
            : 'No events scheduled for the next 7 days.'}
        </p>
      ) : (
        <ul className="event-list">
          {events.map((calendarEvent) => (
            <div
              key={calendarEvent.id}
              onClick={() => handleEventSelect(calendarEvent)}
            >
              <EventPreview
                calendarEvent={calendarEvent}
                selectedEvent={selectedEvent}
              />
            </div>
          ))}
        </ul>
      )}
      <div
        className={`scroll-shadow bottom${
          showBottomScrollShadow ? '' : ' hidden'
        }`}
      ></div>
    </section>
  );
}

EventList.propTypes = {
  setSelectedEvent: PropTypes.func,
  selectedEvent: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  events: PropTypes.array.isRequired,
};

export default EventList;
