// Pill button (a link when it has an href). On hover the fill grows from where the cursor
// entered, the label rolls over and the optional arrow flies out and back in.
export default function Button({ variant = 'cobalt', arrow = false, className = '', children, ...props }) {
  const Tag = props.href ? 'a' : 'button'
  return (
    <Tag className={`btn btn--${variant} ${className}`} data-magnetic="" {...props}>
      <span className="btn__label"><span>{children}</span></span>
      {arrow && (
        <span className="btn__arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M7 17L17 7M9 7h8v8" /></svg>
          <svg viewBox="0 0 24 24"><path d="M7 17L17 7M9 7h8v8" /></svg>
        </span>
      )}
    </Tag>
  )
}
