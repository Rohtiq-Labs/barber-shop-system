
"use client"

import { useCart } from '../context/CartContext'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react'
import { useState } from 'react'

export default function CartPage() {
  const { state, removeFromCart, updateQuantity, clearCart, getCartErrors, checkAllStock } = useCart()
  const [updatingItem, setUpdatingItem] = useState<string | null>(null)

  const handleQuantityUpdate = async (itemId: string, newQuantity: number) => {
    setUpdatingItem(itemId)
    try {
      await updateQuantity(itemId, newQuantity)
    } catch (error) {
      console.error('Error updating quantity:', error)
    } finally {
      setUpdatingItem(null)
    }
  }

  const handleRefreshStock = async () => {
    await checkAllStock()
  }

  const cartErrors = getCartErrors()

  if (state.items.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 pt-20" style={{
        backgroundImage: 'url(/images/card_image_07.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="container mx-auto px-4 py-20">
          <div className="text-center bg-white/90 backdrop-blur-sm rounded-lg p-8 shadow-lg">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={48} className="text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-lg text-gray-600 mb-8">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link 
              href="/products" 
              className="inline-flex items-center bg-amber-500 text-black px-8 py-3 rounded-lg font-semibold hover:bg-amber-400 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-20" style={{
      backgroundImage: 'url(/images/card_image_07.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleRefreshStock}
              disabled={state.isLoading}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              {state.isLoading ? (
                <Loader2 size={16} className="mr-2 animate-spin" />
              ) : (
                <AlertCircle size={16} className="mr-2" />
              )}
              {state.isLoading ? 'Checking...' : 'Check Stock'}
            </button>
            <Link 
              href="/products" 
              className="text-amber-600 hover:text-amber-700 font-medium flex items-center"
            >
              <ArrowLeft size={16} className="mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Cart Errors */}
        {(state.error || cartErrors.length > 0) && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            {state.error && (
              <div className="flex items-center mb-2">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <p className="text-red-700">{state.error}</p>
              </div>
            )}
            {cartErrors.length > 0 && (
              <div>
                <p className="font-semibold text-red-700 mb-2">Cart Issues:</p>
                <ul className="text-red-600 text-sm space-y-1">
                  {cartErrors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-black/80 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-white/90 mb-6">
                  Cart Items ({state.itemCount})
                </h2>
                
                <div className="space-y-4">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-900/60 rounded-lg border border-gray-700">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden relative flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white/90 truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-300/80 truncate">
                          {item.description}
                        </p>
                        <p className="text-lg font-bold text-amber-400 mt-1">
                          {item.price}
                        </p>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                          disabled={updatingItem === item.id || state.isLoading}
                          className="w-8 h-8 rounded-full bg-gray-700/80 hover:bg-gray-600/80 disabled:bg-gray-800/50 disabled:cursor-not-allowed flex items-center justify-center transition-colors text-white/90"
                        >
                          {updatingItem === item.id ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Minus size={16} />
                          )}
                        </button>
                        <span className="w-12 text-center font-semibold text-white/90">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                          disabled={updatingItem === item.id || state.isLoading || (item.stock_quantity && item.quantity >= item.stock_quantity)}
                          className="w-8 h-8 rounded-full bg-gray-700/80 hover:bg-gray-600/80 disabled:bg-gray-800/50 disabled:cursor-not-allowed flex items-center justify-center transition-colors text-white/90"
                        >
                          {updatingItem === item.id ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Plus size={16} />
                          )}
                        </button>
                      </div>
                      
                      {/* Stock Info */}
                      {item.stock_quantity !== undefined && (
                        <div className="text-xs text-gray-400 text-center">
                          {item.stock_quantity === 0 ? (
                            <span className="text-red-400">Out of stock</span>
                          ) : item.quantity >= item.stock_quantity ? (
                            <span className="text-orange-400">Max quantity</span>
                          ) : (
                            <span>{item.stock_quantity - item.quantity} more available</span>
                          )}
                        </div>
                      )}
                      
                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400 hover:text-red-300 p-2 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                </div>
                
                {/* Clear Cart Button */}
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <button
                    onClick={clearCart}
                    className="text-red-400 hover:text-red-300 font-medium text-sm"
                  >
                    Clear All Items
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-black/80 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700 p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-white/90 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-300/80">
                  <span>Subtotal ({state.itemCount} items)</span>
                  <span>${state.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300/80">
                  <span>Shipping</span>
                  <span className="text-green-400">Free</span>
                </div>
                <div className="flex justify-between text-gray-300/80">
                  <span>Tax</span>
                  <span>${(state.total * 0.0875).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between text-xl font-bold text-white/90">
                    <span>Total</span>
                    <span>${(state.total + (state.total * 0.0875)).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <Link
                href="/checkout"
                className="w-full bg-amber-500 text-black py-3 px-6 rounded-lg font-semibold hover:bg-amber-400 transition-colors text-center block"
              >
                Proceed to Checkout
              </Link>
              
              <p className="text-xs text-gray-400/80 text-center mt-4">
                Secure checkout powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
