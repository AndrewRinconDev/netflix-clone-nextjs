'use client'
import React, { useEffect, useRef } from 'react'
import Image from 'next/image'

import logo from '@/assets/logo.png'
import search_icon from '@/assets/icons/search_icon.svg'
import bell_icon from '@/assets/icons/bell_icon.svg'
import caret_icon from '@/assets/icons/caret_icon.svg'
import profile_img from '@/assets/profile_img.png'
import { logout } from '@/firebase/firebase'

import './Navbar.styles.css'

const Navbar = () => {
  const navRef = useRef<HTMLDivElement | null>(null);

  useEffect(()=>{
    window.addEventListener('scroll', ()=>{
      if(window.scrollY >= 80){
        navRef.current?.classList.add('nav-dark')
      }else{
        navRef.current?.classList.remove('nav-dark')
      }
    })
  },[])

  return (
    <div ref={navRef} className='navbar'>
      <div className="navbar-left">
        <Image src={logo} alt="" />
        <ul>
          <li>Home</li>
          <li>TV Shows</li>
          <li>Movies</li>
          <li>New & Popular</li>
          <li>My List</li>
          <li>Browse by Languages</li>
        </ul>
      </div>
      <div className="navbar-right">
        <Image src={search_icon} alt="" className='icons' />
        <p>Children</p>
        <Image src={bell_icon} alt="" className='icons' />
        <div className="navbar-profile">
          <Image src={profile_img} alt="" className='profile' />
          <Image src={caret_icon} alt="" />
          <div className="dropdown">
            <p onClick={()=>{logout()}}>Sign Out of Netflix</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
