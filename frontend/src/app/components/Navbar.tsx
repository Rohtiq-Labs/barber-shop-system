"use client"

import { useState } from "react"
import { Menu, X, ShoppingCart } from "lucide-react" // icons
import Image from "next/image"
import Link from "next/link"
import { useCart } from "../context/CartContext"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { state } = useCart()

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
    { name: "Products", href: "/products" },
    { name: "Orders", href: "/order-lookup" },
    { name: "Contact", href: "/contact" }
  ]

  const closeMenu = () => {
    setIsOpen(false)
  }

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-black/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
            <Image
              src="/images/BH-BLACK-LOGO.png"
              alt="Barber Shop Logo"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
            </Link>
          </div>

          {/* Right side: Book Now Button, Phone Number, Cart, and Hamburger Menu */}
          <div className="flex items-center space-x-4">
            {/* Book Now Button */}
            <Link
              href="/booking"
              className="bg-red-500 px-4 py-2 rounded-lg text-white hover:bg-red-600 transition"
            >
              Book Now
            </Link>

            {/* Phone Number */}
            <span className="text-white text-sm font-medium">
              646-896-1090
            </span>

            {/* Cart Icon */}
            <Link href="/cart" className="relative text-white hover:text-amber-400 transition">
              <ShoppingCart size={24} />
              {state.itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {state.itemCount}
                </span>
              )}
            </Link>

            {/* Hamburger Menu Button - Always Visible */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-red-500 transition"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </header>

      {/* Overlay Menu */}
      {isOpen && (
        <>
          {/* Translucent Background Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={closeMenu}
          />
          
          {/* Desktop: Centered Menu */}
          <div className="hidden md:flex fixed inset-0 z-50 items-center justify-center">
            <div className="bg-black/90 backdrop-blur-md rounded-2xl p-8 max-w-md w-full mx-4 relative">
              {/* Close Button */}
              <button
                onClick={closeMenu}
                className="absolute top-4 right-4 text-white hover:text-red-500 transition"
              >
                <X size={24} />
              </button>
              
              {/* Navigation Links */}
              <nav className="space-y-6 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block text-center text-2xl font-semibold text-amber-400 hover:text-amber-300 transition-colors duration-300"
                    onClick={closeMenu}
                  >
                    {link.name}
                  </Link>
                ))}
                                  {/* Book Now Button */}
                  <div className="border-t border-gray-700 pt-6">
                    <Link
                      href="/booking"
                      className="block text-center text-xl font-semibold bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors duration-300 mb-4"
                      onClick={closeMenu}
                    >
                      Book Now
                    </Link>
                  </div>
                  
                  {/* Cart and Checkout Links */}
                  <div className="border-t border-gray-700 pt-6 space-y-4">
                    <Link
                      href="/cart"
                      className="block text-center text-xl font-semibold text-white hover:text-amber-300 transition-colors duration-300 flex items-center justify-center gap-2"
                      onClick={closeMenu}
                    >
                      <ShoppingCart size={20} />
                      Cart ({state.itemCount})
                    </Link>
                  {state.itemCount > 0 && (
                    <Link
                      href="/checkout"
                      className="block text-center text-lg font-semibold bg-amber-500 text-black px-4 py-2 rounded-lg hover:bg-amber-400 transition-colors duration-300"
                      onClick={closeMenu}
                    >
                      Checkout
                    </Link>
                  )}
                </div>
              </nav>
            </div>
          </div>

          {/* Mobile: Left Side Menu */}
          <div className="md:hidden fixed inset-y-0 left-0 z-50 w-80 bg-black/95 backdrop-blur-md transform transition-transform duration-300 ease-in-out">
            <div className="h-full flex flex-col">
              {/* Close Button */}
              <div className="flex justify-end p-6">
                <button
                  onClick={closeMenu}
                  className="text-white hover:text-red-500 transition"
                >
                  <X size={24} />
                </button>
              </div>
              
              {/* Navigation Links */}
              <nav className="flex-1 px-6 py-8">
                <div className="space-y-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="block text-xl font-semibold text-amber-400 hover:text-amber-300 transition-colors duration-300 border-b border-gray-800 pb-4"
                      onClick={closeMenu}
                    >
                      {link.name}
                    </Link>
                  ))}
                  {/* Book Now Button */}
                  <div className="border-t border-gray-700 pt-6">
                    <Link
                      href="/booking"
                      className="block text-center text-lg font-semibold bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors duration-300 mb-4"
                      onClick={closeMenu}
                    >
                      Book Now
                    </Link>
                  </div>
                  
                  {/* Cart and Checkout Links */}
                  <div className="border-t border-gray-700 pt-6 space-y-4">
                    <Link
                      href="/cart"
                      className="block text-lg font-semibold text-white hover:text-amber-300 transition-colors duration-300 flex items-center gap-2 border-b border-gray-800 pb-4"
                      onClick={closeMenu}
                    >
                      <ShoppingCart size={18} />
                      Shopping Cart ({state.itemCount})
                    </Link>
                    {state.itemCount > 0 && (
                      <Link
                        href="/checkout"
                        className="block text-center text-md font-semibold bg-amber-500 text-black px-4 py-3 rounded-lg hover:bg-amber-400 transition-colors duration-300"
                        onClick={closeMenu}
                      >
                        Proceed to Checkout
                      </Link>
                    )}
                  </div>
                </div>
              </nav>
              
              {/* Bottom Section */}
              <div className="p-6 border-t border-gray-800">
                <div className="text-center text-gray-400 text-sm">
                  <p>Professional grooming services</p>
                  <p className="mt-2">for the modern gentleman</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

