"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useCart } from '../context/CartContext'
import Testimonials from '../components/Testimonials'
import Footer from '../components/Footer'
import { ShoppingCart, Loader2, AlertCircle } from 'lucide-react'

interface Product {
  id: number
  name: string
  price: number  // Now properly converted to number by backend
  description: string
  image: string
  stock_quantity: number
  is_featured: boolean
  sku: string
}

export default function ProductsPage() {
  const { addToCart, state: cartState } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [addingToCart, setAddingToCart] = useState<string | null>(null)

  // Helper function to format price
  const formatPrice = (price: number): string => {
    return price.toFixed(2)
  }

  // Fetch products from API
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:5000/api/products')
      const data = await response.json()
      
      if (data.success) {
        setProducts(data.data)
      } else {
        setError('Failed to load products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setError('Error loading products. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (product: Product) => {
    setAddingToCart(product.id.toString())
    
    try {
      // Convert product to cart format with stock info
      const cartItem = {
        id: product.id.toString(),
        name: product.name,
        price: `$${formatPrice(product.price)}`,
        description: product.description,
        image: product.image,
        category: 'product',
        stock_quantity: product.stock_quantity
      }
      
      const success = await addToCart(cartItem)
      
      if (success) {
        // Optional: Show success message
        console.log(`Added ${product.name} to cart`)
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setAddingToCart(null)
    }
  }

  // Group products for display
  const featuredProducts = products.filter(p => p.is_featured)
  const regularProducts = products.filter(p => !p.is_featured)

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section with sliding text */}
      <section className="relative h-96 bg-black overflow-hidden">
        <Image src="/images/top.jpg" alt="B&H Products" fill className="object-cover opacity-60" />
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <div className="w-full overflow-hidden whitespace-nowrap">
            <div className="inline-block text-[70px] font-bold text-white/30 uppercase tracking-widest whitespace-nowrap" style={{ animation: 'slide 200s linear infinite' }}>
              B&H PRODUCTS. B&H PRODUCTS. B&H PRODUCTS. B&H PRODUCTS. B&H PRODUCTS. B&H PRODUCTS. B&H PRODUCTS. B&H PRODUCTS. B&H PRODUCTS. B&H PRODUCTS. B&H PRODUCTS. B&H PRODUCTS. B&H PRODUCTS. B&H PRODUCTS. B&H PRODUCTS. B&H PRODUCTS. B&H PRODUCTS. B&H PRODUCTS. B&H PRODUCTS. B&H PRODUCTS.
            </div>
          </div>
        </div>
      </section>

      {/* Products Overview */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Premium Products</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional-grade products for every hair type and style
            </p>
          </div>

          {/* Cart Error Display */}
          {cartState.error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <p className="text-red-700">{cartState.error}</p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto mb-3" />
                <p className="text-gray-600 text-sm">Loading products...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex justify-center items-center py-12">
              <div className="text-center bg-red-50 p-6 rounded-lg">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
                <p className="text-red-600 mb-3 text-sm">{error}</p>
                <button 
                  onClick={fetchProducts}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
              
          {/* Featured Products */}
          {!loading && !error && featuredProducts.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">Featured Products</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {featuredProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-md shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="relative h-32">
                      <Image 
                        src={product.image} 
                        alt={product.name} 
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-1 right-1 bg-amber-500 text-white px-1.5 py-0.5 rounded text-xs font-semibold">
                        Featured
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-semibold mb-1 text-gray-900 line-clamp-1">{product.name}</h3>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                      <div className="flex flex-col gap-2">
                        <span className="text-lg font-bold text-red-600">${formatPrice(product.price)}</span>
                        <button 
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock_quantity === 0 || addingToCart === product.id.toString() || cartState.isLoading}
                          className={`flex items-center justify-center px-2 py-1.5 rounded text-xs font-semibold transition-colors ${
                            product.stock_quantity === 0
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : addingToCart === product.id.toString() || cartState.isLoading
                              ? 'bg-blue-400 text-white cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {addingToCart === product.id.toString() ? (
                            <Loader2 size={12} className="mr-1 animate-spin" />
                          ) : (
                            <ShoppingCart size={12} className="mr-1" />
                          )}
                          {product.stock_quantity === 0 
                            ? 'Out of Stock' 
                            : addingToCart === product.id.toString()
                            ? 'Adding...'
                            : 'Add to cart'
                          }
                        </button>
                      </div>
                      {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
                        <p className="text-orange-600 text-xs mt-1">Only {product.stock_quantity} left!</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Products */}
          {!loading && !error && regularProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">All Products</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {regularProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-md shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="relative h-32">
                      <Image 
                        src={product.image} 
                        alt={product.name} 
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-semibold mb-1 text-gray-900 line-clamp-1">{product.name}</h3>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                      <div className="flex flex-col gap-2">
                        <span className="text-lg font-bold text-red-600">${formatPrice(product.price)}</span>
                        <button 
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock_quantity === 0 || addingToCart === product.id.toString() || cartState.isLoading}
                          className={`flex items-center justify-center px-2 py-1.5 rounded text-xs font-semibold transition-colors ${
                            product.stock_quantity === 0
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : addingToCart === product.id.toString() || cartState.isLoading
                              ? 'bg-blue-400 text-white cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {addingToCart === product.id.toString() ? (
                            <Loader2 size={12} className="mr-1 animate-spin" />
                          ) : (
                            <ShoppingCart size={12} className="mr-1" />
                          )}
                          {product.stock_quantity === 0 
                            ? 'Out of Stock' 
                            : addingToCart === product.id.toString()
                            ? 'Adding...'
                            : 'Add to cart'
                          }
                        </button>
                      </div>
                      {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
                        <p className="text-orange-600 text-xs mt-1">Only {product.stock_quantity} left!</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Products */}
          {!loading && !error && products.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Available</h3>
              <p className="text-gray-600 text-sm">Check back soon for new products!</p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Footer */}
      <Footer />

      <style jsx>{`
        @keyframes slide {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </main>
  )
}
