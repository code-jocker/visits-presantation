interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const Button = ({ 
  children, 
  onClick, 
  className = '',
  style = {},
  type = 'button',
  disabled = false
}: ButtonProps) => {
  return (
    <button 
      type={type}
      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 cursor-pointer ${className}`}
      style={style}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;