"use client"

import React, { createContext, useContext, useReducer, useEffect, useState } from 'react'

export interface CartItem {
  id: string
  name: string
  price: string
  description: string
  image: string
  quantity: number
  category: string
  stock_quantity?: number  // Available stock
  max_quantity?: number    // Max allowed in cart
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
  isLoading: boolean
  error: string | null
}

interface StockValidationResult {
  isValid: boolean
  availableStock: number
  message: string
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_STOCK'; payload: { id: string; stock_quantity: number } }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
  addToCart: (item: Omit<CartItem, 'quantity'>, requestedQuantity?: number) => Promise<boolean>
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => Promise<boolean>
  clearCart: () => void
  validateStock: (productId: string, quantity: number) => Promise<StockValidationResult>
  checkAllStock: () => Promise<void>
  getCartErrors: () => string[]
} | undefined>(undefined)

// Helper function to safely parse price
const parsePrice = (price: string): number => {
  return parseFloat(price.replace('$', '')) || 0
}

// Helper function to format price
const formatPrice = (amount: number): string => {
  return `$${amount.toFixed(2)}`
}

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + 1
        // Check stock limit
        if (existingItem.stock_quantity && newQuantity > existingItem.stock_quantity) {
          return {
            ...state,
            error: `Cannot add more ${existingItem.name}. Only ${existingItem.stock_quantity} available.`
          }
        }
        
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: newQuantity }
              : item
          ),
          total: state.total + parsePrice(action.payload.price),
          itemCount: state.itemCount + 1,
          error: null
        }
      } else {
        // Check stock for new item
        if (action.payload.stock_quantity && action.payload.stock_quantity < 1) {
          return {
            ...state,
            error: `${action.payload.name} is out of stock.`
          }
        }
        
        const newItem = { 
          ...action.payload, 
          quantity: 1,
          max_quantity: action.payload.stock_quantity 
        }
        return {
          ...state,
          items: [...state.items, newItem],
          total: state.total + parsePrice(action.payload.price),
          itemCount: state.itemCount + 1,
          error: null
        }
      }
    }
    
    case 'REMOVE_ITEM': {
      const item = state.items.find(item => item.id === action.payload)
      if (!item) return state
      
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        total: state.total - (parsePrice(item.price) * item.quantity),
        itemCount: state.itemCount - item.quantity,
        error: null
      }
    }
    
    case 'UPDATE_QUANTITY': {
      const item = state.items.find(item => item.id === action.payload.id)
      if (!item) return state
      
      // Validate quantity
      if (action.payload.quantity < 0) {
        return { ...state, error: 'Quantity cannot be negative.' }
      }
      
      if (item.stock_quantity && action.payload.quantity > item.stock_quantity) {
        return {
          ...state,
          error: `Cannot set quantity to ${action.payload.quantity}. Only ${item.stock_quantity} available.`
        }
      }
      
      const oldTotal = parsePrice(item.price) * item.quantity
      const newTotal = parsePrice(item.price) * action.payload.quantity
      const quantityDiff = action.payload.quantity - item.quantity
      
      return {
        ...state,
        items: state.items.map(cartItem =>
          cartItem.id === action.payload.id
            ? { ...cartItem, quantity: action.payload.quantity }
            : cartItem
        ),
        total: state.total - oldTotal + newTotal,
        itemCount: state.itemCount + quantityDiff,
        error: null
      }
    }
    
    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
        itemCount: 0,
        isLoading: false,
        error: null
      }
      
    case 'LOAD_CART':
      return {
        ...action.payload,
        error: null
      }
      
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }
      
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      }
      
    case 'UPDATE_STOCK':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { 
                ...item, 
                stock_quantity: action.payload.stock_quantity,
                max_quantity: action.payload.stock_quantity
              }
            : item
        )
      }
      
    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
    isLoading: false,
    error: null
  })

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('b&h-cart')
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        // Ensure the loaded cart has the new structure
        const enhancedCart = {
          ...parsedCart,
          isLoading: false,
          error: null
        }
        dispatch({ type: 'LOAD_CART', payload: enhancedCart })
        
        // Validate stock for loaded items
        setTimeout(() => checkAllStock(), 1000)
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load saved cart' })
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes (excluding loading/error states)
  useEffect(() => {
    const cartToSave = {
      items: state.items,
      total: state.total,
      itemCount: state.itemCount
    }
    localStorage.setItem('b&h-cart', JSON.stringify(cartToSave))
  }, [state.items, state.total, state.itemCount])

  // Auto-clear errors after 5 seconds
  useEffect(() => {
    if (state.error) {
      const timer = setTimeout(() => {
        dispatch({ type: 'SET_ERROR', payload: null })
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [state.error])

  // Validate stock with backend
  const validateStock = async (productId: string, quantity: number): Promise<StockValidationResult> => {
    try {
      const response = await fetch('http://localhost:5000/api/products/check-stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: [{ product_id: parseInt(productId), quantity }]
        })
      })

      const data = await response.json()
      
      if (data.success && data.data.length > 0) {
        const stockInfo = data.data[0]
        return {
          isValid: stockInfo.available,
          availableStock: stockInfo.available_quantity || 0,
          message: stockInfo.message || 'Stock checked'
        }
      } else {
        return {
          isValid: false,
          availableStock: 0,
          message: 'Unable to verify stock'
        }
      }
    } catch (error) {
      console.error('Stock validation error:', error)
      return {
        isValid: false,
        availableStock: 0,
        message: 'Stock validation failed'
      }
    }
  }

  // Check stock for all items in cart
  const checkAllStock = async () => {
    if (state.items.length === 0) return
    
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      const stockChecks = state.items.map(item => ({
        product_id: parseInt(item.id),
        quantity: item.quantity
      }))

      const response = await fetch('http://localhost:5000/api/products/check-stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items: stockChecks })
      })

      const data = await response.json()
      
      if (data.success) {
        // Update stock information for each item
        data.data.forEach((stockInfo: any) => {
          dispatch({ 
            type: 'UPDATE_STOCK', 
            payload: { 
              id: stockInfo.product_id.toString(), 
              stock_quantity: stockInfo.available_quantity || 0 
            } 
          })
        })
      }
    } catch (error) {
      console.error('Error checking stock:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Unable to verify stock levels' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  // Enhanced add to cart with stock validation
  const addToCart = async (item: Omit<CartItem, 'quantity'>, requestedQuantity = 1): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      // First validate stock
      const stockValidation = await validateStock(item.id, requestedQuantity)
      
      if (!stockValidation.isValid) {
        dispatch({ type: 'SET_ERROR', payload: stockValidation.message })
        return false
      }

      // Add item to cart
      for (let i = 0; i < requestedQuantity; i++) {
        dispatch({ type: 'ADD_ITEM', payload: item })
      }
      
      return true
    } catch (error) {
      console.error('Error adding to cart:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add item to cart' })
      return false
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  // Enhanced update quantity with stock validation
  const updateQuantity = async (id: string, quantity: number): Promise<boolean> => {
    if (quantity <= 0) {
      removeFromCart(id)
      return true
    }

    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      // Validate new quantity
      const stockValidation = await validateStock(id, quantity)
      
      if (!stockValidation.isValid) {
        dispatch({ type: 'SET_ERROR', payload: stockValidation.message })
        return false
      }

      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
      return true
    } catch (error) {
      console.error('Error updating quantity:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update quantity' })
      return false
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  // Get current cart validation errors
  const getCartErrors = (): string[] => {
    const errors: string[] = []
    
    state.items.forEach(item => {
      if (item.stock_quantity !== undefined && item.quantity > item.stock_quantity) {
        errors.push(`${item.name}: Only ${item.stock_quantity} available, but ${item.quantity} in cart`)
      }
      if (item.stock_quantity === 0) {
        errors.push(`${item.name}: Out of stock`)
      }
    })
    
    return errors
  }

  return (
    <CartContext.Provider value={{
      state,
      dispatch,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      validateStock,
      checkAllStock,
      getCartErrors
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}