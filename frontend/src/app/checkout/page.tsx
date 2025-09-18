"use client"

import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import Link from 'next/link'
import { ArrowLeft, CreditCard, Truck, Shield, CheckCircle, AlertCircle, Loader2, Package, Mail, Phone } from 'lucide-react'

interface OrderData {
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  payment_method: string
  notes: string
}

interface OrderResponse {
  success: boolean
  message: string
  data: {
    order_id: number
    order_number: string
    total_amount: number
  }
}

export default function CheckoutPage() {
  const { state, clearCart, getCartErrors, checkAllStock } = useCart()
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  })
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderData, setOrderData] = useState<OrderResponse['data'] | null>(null)
  const [checkingStock, setCheckingStock] = useState(false)
  const [orderError, setOrderError] = useState('')

  // Check stock on page load
  useEffect(() => {
    if (state.items.length > 0) {
      setCheckingStock(true)
      checkAllStock().finally(() => setCheckingStock(false))
    }
  }, [])

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {}

    // Required fields validation
    if (!formData.firstName.trim()) errors.firstName = 'First name is required'
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required'
    if (!formData.email.trim()) errors.email = 'Email is required'
    if (!formData.phone.trim()) errors.phone = 'Phone number is required'
    if (!formData.address.trim()) errors.address = 'Address is required'
    if (!formData.city.trim()) errors.city = 'City is required'
    if (!formData.state.trim()) errors.state = 'State is required'
    if (!formData.zipCode.trim()) errors.zipCode = 'ZIP code is required'
    if (!formData.cardNumber.trim()) errors.cardNumber = 'Card number is required'
    if (!formData.expiryDate.trim()) errors.expiryDate = 'Expiry date is required'
    if (!formData.cvv.trim()) errors.cvv = 'CVV is required'
    if (!formData.cardName.trim()) errors.cardName = 'Cardholder name is required'

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    const cleanPhone = formData.phone.replace(/[-\s\(\)]/g, '')
    if (formData.phone && (cleanPhone.length < 10 || !phoneRegex.test(cleanPhone))) {
      errors.phone = 'Please enter a valid phone number'
    }

    // Card number validation (basic)
    const cleanCard = formData.cardNumber.replace(/\s/g, '')
    if (formData.cardNumber && (cleanCard.length < 13 || cleanCard.length > 19)) {
      errors.cardNumber = 'Please enter a valid card number'
    }

    // Expiry date validation (MM/YY format)
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/
    if (formData.expiryDate && !expiryRegex.test(formData.expiryDate)) {
      errors.expiryDate = 'Please enter date in MM/YY format'
    }

    // CVV validation
    if (formData.cvv && (formData.cvv.length < 3 || formData.cvv.length > 4)) {
      errors.cvv = 'CVV must be 3 or 4 digits'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const cleanValue = value.replace(/\s/g, '')
      const formattedValue = cleanValue.replace(/(.{4})/g, '$1 ').trim()
      setFormData(prev => ({ ...prev, [name]: formattedValue }))
    }
    // Format expiry date
    else if (name === 'expiryDate') {
      let formattedValue = value.replace(/\D/g, '')
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.substring(0, 2) + '/' + formattedValue.substring(2, 4)
      }
      setFormData(prev => ({ ...prev, [name]: formattedValue }))
    }
    // Format phone number
    else if (name === 'phone') {
      const cleanValue = value.replace(/\D/g, '')
      let formattedValue = cleanValue
      if (cleanValue.length >= 6) {
        formattedValue = `(${cleanValue.substring(0, 3)}) ${cleanValue.substring(3, 6)}-${cleanValue.substring(6, 10)}`
      } else if (cleanValue.length >= 3) {
        formattedValue = `(${cleanValue.substring(0, 3)}) ${cleanValue.substring(3)}`
      }
      setFormData(prev => ({ ...prev, [name]: formattedValue }))
    }
    else {
    setFormData(prev => ({ ...prev, [name]: value }))
    }

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setOrderError('')
    
    // Validate form
    if (!validateForm()) {
      return
    }

    // Check for cart errors
    const cartErrors = getCartErrors()
    if (cartErrors.length > 0) {
      setOrderError(`Cart issues: ${cartErrors.join(', ')}`)
      return
    }

    setIsProcessing(true)
    
    try {
      // Final stock check before processing
      await checkAllStock()
      
      // Check for cart errors again after stock check
      const updatedCartErrors = getCartErrors()
      if (updatedCartErrors.length > 0) {
        throw new Error(`Stock issues: ${updatedCartErrors.join(', ')}`)
      }

      // Prepare order data
      const orderData: OrderData = {
        customer_name: `${formData.firstName} ${formData.lastName}`.trim(),
        customer_email: formData.email,
        customer_phone: formData.phone.replace(/[-\s\(\)]/g, ''), // Clean phone for API
        shipping_address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
        payment_method: 'credit_card',
        notes: `Card: ***${formData.cardNumber.slice(-4)} | Name: ${formData.cardName}`
      }

      // Prepare items for API
      const items = state.items.map(item => ({
        product_id: parseInt(item.id),
        quantity: item.quantity
      }))

      console.log('Creating order with data:', { orderData, items })

      // Create order via API
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderData, items })
      })

      const data: OrderResponse = await response.json()
      
      if (data.success) {
        // Order created successfully
        setOrderData(data.data)
        clearCart() // Clear the cart
        setOrderComplete(true)
        
        // Store order info for confirmation
        localStorage.setItem('lastOrder', JSON.stringify(data.data))
        
        console.log('Order created successfully:', data.data)
      } else {
        throw new Error(data.message || 'Failed to create order')
      }
    } catch (error) {
      console.error('Order creation error:', error)
      setOrderError((error as Error).message || 'Failed to process order. Please try again.')
    } finally {
    setIsProcessing(false)
    }
  }

  // Show empty cart message
  if (state.items.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center bg-white rounded-lg p-8 shadow-lg">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">No Items to Checkout</h1>
            <p className="text-gray-600 mb-8">
              Your cart is empty. Please add some products first.
            </p>
            <Link 
              href="/products" 
              className="inline-flex items-center bg-amber-500 text-black px-8 py-3 rounded-lg font-semibold hover:bg-amber-400 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Products
            </Link>
          </div>
        </div>
      </main>
    )
  }

  // Show order completion
  if (orderComplete && orderData) {
    return (
      <main className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center bg-white rounded-lg p-8 shadow-lg">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} className="text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Complete!</h1>
            <p className="text-lg text-gray-600 mb-6">
              Thank you for your order. You will receive a confirmation email shortly.
            </p>

            {/* Order Details */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Order Number</p>
                  <p className="font-bold text-lg text-gray-900">{orderData.order_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                  <p className="font-bold text-lg text-green-600">${orderData.total_amount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Order ID</p>
                  <p className="font-bold text-lg text-gray-900">#{orderData.order_id}</p>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-blue-900 mb-4">What happens next?</h3>
              <div className="space-y-3 text-sm text-blue-800">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>You'll receive an email confirmation within 5 minutes</span>
                </div>
                <div className="flex items-center">
                  <Package className="w-4 h-4 mr-2" />
                  <span>Your order will be prepared within 24 hours</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>We'll contact you when your order is ready for pickup</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Link 
                href="/products" 
                className="inline-flex items-center bg-amber-500 text-black px-8 py-3 rounded-lg font-semibold hover:bg-amber-400 transition-colors"
              >
                Continue Shopping
              </Link>
              <div>
                <Link 
                  href="/" 
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Return to Homepage
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const subtotal = state.total
  const tax = subtotal * 0.0875
  const total = subtotal + tax
  const cartErrors = getCartErrors()

  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <Link 
            href="/cart" 
            className="text-amber-600 hover:text-amber-700 font-medium flex items-center"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Cart
          </Link>
        </div>

        {/* Stock Checking */}
        {checkingStock && (
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <Loader2 className="w-5 h-5 text-blue-500 mr-2 animate-spin" />
              <p className="text-blue-700">Checking product availability...</p>
            </div>
          </div>
        )}

        {/* Cart Errors */}
        {cartErrors.length > 0 && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center mb-2">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="font-semibold text-red-700">Cart Issues:</p>
            </div>
            <ul className="text-red-600 text-sm space-y-1 ml-7">
              {cartErrors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
            <p className="text-red-600 text-sm mt-2">Please fix these issues before proceeding.</p>
          </div>
        )}

        {/* Order Error */}
        {orderError && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">{orderError}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                        formErrors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="your@email.com"
                    />
                    {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                        formErrors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="(555) 123-4567"
                    />
                    {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Truck size={20} className="mr-2" />
                  Shipping Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                        formErrors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.firstName && <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                        formErrors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.lastName && <p className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                        formErrors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="123 Main Street"
                    />
                    {formErrors.address && <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                        formErrors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.city && <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                        formErrors.state ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="NY"
                    />
                    {formErrors.state && <p className="text-red-500 text-sm mt-1">{formErrors.state}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                        formErrors.zipCode ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="12345"
                    />
                    {formErrors.zipCode && <p className="text-red-500 text-sm mt-1">{formErrors.zipCode}</p>}
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <CreditCard size={20} className="mr-2" />
                  Payment Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name *
                    </label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                        formErrors.cardName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="John Doe"
                    />
                    {formErrors.cardName && <p className="text-red-500 text-sm mt-1">{formErrors.cardName}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      required
                      maxLength={19}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                        formErrors.cardNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="1234 5678 9012 3456"
                    />
                    {formErrors.cardNumber && <p className="text-red-500 text-sm mt-1">{formErrors.cardNumber}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date *
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      required
                      maxLength={5}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                        formErrors.expiryDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="MM/YY"
                    />
                    {formErrors.expiryDate && <p className="text-red-500 text-sm mt-1">{formErrors.expiryDate}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV *
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      required
                      maxLength={4}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                        formErrors.cvv ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="123"
                    />
                    {formErrors.cvv && <p className="text-red-500 text-sm mt-1">{formErrors.cvv}</p>}
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-3 mb-6">
                {state.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <span className="text-gray-800">
                      {item.name} × {item.quantity}
                    </span>
                      {item.stock_quantity !== undefined && item.quantity > item.stock_quantity && (
                        <span className="block text-red-500 text-xs">
                          ⚠ Only {item.stock_quantity} available
                        </span>
                      )}
                    </div>
                    <span className="font-medium text-gray-900 ml-4">
                      ${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Totals */}
              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (8.75%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              {/* Place Order Button */}
              <button
                onClick={handleSubmit}
                disabled={isProcessing || checkingStock || cartErrors.length > 0}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors mt-6 ${
                  isProcessing || checkingStock || cartErrors.length > 0
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-amber-500 text-black hover:bg-amber-400'
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Processing Order...
                  </div>
                ) : checkingStock ? (
                  'Checking Stock...'
                ) : cartErrors.length > 0 ? (
                  'Fix Cart Issues'
                ) : (
                  `Place Order - $${total.toFixed(2)}`
                )}
              </button>
              
              {/* Security Notice */}
              <div className="mt-4 text-center">
                <div className="flex items-center justify-center text-green-600 mb-2">
                  <Shield size={16} className="mr-1" />
                  <span className="text-xs font-medium">Secure Checkout</span>
                </div>
                <p className="text-xs text-gray-500">
                  Your payment information is encrypted and secure
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}