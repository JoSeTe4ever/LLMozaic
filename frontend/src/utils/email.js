import DOMPurify from 'dompurify';

export const cleanEmailBody = (body) => {
  if (!body) return '';

  let cleanedBody = DOMPurify.sanitize(body, { USE_PROFILES: { html: true } });
  return cleanedBody;
};
