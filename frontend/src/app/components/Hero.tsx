import Image from "next/image"
import Link from "next/link"

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/primary div pic.jpg"
          alt="Barber Shop Background"
          fill
          className="object-cover"
          priority
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl px-6 text-left">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white leading-tight">
          THE BEST CLASSIC BARBER SHOP IN EAST VILLAGE NYC.
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-200">
          Best Barber in East Village NYC.
        </p>
        <Link href="/booking" className="inline-block bg-red-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-700 transition-colors text-lg">
          Book Now
        </Link>
      </div>
    </section>
  );
}
  