import { Fragment } from 'react'

// Wraps each word in its own span so it can be animated on its own. The words stay real text,
// so search engines, translation tools and screen readers read the sentence as normal.
export default function SplitWords({ text, accent }) {
  const words = text.split(' ')
  return words.map((word, i) => (
    <Fragment key={i}>
      <span className={`sw ${word === accent ? 'sw--accent' : ''}`} style={{ '--i': i }}>
        <span>{word}</span>
      </span>
      {i < words.length - 1 && ' '}
    </Fragment>
  ))
}
