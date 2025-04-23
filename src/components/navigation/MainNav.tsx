'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'
import Search from './Search'
// import { Button } from '../ui/Button'

export default function MainNav() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'TV Shows', href: '/tv' },
    { name: 'Movies', href: '/movies' },
    { name: 'My List', href: '/my-list' },
  ]

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-b from-black to-transparent p-4">
      <div className="flex items-center justify-between">
        {/* Logo y Menú Mobile */}
        <div className="flex items-center space-x-4">
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaBars size={24} /> : <FaTimes size={24} />}
          </button>
          <Link href="/" className="text-red-600 font-bold text-2xl">
            NETFLIX
          </Link>
        </div>

        {/* Menú Desktop */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:text-gray-300 transition ${
                pathname === link.href ? 'text-white' : 'text-gray-400'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Search y User */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <Search />
          </div>
          {/* <Button variant="ghost" className="text-white"> */}
          <button className="text-white">
            Profile
          </button>
        </div>
      </div>

      {/* Menú Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black bg-opacity-90 mt-4 p-4 rounded-lg">
          <div className="mb-4">
            <Search />
          </div>
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`py-2 px-3 rounded hover:bg-gray-800 ${
                  pathname === link.href ? 'text-white' : 'text-gray-400'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}