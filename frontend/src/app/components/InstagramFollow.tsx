export default function InstagramFollow() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-4 tracking-wide">
              FOLLOWS US ON IG
            </h2>
            
            <p className="text-lg md:text-xl text-black font-medium">
              @bh_barbershop
            </p>
            
            <div className="mt-6">
              <a
                href="https://instagram.com/bh_barbershop"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 text-base shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Follow on Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

