import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  const footerLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
    { name: "Products", href: "/products" },
    { name: "Contact", href: "/contact" }
  ]

  return (
    <footer className="bg-white text-gray-800 py-8 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Barbershop Information */}
          <div className="space-y-4">
            {/* Logo */}
            <div className="text-center lg:text-left">
              <div className="inline-block">
                <Link href="/">
                  <Image
                    src="/images/BH-BLACK-LOGO.png"
                    alt="B & H Barbershop Logo"
                    width={100}
                    height={35}
                    className="h-9 w-auto"
                  />
                </Link>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-2 text-xs">
              <div className="text-gray-700">
                199 East 4th St, New York NY 10009
              </div>
              <div className="text-gray-700">
                BandHBarbershop@gmail.com
              </div>
              <div className="text-gray-700">
                Tel: 646-896-1090
              </div>
            </div>

            {/* Hours of Operation */}
            <div className="space-y-1 text-xs">
              <div className="text-gray-700">M-Thur: 9:30am-7pm</div>
              <div className="text-gray-700">Fri: 9:30am to 2 Hrs before sunset</div>
              <div className="text-gray-700">Sat: CLOSED</div>
              <div className="text-gray-700">Sun: 10am to 7pm</div>
            </div>

            {/* Social Media Icons */}
            <div className="flex gap-2">
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xs">
                ★
              </div>
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold text-xs">
                G
              </div>
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold text-xs">
                f
              </div>
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xs">
                📷
              </div>
            </div>

            {/* Copyright */}
            <div className="text-xs text-gray-500 pt-2">
              2018-2025 Copyright B&H Barber Shop. All rights reserved.
            </div>
          </div>

          {/* Middle Column - Quick Links */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900">Quick Links</h3>
            <nav className="space-y-2">
              {footerLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block text-sm text-gray-600 hover:text-amber-600 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            
            {/* Additional Links */}
            <div className="space-y-2 pt-2">
              <Link href="/services" className="block text-sm text-gray-600 hover:text-amber-600 transition-colors">
                Haircuts
              </Link>
              <Link href="/services" className="block text-sm text-gray-600 hover:text-amber-600 transition-colors">
                Beard Grooming
              </Link>
              <Link href="/products" className="block text-sm text-gray-600 hover:text-amber-600 transition-colors">
                Grooming Products
              </Link>
              <Link href="/contact" className="block text-sm text-gray-600 hover:text-amber-600 transition-colors">
                Book Appointment
              </Link>
            </div>
          </div>

          {/* Right Column - Map Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900">
              Stop By And Get a Cut
            </h3>
            
            {/* Google Maps Embed */}
            <div className="w-full h-40 lg:h-48 bg-gray-100 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3617.9468807414164!2d67.04333307557872!3d24.933879442315487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33f827b9e7133%3A0x6c94bbcf32634547!2sBhayani%20Extension!5e0!3m2!1sen!2s!4v1755714372239!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="B & H Barber Shop Location"
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

