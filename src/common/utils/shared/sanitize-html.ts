import sanitizeHtml from 'sanitize-html'

const sanitizeOptions = {
  allowedTags: [
    'a',
    'b',
    'blockquote',
    'br',
    'code',
    'del',
    'div',
    'em',
    'figure',
    'figcaption',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'hr',
    'i',
    'img',
    'kbd',
    'li',
    'ol',
    'p',
    'pre',
    's',
    'span',
    'strike',
    'sub',
    'sup',
    'table',
    'tbody',
    'td',
    'th',
    'thead',
    'tr',
    's',
    'strong',
    'u',
    'ul'
  ],
  allowedAttributes: {
    a: ['href', 'rel', 'target', 'title'],
    img: ['src', 'alt', 'title', 'width', 'height'],
    '*': ['class']
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel']
}

export function sanitizeHtmlContent(value?: string) {
  return value ? sanitizeHtml(value, sanitizeOptions).trim() : ''
}
