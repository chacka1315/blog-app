export function LabeledInput({
  children,
  value,
  className = '',
  label,
  id = '',
  type = 'text',
  ...props
}) {
  return (
    <section className={`labeled-input ${className}`}>
      <label htmlFor={id}>{label}</label>
      <input id={id} type={type} value={value} {...props} />
      {children}
    </section>
  );
}
