import Image from "next/image"

export default function Hours() {
  return (
    <section className="py-20 bg-amber-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Section - Hours Information */}
            <div className="bg-amber-100 p-12 rounded-lg shadow-lg">
              <div className="text-center lg:text-left">
                <p className="text-sm font-medium text-gray-700 mb-4 tracking-wide">
                  WE TAKE GREAT PRIDE IN OUR CRAFT
                </p>
                
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                  HOURS OF GROOMING
                </h2>
                
                <div className="space-y-4 text-lg text-gray-800">
                  <div className="flex justify-between items-center py-3 border-b border-gray-300">
                    <span>MON - THURS:</span>
                    <span className="font-semibold">9:30am - 7:30pm</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-gray-300">
                    <span>FRIDAY:</span>
                    <span className="font-semibold">9:30am - 4pm</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-gray-300">
                    <span>SATURDAY:</span>
                    <span className="font-semibold text-red-600">CLOSED</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3">
                    <span>SUNDAY:</span>
                    <span className="font-semibold">10am - 7pm</span>
                  </div>
                </div>
                
                <div className="mt-8">
                  <button className="bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-lg w-full lg:w-auto">
                    Book an appointment
                  </button>
                </div>
              </div>
            </div>
            
            {/* Right Section - Barber Image */}
            <div className="relative">
              <div className="w-full h-96 lg:h-[500px] rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/images/great_pride_barber.jpg"
                  alt="Professional Barber at Work"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
