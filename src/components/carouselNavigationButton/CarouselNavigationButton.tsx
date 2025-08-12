import "./CarouselNavigationButton.style.css";

interface ICarouselNavigationButtonProps {
  direction: 'left' | 'right';
  scrollTo: (direction: 'left' | 'right') => void;
  category?: string;
}

const CarouselNavigationButton = ({ direction, scrollTo, category }: ICarouselNavigationButtonProps) => {
  return (
    <button
      className={`carousel-nav-btn carousel-nav-${direction}`}
      onClick={() => scrollTo(direction)}
      aria-label={`Scroll ${direction} in ${category}`}
    >
      {direction === 'left' ? "<" : ">"}
    </button>
  )
}

export default CarouselNavigationButton;