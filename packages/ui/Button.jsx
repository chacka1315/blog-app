function Button({ children, className = '', ...props }) {
  return (
    <button className={`blog-button ${className}`} {...props}>
      {children}
    </button>
  );
}

export default Button;
