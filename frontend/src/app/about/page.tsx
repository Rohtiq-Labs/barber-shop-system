"use client"

import Image from 'next/image'
import Testimonials from '../components/Testimonials'
import Footer from '../components/Footer'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-96 bg-black">
        <Image
          src="/images/top.jpg"
          alt="B&H Barbershop About"
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
             ABOUT B&H BARBERSHOP. ABOUT B&H BARBERSHOP. ABOUT B&H BARBERSHOP.ABOUT B&H BARBERSHOP. ABOUT B&H BARBERSHOP. ABOUT B&H BARBERSHOP. ABOUT B&H BARBERSHOP.ABOUT B&H BARBERSHOP. ABOUT B&H BARBERSHOP. ABOUT B&H BARBERSHOP. ABOUT B&H BARBERSHOP.ABOUT B&H BARBERSHOP. ABOUT B&H BARBERSHOP. ABOUT B&H BARBERSHOP. ABOUT B&H BARBERSHOP.ABOUT B&H BARBERSHOP. 
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">GROOMING GENERATIONS OF GENTELMEN</h2>
              <div className="space-y-4 text-lg text-gray-700">
                <p>
                B & H Barbershop gives the best quality haircuts and razor cut shaves.
                Our staff are hand-picked for their exceptional skills and are carefully trained to guarantee you always receive our high barber standard.
                </p>
              </div>
            </div>
          </div>
      </section>

        {/* Quote and Barber Section */}
        <section className="py-20 bg-amber-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center">
              <div className="bg-amber-100 p-16 rounded-l-lg shadow-lg relative z-10">
                <div className="mb-10">
                  <h3 className="text-4xl font-bold text-black mb-6 leading-tight">
                    "BEING A BARBER IS ABOUT TAKING CARE OF THE PEOPLE"
                  </h3>
                  <p className="text-xl text-black font-semibold">- Joseph, Owner/Master Barber</p>
                </div>
                
                <div className="space-y-6 text-black mb-10">
                  <p className="text-lg leading-relaxed">
                    Having been in the field our entire professional careers, our team has decades of cutting edge experience. Our skill-set allows us to surpass all our clients' needs and expectations. At B & H Barbershop, we maintain an excitement toward honing our abilities, developing new skills and staying abreast of current and historic grooming trends to keep ahead of the curve.
                  </p>
                  
                  <p className="text-lg leading-relaxed">
                    Our top priority is for each and every customer to be thrilled with the way they look in the mirror. So stop by B & H Barber shop in the East Village of NYC for your next and all future grooming experiences.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <button className="w-full bg-black text-white py-4 px-6 rounded-lg font-bold hover:bg-gray-800 transition-colors text-lg">
                    Book an Appointment
                  </button>
                  <button className="w-full bg-black text-white py-4 px-6 rounded-lg font-bold hover:bg-gray-800 transition-colors text-lg">
                    Barber Services
                  </button>
                </div>
              </div>
              
              <div className="relative lg:-ml-8">
                <div className="w-full h-[600px] rounded-r-lg overflow-hidden shadow-xl">
                  <Image
                    src="/images/barber man.jpg"
                    alt="Joseph - Owner/Master Barber"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>


      {/* Our Values */}
      <section className="py-24 bg-black text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6 tracking-wide">
              Our Values
            </h2>
            <div className="w-24 h-1 bg-amber-400 mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              These core values guide everything we do at B&H Barbershop.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="group bg-gradient-to-br from-gray-800 to-gray-900 p-10 rounded-2xl shadow-2xl border border-gray-700 hover:border-amber-400 transition-all duration-500 hover:scale-105 hover:shadow-amber-500/20">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">✂️</span>
                </div>
                <h3 className="text-3xl font-bold text-white">Tradition</h3>
              </div>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                We honor the time-honored techniques of classic barbering while staying 
                current with modern trends and styles.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-300 group-hover:text-white transition-colors duration-300">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mr-4"></span>
                  Classic scissor and clipper techniques
                </li>
                <li className="flex items-center text-gray-300 group-hover:text-white transition-colors duration-300">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mr-4"></span>
                  Straight razor shaving expertise
                </li>
                <li className="flex items-center text-gray-300 group-hover:text-white transition-colors duration-300">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mr-4"></span>
                  Traditional hot towel treatments
                </li>
              </ul>
            </div>
            
            <div className="group bg-gradient-to-br from-gray-800 to-gray-900 p-10 rounded-2xl shadow-2xl border border-gray-700 hover:border-amber-400 transition-all duration-500 hover:scale-105 hover:shadow-amber-500/20">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">🚀</span>
                </div>
                <h3 className="text-3xl font-bold text-white">Innovation</h3>
              </div>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                We embrace new techniques, products, and styles to provide the best 
                possible service to our clients.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-300 group-hover:text-white transition-colors duration-300">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mr-4"></span>
                  Modern styling techniques
                </li>
                <li className="flex items-center text-gray-300 group-hover:text-white transition-colors duration-300">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mr-4"></span>
                  Premium grooming products
                </li>
                <li className="flex items-center text-gray-300 group-hover:text-white transition-colors duration-300">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mr-4"></span>
                  Contemporary design aesthetic
                </li>
              </ul>
            </div>
            
            <div className="group bg-gradient-to-br from-gray-800 to-gray-900 p-10 rounded-2xl shadow-2xl border border-gray-700 hover:border-amber-400 transition-all duration-500 hover:scale-105 hover:shadow-amber-500/20">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">💎</span>
                </div>
                <h3 className="text-3xl font-bold text-white">Excellence</h3>
              </div>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                Every service we provide meets our high standards for quality, 
                attention to detail, and customer satisfaction.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-300 group-hover:text-white transition-colors duration-300">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mr-4"></span>
                  Meticulous attention to detail
                </li>
                <li className="flex items-center text-gray-300 group-hover:text-white transition-colors duration-300">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mr-4"></span>
                  Quality assurance in every cut
                </li>
                <li className="flex items-center text-gray-300 group-hover:text-white transition-colors duration-300">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mr-4"></span>
                  Continuous skill development
                </li>
              </ul>
            </div>
            
            <div className="group bg-gradient-to-br from-gray-800 to-gray-900 p-10 rounded-2xl shadow-2xl border border-gray-700 hover:border-amber-400 transition-all duration-500 hover:scale-105 hover:shadow-amber-500/20">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">🤝</span>
                </div>
                <h3 className="text-3xl font-bold text-white">Community</h3>
              </div>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                We're more than just a barbershop—we're a gathering place for our 
                East Village community.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-300 group-hover:text-white transition-colors duration-300">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mr-4"></span>
                  Local business partnerships
                </li>
                <li className="flex items-center text-gray-300 group-hover:text-white transition-colors duration-300">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mr-4"></span>
                  Community events and support
                </li>
                <li className="flex items-center text-gray-300 group-hover:text-white transition-colors duration-300">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mr-4"></span>
                  Welcoming atmosphere for all
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Footer */}
      <Footer />

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
    </main>
  )
}
