"use client"

import Image from 'next/image'
import Services from '../components/Services'
import Footer from '../components/Footer'
import Testimonials from '../components/Testimonials'

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-96 bg-black overflow-hidden">
        <Image
          src="/images/top.jpg"
          alt="Barbershop Services"
          fill
          className="object-cover opacity-60"
        />
        
        {/* Sliding Text Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <div className="w-full overflow-hidden whitespace-nowrap">
            <div 
              className="inline-block text-[70px] font-bold text-white/30 uppercase tracking-widest whitespace-nowrap"
              style={{
                animation: 'slide 200s linear infinite'
              }}
            >
              B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES. B&H SERVICES.
            </div>
          </div>
        </div>
      </section>

      {/* Services Component */}
      <Services showPackages={true} />

      {/* Why Choose Us */}
      <section className="py-20 bg-white text-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Why Choose B&H Barbershop?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine traditional barbering techniques with modern styling to deliver 
              exceptional results every time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👨‍💼</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Expert Barbers</h3>
              <p className="text-gray-600">Skilled professionals with years of experience</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧼</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Premium Products</h3>
              <p className="text-gray-600">High-quality grooming products and tools</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⏰</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Convenient Hours</h3>
              <p className="text-gray-600">Open 6 days a week to fit your schedule</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💯</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Satisfaction Guaranteed</h3>
              <p className="text-gray-600">We're not happy until you're happy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Component */}
      <Testimonials />

      {/* Custom CSS Animation */}
      <style jsx global>{`
        @keyframes slide {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
      <Footer />
    </main>
  )
}
