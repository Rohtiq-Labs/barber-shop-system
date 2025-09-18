'use client'
import { useState, useEffect } from 'react'

const testimonials = [
  {
    id: 1,
    name: "Mike Johnson",
    rating: 5,
    text: "Best barbershop in East Village! The attention to detail is incredible. My haircut always looks perfect and the atmosphere is great."
  },
  {
    id: 2,
    name: "David Chen",
    rating: 5,
    text: "Professional service and amazing results. The barbers here really know their craft. Highly recommend for anyone looking for quality grooming."
  },
  {
    id: 3,
    name: "Robert Martinez",
    rating: 5,
    text: "Been coming here for years. Consistent quality, friendly staff, and they always make sure you leave looking your best."
  },
  {
    id: 4,
    name: "James Wilson",
    rating: 5,
    text: "Outstanding service! The barbers are skilled professionals who take pride in their work. Clean shop and great vibes."
  },
  {
    id: 5,
    name: "Thomas Brown",
    rating: 5,
    text: "Excellent experience every time. They understand exactly what I want and deliver beyond expectations. Best barbershop hands down."
  },
  {
    id: 6,
    name: "Christopher Davis",
    rating: 5,
    text: "Top-notch grooming services. The attention to detail and customer service is unmatched. I always leave feeling confident and well-groomed."
  }
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 4000) // Change every 4 seconds

    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    )
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-400'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  return (
    <section className="relative py-12 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/images/contact-top-2.jpg)' }}>
      {/* Dark Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/60"></div>
      
      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            What Our Clients Say
          </h2>
          <p className="text-lg text-gray-300 max-w-xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </div>

        {/* Testimonials Carousel - Single Review Display */}
        <div className="relative max-w-2xl mx-auto">
          <div className="bg-black/80 backdrop-blur-sm border border-gray-600 rounded-lg p-6 text-center min-h-[200px] flex flex-col justify-center">
            <div className="flex justify-center mb-4">
              {renderStars(testimonials[currentIndex].rating)}
            </div>
            <p className="text-gray-300 text-base mb-4 italic leading-relaxed">
              "{testimonials[currentIndex].text}"
            </p>
            <div className="text-center">
              <p className="text-white font-semibold text-lg">
                {testimonials[currentIndex].name}
              </p>
            </div>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center mt-6 space-x-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                i === currentIndex ? 'bg-amber-400' : 'bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-300 z-20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-300 z-20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  )
}

