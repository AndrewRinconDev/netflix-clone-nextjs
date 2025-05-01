import { isServerSide } from "./isServerSide";

export function getBaseUrl() {
  if (isServerSide()) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  } 
  
  return window.location.origin; 
}