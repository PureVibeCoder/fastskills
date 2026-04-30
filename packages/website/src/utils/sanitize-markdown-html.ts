import sanitizeHtml from 'sanitize-html';

const options: sanitizeHtml.IOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'img',
    'pre',
    'code',
    'kbd',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
    'hr',
    'del',
    'input'
  ]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    a: ['href', 'name', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height'],
    code: ['class'],
    input: ['type', 'checked', 'disabled']
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  allowProtocolRelative: false
};

export function sanitizeMarkdownHtml(html: string): string {
  return sanitizeHtml(html, options);
}
