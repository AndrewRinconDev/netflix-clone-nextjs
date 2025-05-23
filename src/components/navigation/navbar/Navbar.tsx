"use client";
import React, { useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import logo from "@/assets/logo.png";
import search_icon from "@/assets/icons/search_icon.svg";
import bell_icon from "@/assets/icons/bell_icon.svg";
import caret_icon from "@/assets/icons/caret_icon.svg";
import profile_img from "@/assets/profile_img.png";
import { auth, logout } from "@/firebase/firebase";
import LoadingSpinner from "@/components/loadingSpinner/LoadingSpinner";

import "./Navbar.styles.css";

const Navbar = () => {
  const navRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY >= 80) {
        navRef.current?.classList.add("nav-dark");
      } else {
        navRef.current?.classList.remove("nav-dark");
      }
    });
  }, []);

  useEffect(() => {
    setIsClient(true);
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }
    });
  }, []);

  if (!isClient) {
    return <LoadingSpinner width={150} height={135} />;
  }

  return (
    <div ref={navRef} className="navbar">
      <div className="navbar-left">
        <Link href="/" className="logo">
          <Image src={logo} alt="" />
        </Link>

        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/">TV Shows</Link></li>
          <li><Link href="/">Movies</Link></li>
          <li><Link href="/">New & Popular</Link></li>
          <li><Link href="/">My List</Link></li>
          <li><Link href="/">Browse by Languages</Link></li>
        </ul>
      </div>
      <div className="navbar-right">
        <Image src={search_icon} alt="" className="icons" />
        <p>Children</p>
        <Image src={bell_icon} alt="" className="icons" />
        <div className="navbar-profile">
          <Image src={profile_img} alt="" className="profile" />
          <Image src={caret_icon} alt="" />
          <div className="dropdown">
            <p
              onClick={() => {
                logout();
              }}
            >
              Sign Out of Netflix
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
