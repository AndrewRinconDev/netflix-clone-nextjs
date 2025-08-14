import "./ErrorDisplay.styles.css";

interface IErrorDisplayProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
}

/**
 * Reusable error display component
 * Provides consistent error messaging across the application
 */
const ErrorDisplay = ({ 
  title = "Oops! Something went wrong", 
  message, 
  onRetry, 
  retryText = "Try Again" 
}: IErrorDisplayProps) => {
  return (
    <div className="error-container">
      <h2>{title}</h2>
      <p>{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry} 
          className="retry-button"
        >
          {retryText}
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;
