import Image from 'next/image'

import hero_banner from "@/assets/hero_banner.jpg";
import hero_title from "@/assets/hero_title.png";
import play_icon from "@/assets/icons/play_icon.png";
import info_icon from "@/assets/icons/info_icon.png";
import LinkButton from '../detailLink/DetailLink';

export default function HeroBanner() {
  return (
    <div className="hero">
    <Image src={hero_banner} alt="" className="banner-img" />
    <div className="hero-caption">
      <Image src={hero_title} alt="" className="caption-img" />
      <p>
        Discovering his ties to a secret ancient order, a young man living
        in modern Istanbul embarks on a quest to save the city from an
        immortal enemy.
      </p>
      <div className="hero-btns">
        <LinkButton href="/detail/e3fe8d54-9457-4340-8b22-2285761c21e1" className="btn text-black">
          <Image src={play_icon} alt="" />
          Play
        </LinkButton>
        <LinkButton href="/detail/e3fe8d54-9457-4340-8b22-2285761c21e1" className="btn dark-btn">
          <Image src={info_icon} alt="" />
          More Info
        </LinkButton>
      </div>
      {/* <Carousel category="Action" /> */}
    </div>
  </div>
  )
}