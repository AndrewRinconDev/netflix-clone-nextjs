import { FaArrowLeft } from "react-icons/fa";

import "./BackButton.styles.css";

interface IBackButtonProps {
  size?: number;
  onBackClick?: () => void;
}

function BackButton({ size, onBackClick }: IBackButtonProps) {
  return (
    <button className="back-button" onClick={onBackClick}>
      <FaArrowLeft className="back-icon" size={size || 20} />
    </button>
  );
}

export default BackButton;
