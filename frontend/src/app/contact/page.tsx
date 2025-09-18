"use client"

import Image from 'next/image'

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-96 bg-black">
        <Image
          src="/images/contact-top-2.jpg"
          alt="B&H Barbershop Contact"
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
            CONTACT US B&H BARBERSHOP. CONTACT US B&H BARBERSHOP. CONTACT US B&H BARBERSHOP. CONTACT US B&H BARBERSHOP. CONTACT US B&H BARBERSHOP. CONTACT US B&H BARBERSHOP. CONTACT US B&H BARBERSHOP. CONTACT US B&H BARBERSHOP. CONTACT US B&H BARBERSHOP. CONTACT US B&H BARBERSHOP. CONTACT US B&H BARBERSHOP. CONTACT US B&H BARBERSHOP. CONTACT US B&H BARBERSHOP. CONTACT US B&H BARBERSHOP. CONTACT US B&H BARBERSHOP. CONTACT US B&H BARBERSHOP. CONTACT US B&H BARBERSHOP. CONTACT US B&H BARBERSHOP. CONTACT US B&H BARBERSHOP. CONTACT US B&H BARBERSHOP. CONTACT US B&H BARBERSHOP. CONTACT US B&H BARBERSHOP. CONTACT US B&H BARBERSHOP. CONTACT US B&H BARBERSHOP. CONTACT US B&H BARBERSHOP. 
            </div>
          </div>
        </div>
      </section>

      {/* FULL MAP DISPLAY */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Our Location</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Visit us in the heart of East Village, NYC
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Location Information Card */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-600">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">B & H Barber Shop</h3>
                  <p className="text-gray-300 text-lg">East Village Barbers</p>
                </div>
                
                <div className="space-y-4 mb-6">                
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 text-amber-400 mt-1">📍</div>
                    <div>
                      <p className="text-white font-medium">199 E 4th St</p>
                      <p className="text-gray-300">New York, NY 10009</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 text-amber-400">📞</div>
                    <span className="text-white font-medium">646-896-1090</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 text-amber-400">✉️</div>
                    <span className="text-white font-medium">BandHBarbershop@gmail.com</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <button className="w-full bg-amber-500 text-black py-3 px-4 rounded-lg font-semibold hover:bg-amber-400 transition-colors flex items-center justify-center space-x-2">
                    <span>→</span>
                    <span>Directions</span>
                  </button>
                  
                  <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="block text-center text-amber-400 hover:text-amber-300 text-sm font-medium">
                    View larger map
                  </a>
                </div>
              </div>
            </div>
            
            {/* Full Map Display */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-600">
                <div className="w-full h-[500px] bg-gray-700">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3617.9468807414164!2d67.04333307557872!3d24.933879442315487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33f827b9e7133%3A0x6c94bbcf32634547!2sBhayani%20Extension!5e0!3m2!1sen!2s!4v1755714372239!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="B & H Barber Shop Location - East Village NYC"
                    className="w-full h-full"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Left Column - Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Get In Touch</h2>
                <p className="text-lg text-gray-600 mb-8">
                  Have a question or want to book an appointment? We'd love to hear from you. 
                  Reach out to us using any of the methods below.
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">📍</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Address</h3>
                    <p className="text-gray-600">199 East 4th St, New York NY 10009</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">📞</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Phone</h3>
                    <p className="text-gray-600">646-896-1090</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">✉️</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">BandHBarbershop@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">⏰</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Hours</h3>
                    <div className="text-gray-600 space-y-1">
                      <p>M-Thur: 9:30am-7pm</p>
                      <p>Fri: 9:30am to 2 Hrs before sunset</p>
                      <p>Sat: CLOSED</p>
                      <p>Sun: 10am to 7pm</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors">
                    <span className="text-lg font-bold">G</span>
                  </a>
                  <a href="#" className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors">
                    <span className="text-lg font-bold">f</span>
                  </a>
                  <a href="#" className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors">
                    📷
                  </a>
                  <a href="#" className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors">
                    ★
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h3>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="John"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="john.doe@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Select a subject</option>
                    <option value="appointment">Book Appointment</option>
                    <option value="question">General Question</option>
                    <option value="feedback">Feedback</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-amber-600 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Find Us</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Located in the heart of East Village, we're easily accessible by subway, bus, or on foot.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Map */}
            <div className="w-full h-96 bg-gray-200 rounded-lg overflow-hidden">
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

            {/* Directions */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">Getting Here</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">🚇</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">By Subway</h4>
                    <p className="text-gray-600">F train to 2nd Avenue, 6 train to Astor Place</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">🚌</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">By Bus</h4>
                    <p className="text-gray-600">M8, M14A, M15, M21 routes all nearby</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">🚶</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">On Foot</h4>
                    <p className="text-gray-600">Walking distance from Washington Square Park</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">🚗</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">By Car</h4>
                    <p className="text-gray-600">Street parking available, meters accept cards</p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 p-6 rounded-lg">
                <h4 className="font-semibold text-amber-900 mb-2">Pro Tip</h4>
                <p className="text-amber-800 text-sm">
                  We recommend calling ahead for appointments, especially on weekends. 
                  Walk-ins are welcome but subject to availability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom CSS Animation */}
      <style jsx global>{`
        @keyframes slide {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </main>
  )
}



