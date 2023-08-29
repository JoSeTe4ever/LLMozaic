import DOMPurify from 'dompurify';

export const initializeScrollShadow = (cssSelector, setBottomShadow) => {
  const scrollElement = document.querySelector(cssSelector);
  const isScrollable =
    scrollElement?.scrollHeight !== scrollElement?.clientHeight;

  setBottomShadow(isScrollable);
};

export const handleScrollShadows = (event, setTopShadow, setBottomShadow) => {
  const element = event.target;
  const atTop = element?.scrollTop < 12;
  const atBottom =
    element?.clientHeight + element?.scrollTop + 12 > element?.scrollHeight;

  setTopShadow(!atTop);
  setBottomShadow(!atBottom);
};

export const getOrganizerString = (event) => {
  const name = event.organizer_name;
  const email = event.organizer_email;
  return name ? `${name} (${email})` : email;
};

export const getParticipantsString = (event) => {
  const participantCount = event.participants.length;
  return `${participantCount} participant${participantCount === 1 ? '' : 's'}`;
};

export const cleanDescription = (description) => {
  if (!description) return 'No description.';

  let cleanedDescription = DOMPurify.sanitize(description, {
    USE_PROFILES: { html: true },
  });
  return cleanedDescription;
};

export const isValidUrl = (str) => {
  let url;
  try {
    url = new URL(str);
  } catch (_) {
    return false;
  }
  return url;
};

export const dividerBullet = `\u00a0 · \u00a0`;

export const capitalizeString = (str) =>
  `${str[0].toUpperCase()}${str.slice(1)}`;
