import React from 'react'
import Image from 'next/image'

import youtube_icon from '@/assets/icons/youtube_icon.png'
import twitter_icon from '@/assets/icons/twitter_icon.png'
import instagram_icon from '@/assets/icons/instagram_icon.png'
import facebook_icon from '@/assets/icons/facebook_icon.png'

import './Footer.style.css'

const Footer = () => {
  return (
    <div className='footer'>
      <div className="footer-icons">
        <Image src={facebook_icon} alt="" />
        <Image src={instagram_icon} alt="" />
        <Image src={twitter_icon} alt="" />
        <Image src={youtube_icon} alt="" />
      </div>
      <ul>
        <li>Audio Description</li>
        <li>Help Centre</li>
        <li>Gift Cards</li>
        <li>Media Centre</li>
        <li>Investor Relations</li>
        <li>Jobs</li>
        <li>Terms of Use</li>
        <li>Privacy</li>
        <li>Legal Notices</li>
        <li>Cookie Preferences</li>
        <li>Corporate Information</li>
        <li>Contact Us</li>
      </ul>
      <p className='copyright-text'>© 1997-2025 Netflix-Clone, Inc.</p>
    </div>
  )
}

export default Footer
