export default function sanitizeHtml(html) {
  return html;
}

sanitizeHtml.defaults = {
  allowedTags: ['p', 'a', 'span', 'h1', 'h2', 'img'],
  allowedAttributes: {
    'a': ['href', 'target'],
    'img': ['src', 'alt'],
  },
};
