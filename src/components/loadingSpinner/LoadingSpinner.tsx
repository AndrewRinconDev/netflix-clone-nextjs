
import Image from "next/image";

import netflix_spinner from "@/assets/netflix_spinner.gif";

import "./loadingSpinner.style.css";

function LoadingSpinner() {
  return (
    <div className="loading-spinner">
      <Image src={netflix_spinner} alt="" />
    </div>
  )
}

export default LoadingSpinner;
