import Link from "next/link"

export default function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gray-900 leading-tight">
            B & H Barber Shop in East Village NYC Excellent Grooming Services in a Modern Manner with over 15 years of experience.
          </h2>
          
          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            <p className="text-lg leading-relaxed">
            At B & H Barbershop, we maintain an excitement toward honing our abilities, developing new skills and staying abreast of current and historic grooming treads to keep ahead of the curve.
            </p>
            
            <p className="text-lg leading-relaxed">
            Our top priority is for each and every customer to be thrilled with the way they look in the mirror. So stop by B & H Barber shop in the East Village of NYC for your next and all future grooming experiences.
            </p>
            
            <p className="text-lg leading-relaxed">
            The best shaves and haircuts in Lower Manhattan NYC are carried out by the fantastic barbers at B & H Barber Shop. Stop by B & H Barber Shop in East Village NY and find out while we are some of the best barbers in the Lower East Side of NYC and East Village
            </p>
          </div>
          
          {/* Book Now Button */}
          <div className="text-center mt-12">
            <Link href="/booking" className="inline-block bg-red-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-700 transition-colors text-lg">
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
