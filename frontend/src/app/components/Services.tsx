"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

export default function Services({ showPackages = false }: { showPackages?: boolean }) {
  const [activeTab, setActiveTab] = useState("HAIRCUTS")

  const serviceCategories = [
    {
      id: "HAIRCUTS",
      title: "HAIRCUTS",
      services: [
        { name: "Regular Hair Cut", price: "$38", description: "" },
        { name: "Scissor Hair Cut", price: "$38", description: "" },
        { name: "Kid's Hair Cut", price: "$25", description: "" },
        { name: "Long Hair - Hair Cut", price: "$45", description: "" }
      ]
    },
    {
      id: "BEARDS & SHAVES",
      title: "BEARDS & SHAVES",
      services: [
        { name: "Classic Shave", price: "$32", description: "" },
        { name: "Beard Trim", price: "$18", description: "" },
        { name: "Royal Shave", price: "$40", description: "" },
        { name: "Hair Cut & Beard Trim", price: "$52", description: "" },
        { name: "Hair Cut & Shave", price: "$62", description: "" },
        { name: "Hair Cut & Wash", price: "$38", description: "" }
      ]
    },
    {
      id: "EXTRAS",
      title: "EXTRAS",
      services: [
        { name: "Fade", price: "$32", description: "" },
        { name: "Fade & Beard Trim", price: "$52", description: "" },
        { name: "Face Massage", price: "$20", description: "" },
        { name: "Men's Hair Color", price: "$37", description: "" },
        { name: "Line Up", price: "$15", description: "" },
        { name: "Men's Hair Cut & Color", price: "$73", description: "" }
      ]
    },
    // Only add PACKAGES tab when showPackages is true
    ...(showPackages ? [{
      id: "PACKAGES",
      title: "PACKAGES",
      services: [
        { name: "Starter Package", price: "$85", description: "Hair Cut, Beard Trim, Hot Towel, Hair Wash" },
        { name: "Premium Package", price: "$120", description: "Hair Cut, Royal Shave, Face Massage, Scalp Treatment, Styling Products" },
        { name: "Complete Package", price: "$150", description: "Hair Cut, Royal Shave, Face Massage, Scalp Treatment, Hair Color, Styling Products, Free Touch-up" }
      ]
    }] : [])
  ]

  const currentServices = serviceCategories.find(cat => cat.id === activeTab)?.services || []

  return (
    <section id="services" className="relative py-20 text-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/sec div pic.jpg"
          alt="Barber Shop Services Background"
          fill
          className="object-cover"
        />
        {/* Dark Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/70"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4 text-amber-400">BARBER SERVICES</h2>
          <p className="text-xl text-gray-300">Walk-ins and Bookings Welcome</p>
        </div>

        {/* Service Category Tabs */}
        <div className="flex justify-center mb-12">
          <div className="flex space-x-8 border-b border-gray-400 pb-2">
            {serviceCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`text-lg font-semibold transition-colors duration-300 pb-2 relative ${
                  activeTab === category.id
                    ? "text-white border-b-2 border-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {category.title}
                {activeTab === category.id && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Services Display */}
        <div className="max-w-4xl mx-auto">
          {activeTab === "PACKAGES" ? (
            // Compact Package Cards Display
            <div>
              {/* Packages Header */}
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold mb-2 text-amber-400">SPECIAL PACKAGES</h3>
                <p className="text-lg text-gray-300">Save money with our value packages</p>
              </div>
              
              {/* Package Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/30 hover:scale-105 transition-all duration-300">
                  <div className="text-center mb-4">
                    <h4 className="text-lg font-bold text-white mb-2">STARTER PACKAGE</h4>
                    <div className="flex items-center justify-center space-x-2 mb-1">
                      <span className="text-2xl font-bold text-amber-400">$85</span>
                      <span className="text-sm text-gray-400 line-through">$110</span>
                    </div>
                    <span className="text-xs text-green-400 font-semibold">Save $25</span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center">
                      <span className="text-amber-400 mr-2 text-sm">✓</span>
                      <span className="text-white text-xs">Hair Cut & Style</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-amber-400 mr-2 text-sm">✓</span>
                      <span className="text-white text-xs">Beard Trim & Shape</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-amber-400 mr-2 text-sm">✓</span>
                      <span className="text-white text-xs">Hot Towel Treatment</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-amber-400 mr-2 text-sm">✓</span>
                      <span className="text-white text-xs">Hair Wash & Conditioning</span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Link href="/booking" className="inline-block w-full bg-amber-400 text-black py-2 rounded-lg font-bold hover:bg-amber-300 transition-colors text-center text-sm">
                      Book Package
                    </Link>
                  </div>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border-2 border-amber-400 hover:scale-105 transition-all duration-300 relative">
                  <div className="text-center mb-4">
                    <h4 className="text-lg font-bold text-white mb-2">PREMIUM PACKAGE</h4>
                    <div className="flex items-center justify-center space-x-2 mb-1">
                      <span className="text-2xl font-bold text-amber-400">$120</span>
                      <span className="text-sm text-gray-400 line-through">$155</span>
                    </div>
                    <span className="text-xs text-green-400 font-semibold">Save $35</span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center">
                      <span className="text-amber-400 mr-2 text-sm">✓</span>
                      <span className="text-white text-xs">Hair Cut & Style</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-amber-400 mr-2 text-sm">✓</span>
                      <span className="text-white text-xs">Royal Shave</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-amber-400 mr-2 text-sm">✓</span>
                      <span className="text-white text-xs">Face Massage</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-amber-400 mr-2 text-sm">✓</span>
                      <span className="text-white text-xs">Scalp Treatment</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-amber-400 mr-2 text-sm">✓</span>
                      <span className="text-white text-xs">Premium Styling Products</span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Link href="/booking" className="inline-block w-full bg-amber-400 text-black py-2 rounded-lg font-bold hover:bg-amber-300 transition-colors text-center text-sm">
                      Book Package
                    </Link>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/30 hover:scale-105 transition-all duration-300">
                  <div className="text-center mb-4">
                    <h4 className="text-lg font-bold text-white mb-2">COMPLETE PACKAGE</h4>
                    <div className="flex items-center justify-center space-x-2 mb-1">
                      <span className="text-2xl font-bold text-amber-400">$150</span>
                      <span className="text-sm text-gray-400 line-through">$200</span>
                    </div>
                    <span className="text-xs text-green-400 font-semibold">Save $50</span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center">
                      <span className="text-amber-400 mr-2 text-sm">✓</span>
                      <span className="text-white text-xs">Hair Cut & Style</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-amber-400 mr-2 text-sm">✓</span>
                      <span className="text-white text-xs">Royal Shave</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-amber-400 mr-2 text-sm">✓</span>
                      <span className="text-white text-xs">Face Massage</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-amber-400 mr-2 text-sm">✓</span>
                      <span className="text-white text-xs">Scalp Treatment</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-amber-400 mr-2 text-sm">✓</span>
                      <span className="text-white text-xs">Hair Color</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-amber-400 mr-2 text-sm">✓</span>
                      <span className="text-white text-xs">Premium Styling Products</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-amber-400 mr-2 text-sm">✓</span>
                      <span className="text-white text-xs">Free Touch-up within 2 weeks</span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Link href="/booking" className="inline-block w-full bg-amber-400 text-black py-2 rounded-lg font-bold hover:bg-amber-300 transition-colors text-center text-sm">
                      Book Package
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Regular Services Display
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {currentServices.map((service, index) => (
                <div key={index} className="flex justify-between items-center py-4 border-b border-gray-400">
                  <span className="text-lg text-white">{service.name}</span>
                  <span className="text-xl font-bold text-amber-400">{service.price}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Book Now Button */}
        <div className="text-center mt-12">
          <Link href="/booking" className="inline-block bg-red-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-700 transition-colors text-lg">
            Book Now
          </Link>
        </div>
      </div>
    </section>
  );
}
