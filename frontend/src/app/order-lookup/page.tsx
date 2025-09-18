"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Search, Package, Mail, Phone, Calendar, CreditCard, Truck, ArrowLeft } from 'lucide-react'

interface OrderItem {
  id: number
  product_name: string
  quantity: number
  price_per_item: number
  total_price: number
  image_url?: string
}

interface Order {
  id: number
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  subtotal: number
  tax_amount: number
  total_amount: number
  order_status: string
  payment_status: string
  payment_method: string
  created_at: string
  items: OrderItem[]
}

export default function OrderLookupPage() {
  const [searchType, setSearchType] = useState<'order_number' | 'email'>('order_number')
  const [searchValue, setSearchValue] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [order, setOrder] = useState<Order | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setOrder(null)
    setOrders([])

    if (!searchValue.trim()) {
      setError('Please enter a search value')
      return
    }

    setIsSearching(true)

    try {
      if (searchType === 'order_number') {
        // Search by order number
        const response = await fetch(`http://localhost:5000/api/orders/lookup/${searchValue.trim()}`)
        const data = await response.json()

        if (data.success) {
          setOrder(data.data)
        } else {
          setError('Order not found. Please check your order number and try again.')
        }
      } else {
        // Search by email
        const response = await fetch('http://localhost:5000/api/orders/customer-lookup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: searchValue.trim() })
        })
        const data = await response.json()

        if (data.success && data.data.length > 0) {
          setOrders(data.data)
        } else {
          setError('No orders found for this email address.')
        }
      }
    } catch (error) {
      console.error('Search error:', error)
      setError('Unable to search for orders. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'ready': return 'bg-green-100 text-green-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'refunded': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const OrderCard = ({ order: orderData }: { order: Order }) => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Order {orderData.order_number}</h3>
          <p className="text-gray-600 flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(orderData.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(orderData.order_status)}`}>
            {orderData.order_status.charAt(0).toUpperCase() + orderData.order_status.slice(1)}
          </span>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            ${orderData.total_amount.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Info */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Customer Information</h4>
          <div className="space-y-2 text-sm">
            <p className="flex items-center">
              <Package className="w-4 h-4 mr-2 text-gray-500" />
              {orderData.customer_name}
            </p>
            <p className="flex items-center">
              <Mail className="w-4 h-4 mr-2 text-gray-500" />
              {orderData.customer_email}
            </p>
            <p className="flex items-center">
              <Phone className="w-4 h-4 mr-2 text-gray-500" />
              {orderData.customer_phone}
            </p>
            <p className="flex items-start">
              <Truck className="w-4 h-4 mr-2 text-gray-500 mt-0.5" />
              <span>{orderData.shipping_address}</span>
            </p>
          </div>
        </div>

        {/* Payment Info */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Payment Information</h4>
          <div className="space-y-2 text-sm">
            <p className="flex items-center justify-between">
              <span>Payment Status:</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getPaymentStatusColor(orderData.payment_status)}`}>
                {orderData.payment_status.charAt(0).toUpperCase() + orderData.payment_status.slice(1)}
              </span>
            </p>
            <p className="flex items-center justify-between">
              <span>Method:</span>
              <span className="flex items-center">
                <CreditCard className="w-4 h-4 mr-1" />
                {orderData.payment_method.replace('_', ' ').charAt(0).toUpperCase() + orderData.payment_method.slice(1)}
              </span>
            </p>
            <div className="border-t pt-2 mt-2">
              <p className="flex justify-between">
                <span>Subtotal:</span>
                <span>${orderData.subtotal.toFixed(2)}</span>
              </p>
              <p className="flex justify-between">
                <span>Tax:</span>
                <span>${orderData.tax_amount.toFixed(2)}</span>
              </p>
              <p className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>${orderData.total_amount.toFixed(2)}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      {orderData.items && orderData.items.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold text-gray-900 mb-3">Items Ordered</h4>
          <div className="space-y-2">
            {orderData.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <span className="font-medium">{item.product_name}</span>
                  <span className="text-gray-500 ml-2">× {item.quantity}</span>
                </div>
                <span className="font-medium">${item.total_price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order Lookup</h1>
          <Link 
            href="/" 
            className="text-amber-600 hover:text-amber-700 font-medium flex items-center"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Search Form */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Find Your Order</h2>
            
            {/* Search Type Selector */}
            <div className="flex space-x-4 mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="order_number"
                  checked={searchType === 'order_number'}
                  onChange={(e) => setSearchType(e.target.value as 'order_number')}
                  className="mr-2"
                />
                <span>Order Number</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="email"
                  checked={searchType === 'email'}
                  onChange={(e) => setSearchType(e.target.value as 'email')}
                  className="mr-2"
                />
                <span>Email Address</span>
              </label>
            </div>

            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {searchType === 'order_number' ? 'Order Number' : 'Email Address'}
                </label>
                <input
                  type={searchType === 'order_number' ? 'text' : 'email'}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={searchType === 'order_number' ? 'e.g., BH1234567890' : 'your@email.com'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isSearching}
                className="w-full bg-amber-500 text-black py-2 px-4 rounded-lg font-semibold hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSearching ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search size={16} className="mr-2" />
                    Search Orders
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Single Order Result */}
        {order && (
          <div className="max-w-4xl mx-auto">
            <OrderCard order={order} />
          </div>
        )}

        {/* Multiple Orders Result */}
        {orders.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Found {orders.length} order{orders.length !== 1 ? 's' : ''}
            </h2>
            {orders.map((orderData) => (
              <OrderCard key={orderData.id} order={orderData} />
            ))}
          </div>
        )}

        {/* Help Section */}
        <div className="max-w-2xl mx-auto mt-12">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3">Need Help?</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>• Your order number was sent to your email after purchase</p>
              <p>• Use your email address to see all your recent orders</p>
              <p>• Contact us at (555) 123-4567 if you need assistance</p>
              <p>• Orders are typically ready for pickup within 24 hours</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
