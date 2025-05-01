
import Image from "next/image";

import netflix_spinner from "@/assets/netflix_spinner.gif";

import "./LoadingSpinner.styles.css";

function LoadingSpinner({width, height}: { width?: number; height?: number }) {
  return (
    <div className="loading-spinner">
      <Image src={netflix_spinner} alt="" width={width || 100} height={height || 90} />
    </div>
  )
}

export default LoadingSpinner;
