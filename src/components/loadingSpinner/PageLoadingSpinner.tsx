import Image from "next/image";
import netflix_spinner from "@/assets/netflix_spinner.gif";
import "./PageLoadingSpinner.styles.css";

function PageLoadingSpinner() {
  return (
    <div className="page-loading-spinner">
      <div className="loading-content">
        <Image 
          src={netflix_spinner} 
          alt="Loading..." 
          width={150} 
          height={135} 
          className="spinner-gif"
        />
        <div className="loading-text">
          <h2>Loading amazing content...</h2>
          <p>Preparing your Netflix experience</p>
        </div>
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}

export default PageLoadingSpinner;
