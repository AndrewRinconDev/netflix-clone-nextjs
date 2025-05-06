import { IMovie } from "@/types/media";

interface IVideoPlayerProps {
  movie: IMovie;
  autoPlay?: boolean;
  loop?: boolean;
  controls?: boolean;
  muted?: boolean;
  onBackClick?: () => void;
}

export default IVideoPlayerProps;
