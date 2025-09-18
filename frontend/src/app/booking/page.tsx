"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ArrowLeft, Calendar, Clock, User, CreditCard, CheckCircle } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

// Type definitions
interface Service {
  id: number
  name: string
  price: number
  duration: number
  description: string
}

interface Barber {
  id: number
  name: string
  image?: string
  profile_image?: string
  specialties?: string[]  // For mock data
  specialization?: string // For API data
  experience_years?: number
  bio?: string
  phone?: string
  email?: string
  is_available?: boolean
  rating?: number
  total_reviews?: number
}

// Mock data for services
const serviceCategories = [
  {
    id: "HAIRCUTS",
    title: "Haircuts",
    services: [
      { id: 1, name: "Regular Hair Cut", price: 38, duration: 30, description: "Classic haircut with styling" },
      { id: 2, name: "Scissor Hair Cut", price: 38, duration: 30, description: "Precision scissor cut" },
      { id: 3, name: "Kid's Hair Cut", price: 25, duration: 30, description: "Specialized kids haircut" },
      { id: 4, name: "Long Hair Cut", price: 45, duration: 45, description: "Long hair styling and cut" },
      { id: 21, name: "Buzz Cut", price: 20, duration: 20, description: "Quick and clean buzz cut" },
      { id: 22, name: "Fade Cut", price: 35, duration: 35, description: "Professional fade with blending" },
      { id: 23, name: "Pompadour", price: 50, duration: 40, description: "Classic pompadour styling" }
    ]
  },
  {
    id: "BEARDS",
    title: "Beards & Shaves",
    services: [
      { id: 5, name: "Classic Shave", price: 32, duration: 30, description: "Traditional straight razor shave" },
      { id: 6, name: "Beard Trim", price: 18, duration: 20, description: "Professional beard trimming" },
      { id: 7, name: "Royal Shave", price: 40, duration: 45, description: "Premium shave with hot towel" },
      { id: 8, name: "Hair Cut & Beard Trim", price: 52, duration: 45, description: "Complete grooming package" }
    ]
  },
  {
    id: "COLORING",
    title: "Coloring",
    services: [
      { id: 9, name: "Men's Hair Color", price: 37, duration: 60, description: "Professional hair coloring" },
      { id: 10, name: "Highlights", price: 55, duration: 90, description: "Stylish hair highlights" },
      { id: 11, name: "Color Correction", price: 75, duration: 120, description: "Fix previous color issues" }
    ]
  },
  {
    id: "FACIAL",
    title: "Facial & Skin",
    services: [
      { id: 12, name: "Face Massage", price: 20, duration: 20, description: "Relaxing facial massage" },
      { id: 13, name: "Facial Treatment", price: 45, duration: 45, description: "Deep cleansing facial" },
      { id: 14, name: "Eyebrow Shaping", price: 15, duration: 15, description: "Professional eyebrow grooming" }
    ]
  },
  {
    id: "STYLING",
    title: "Hair Styling",
    services: [
      { id: 15, name: "Hair Styling", price: 25, duration: 20, description: "Professional hair styling" },
      { id: 16, name: "Wedding Styling", price: 80, duration: 60, description: "Special occasion styling" },
      { id: 17, name: "Hair Wash & Style", price: 30, duration: 30, description: "Complete wash and style" }
    ]
  },
  {
    id: "PACKAGES",
    title: "Packages",
    services: [
      { id: 18, name: "Groom Package", price: 85, duration: 60, description: "Hair cut, beard trim, hot towel, hair wash" },
      { id: 19, name: "Party Package", price: 120, duration: 90, description: "Hair cut, royal shave, face massage, styling" },
      { id: 20, name: "Complete Package", price: 150, duration: 120, description: "Full service with color and styling" }
    ]
  }
]

// Mock barbers data
const barbers = [
  { id: 1, name: "Raul Dominquez", image: "/images/home_02_team_01.jpg", specialties: ["Haircuts", "Beards"], rating: 4.9 },
  { id: 2, name: "Mike Johnson", image: "/images/home_02_team_02.jpg", specialties: ["Styling", "Coloring"], rating: 4.8 },
  { id: 3, name: "Carlos Rodriguez", image: "/images/home_02_team_03.jpg", specialties: ["Shaves", "Facial"], rating: 4.9 },
  { id: 4, name: "David Smith", image: "/images/home_02_team_04.jpg", specialties: ["Packages", "Styling"], rating: 4.7 },
  { id: 5, name: "Antonio Garcia", image: "/images/home_02_team_01.jpg", specialties: ["Haircuts", "Coloring"], rating: 4.8 },
  { id: 6, name: "Marcus Williams", image: "/images/home_02_team_02.jpg", specialties: ["Beards", "Shaves"], rating: 4.9 },
  { id: 7, name: "Jake Martinez", image: "/images/home_02_team_03.jpg", specialties: ["Styling", "Packages"], rating: 4.6 },
  { id: 8, name: "Tony Anderson", image: "/images/home_02_team_04.jpg", specialties: ["Haircuts", "Facial"], rating: 4.8 },
  { id: 9, name: "Luis Hernandez", image: "/images/home_02_team_01.jpg", specialties: ["Coloring", "Styling"], rating: 4.7 },
  { id: 10, name: "Roberto Silva", image: "/images/home_02_team_02.jpg", specialties: ["Shaves", "Beards"], rating: 4.9 },
  { id: 11, name: "Alex Thompson", image: "/images/home_02_team_03.jpg", specialties: ["Packages", "Haircuts"], rating: 4.5 },
  { id: 12, name: "Diego Lopez", image: "/images/home_02_team_04.jpg", specialties: ["Facial", "Styling"], rating: 4.8 }
]

// Generate time slots organized by sections (9:30 AM to 7:30 PM, 30-minute intervals)
const generateTimeSectionSlots = () => {
  const generateSlots = (startHour: number, endHour: number) => {
  const slots = []
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      // Create a local time date object (consistent with blocked time conversion)
      const tempDate = new Date()
      tempDate.setHours(hour, minute, 0, 0)
      const displayTime = tempDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
      
      // Debug logging for time slot generation
      if ((hour === 16 && minute === 30) || (hour === 17 && minute === 0) || (hour === 18 && minute === 0) || (hour === 19 && minute === 0)) {
        console.log('🕐 Time slot generation debug:', {
          hour,
          minute,
          timeString,
          displayTime,
          tempDate: tempDate.toString()
        })
      }
      
      slots.push({ time: timeString, display: displayTime })
    }
  }
  return slots
}

  return {
    morning: generateSlots(9, 12), // 9:00 AM - 11:30 AM
    afternoon: generateSlots(12, 17), // 12:00 PM - 4:30 PM
    evening: generateSlots(17, 20) // 5:00 PM - 7:30 PM
  }
}

// Fetch blocked time slots for a specific date
const fetchBlockedSlots = async (dateString: string, retryCount = 0): Promise<string[]> => {
  const maxRetries = 3
  const retryDelay = 1000 * (retryCount + 1)
  
  try {
    console.log(`🔒 Fetching blocked slots for ${dateString}...`)
    
    const response = await fetch(`http://localhost:5000/api/time-blocks/date/${dateString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      if ((response.status >= 500 || response.status === 0) && retryCount < maxRetries) {
        console.log(`🔄 Retrying blocked slots fetch in ${retryDelay}ms...`)
        await new Promise(resolve => setTimeout(resolve, retryDelay))
        return fetchBlockedSlots(dateString, retryCount + 1)
      }
      
      if (response.status === 404) {
        // No blocked slots found, return empty array
        console.log('✅ No blocked slots found for', dateString)
        return []
      }
      
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    
    if (data.success && data.data) {
      const blockedTimeSlots = data.data.flatMap((block: any) => {
        // Parse the block_time and duration
        const [hourStr, minuteStr] = block.block_time.split(':')
        const hour = parseInt(hourStr)
        const minute = parseInt(minuteStr || '0')
        const duration = block.duration || 60 // Default 60 minutes
        
        // Calculate start and end times
        const startTime = hour * 60 + minute // Convert to minutes from midnight
        const endTime = startTime + duration
        
        // Generate all 30-minute slots that fall within the blocked period
        const blockedSlots = []
        
        // Round start time to nearest 30-minute slot
        let currentTime = startTime
        let roundedStartMinute = minute < 15 ? 0 : minute < 45 ? 30 : 0
        let roundedStartHour = hour
        if (minute >= 45) {
          roundedStartHour = (hour + 1) % 24
        }
        currentTime = roundedStartHour * 60 + roundedStartMinute
        
        // Generate slots every 30 minutes until we cover the entire blocked period
        while (currentTime < endTime) {
          const slotHour = Math.floor(currentTime / 60)
          const slotMinute = currentTime % 60
          
          // Create a date object using local time
          const tempDate = new Date()
          tempDate.setHours(slotHour, slotMinute, 0, 0)
          
          const timeString = tempDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })
          
          blockedSlots.push(timeString)
          
          // Move to next 30-minute slot
          currentTime += 30
        }
        
        console.log('🔒 Processing blocked time:', {
          original: block.block_time,
          duration: duration,
          startTime: `${hour}:${minute.toString().padStart(2, '0')}`,
          endTime: `${Math.floor(endTime / 60)}:${(endTime % 60).toString().padStart(2, '0')}`,
          blockedSlots: blockedSlots
        })
        
        return blockedSlots
      })
      
      console.log('🔒 Blocked time slots:', blockedTimeSlots)
      console.log('🔒 Blocked time slots details:', {
        originalData: data.data,
        convertedSlots: blockedTimeSlots,
        slotCount: blockedTimeSlots.length
      })
      return blockedTimeSlots
    }
    
    return []
  } catch (error) {
    console.error('❌ Error fetching blocked slots:', error)
    
    if (retryCount < maxRetries && (error instanceof TypeError || (error as Error).name === 'AbortError')) {
      console.log(`🔄 Network error, retrying blocked slots fetch in ${retryDelay}ms...`)
      await new Promise(resolve => setTimeout(resolve, retryDelay))
      return fetchBlockedSlots(dateString, retryCount + 1)
    }
    
    // After all retries failed, return empty array (allow booking)
    console.log('⚠️ Using fallback: no blocked slots due to API error')
    return []
  }
}

// Fetch booked appointments and return the exact time slots to highlight
const fetchBookedSlots = async (dateString: string, barberId?: number, retryCount = 0): Promise<string[]> => {
  const maxRetries = 3
  const retryDelay = 1000 * (retryCount + 1) // Exponential backoff: 1s, 2s, 3s
  
  try {
    // Build API URL
    let url = `http://localhost:5000/api/appointments/date/${dateString}`
    if (barberId) {
      url += `?barber_id=${barberId}`
    }
    
    console.log(`🔍 Fetching booked appointments from: ${url} (attempt ${retryCount + 1}/${maxRetries + 1})`)
    
    // Add timeout to fetch request
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      console.error(`❌ API call failed: ${response.status} ${response.statusText}`)
      
      // Retry on server errors (5xx) or network issues
      if ((response.status >= 500 || response.status === 0) && retryCount < maxRetries) {
        console.log(`🔄 Retrying in ${retryDelay}ms...`)
        await new Promise(resolve => setTimeout(resolve, retryDelay))
        return fetchBookedSlots(dateString, barberId, retryCount + 1)
      }
      
      // For 4xx errors or max retries reached, throw error to be handled by caller
      throw new Error(`API call failed: ${response.status} ${response.statusText}`)
    }
    
    const result = await response.json()
    console.log('📋 API Response for date', dateString, ':', result)
    
    if (!result.success || !result.data || !Array.isArray(result.data)) {
      console.log('⚠️ No valid appointment data - treating as no bookings')
  return []
    }
    
    // Extract booked times and convert to display format
    const bookedTimeSlots = result.data.map((appointment: any) => {
      const timeStr = appointment.appointment_time // e.g., "09:00:00" or "10:00:00"
      console.log(`⏰ Processing appointment time: ${timeStr}`)
      
      // Parse time parts (handle both HH:MM:SS and HH:MM formats)
      const [hourStr, minuteStr] = timeStr.split(':')
      const hour = parseInt(hourStr)
      const minute = parseInt(minuteStr || '0')
      
      // Create a date object to use toLocaleTimeString (same as time slot generation)
      const tempDate = new Date()
      tempDate.setHours(hour, minute, 0, 0)
      
      const displayTime = tempDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
      
      console.log(`🔄 Converted: ${timeStr} -> ${displayTime}`)
      return displayTime
    }).filter((time: string, index: number, self: string[]) => self.indexOf(time) === index) // Remove duplicates
    
    console.log('🎯 Final booked slots to highlight:', bookedTimeSlots)
    return bookedTimeSlots
    
  } catch (error) {
    console.error('💥 Error fetching booked slots:', error)
    
    // Retry on network errors
    if (retryCount < maxRetries && (error instanceof TypeError || (error as Error).name === 'AbortError')) {
      console.log(`🔄 Network error, retrying in ${retryDelay}ms...`)
      await new Promise(resolve => setTimeout(resolve, retryDelay))
      return fetchBookedSlots(dateString, barberId, retryCount + 1)
    }
    
    // After all retries failed, throw error to be handled by caller
    throw error
  }
}

const timeSections = generateTimeSectionSlots()

// Legacy support - combine all slots for backward compatibility  
const timeSlots = [...timeSections.morning, ...timeSections.afternoon, ...timeSections.evening]

// Auto-select the next available time slot (checks multiple days via API)
const findNextAvailableSlot = async (bookedSlots: string[], currentDate: string): Promise<{ slot: string, date: string } | null> => {
  // Get all available time slots for current date
  const availableSlots = timeSlots.filter(slot => !bookedSlots.includes(slot.display))
  
  if (availableSlots.length > 0) {
    // Return first available slot for current date
    return { slot: availableSlots[0].display, date: currentDate }
  }
  
  // If no slots available for current date, check next 7 days via API
  const currentDateObj = new Date(currentDate)
  for (let i = 1; i <= 7; i++) { // Check next 7 days
    const nextDate = new Date(currentDateObj)
    nextDate.setDate(currentDateObj.getDate() + i)
    const nextDateString = nextDate.toISOString().split('T')[0]
    
    try {
      console.log(`🔍 Checking availability for ${nextDateString}...`)
      const [nextDayBookedSlots, nextDayBlockedSlots] = await Promise.all([
        fetchBookedSlots(nextDateString),
        fetchBlockedSlots(nextDateString)
      ])
      const nextDayUnavailableSlots = [...nextDayBookedSlots, ...nextDayBlockedSlots]
      const nextDayAvailableSlots = timeSlots.filter(slot => !nextDayUnavailableSlots.includes(slot.display))
      
      if (nextDayAvailableSlots.length > 0) {
        console.log(`✅ Found available slot on ${nextDateString}: ${nextDayAvailableSlots[0].display}`)
        return { slot: nextDayAvailableSlots[0].display, date: nextDateString }
      } else {
        console.log(`❌ ${nextDateString} is fully booked, checking next day...`)
      }
    } catch (error) {
      console.error(`Error checking ${nextDateString}:`, error)
      // If API call fails, assume day is available
      return { slot: timeSlots[0].display, date: nextDateString }
    }
  }
  
  console.log('⚠️ No available slots found in next 7 days')
  return null // No available slots in next 7 days
}

export default function BookingPage() {
  // State declarations first
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedServices, setSelectedServices] = useState<Service[]>([])
  // Set default date to tomorrow
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const defaultDate = tomorrow.toISOString().split('T')[0]
  const [selectedDate, setSelectedDate] = useState(defaultDate)
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null)
  const [barberType, setBarberType] = useState('any') // 'any' or 'specific'
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false)
  const [showFailurePopup, setShowFailurePopup] = useState(false)
  const [showAppointmentSummary, setShowAppointmentSummary] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [appointmentError, setAppointmentError] = useState('')
  const [currentDateBookedSlots, setCurrentDateBookedSlots] = useState<string[]>([])
  const [currentDateBlockedSlots, setCurrentDateBlockedSlots] = useState<string[]>([])
  const [loadingSlotsError, setLoadingSlotsError] = useState('')
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [timeValidationError, setTimeValidationError] = useState('')
  const [showTimeValidationPopup, setShowTimeValidationPopup] = useState(false)
  const [timeValidationData, setTimeValidationData] = useState<any>(null)
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false)
  const [duplicateData, setDuplicateData] = useState<any>(null)
  const [allowDuplicateOverride, setAllowDuplicateOverride] = useState(false)
  const [customerDetails, setCustomerDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  })
  const [tipPercentage, setTipPercentage] = useState(18)
  const [showCancellationPolicy, setShowCancellationPolicy] = useState(false)
  const [activeCategory, setActiveCategory] = useState('HAIRCUTS')
  const [expandedServices, setExpandedServices] = useState<number[]>([])
  const [customTipActive, setCustomTipActive] = useState(false)
  const [customTipValue, setCustomTipValue] = useState('')
  const [customTipType, setCustomTipType] = useState<'dollar' | 'percentage'>('dollar')
  const [customTipError, setCustomTipError] = useState('')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false)
  const [showCardModal, setShowCardModal] = useState(false)
  const [cardDetails, setCardDetails] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  })
  const [cardErrors, setCardErrors] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  })

  // API data states
  const [apiServices, setApiServices] = useState<any[]>([])
  const [apiBarbers, setApiBarbers] = useState<Barber[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [dataError, setDataError] = useState('')

  // Organize API services by category
  const organizeServicesByCategory = (services: any[]) => {
    const categoryMap: Record<string, any[]> = {}
    
    services.forEach(service => {
      const category = service.category || 'OTHER'
      if (!categoryMap[category]) {
        categoryMap[category] = []
      }
      categoryMap[category].push(service)
    })
    
    return Object.entries(categoryMap).map(([categoryId, services]) => ({
      id: categoryId,
      title: categoryId.charAt(0) + categoryId.slice(1).toLowerCase().replace('_', ' & '),
      services: services
    }))
  }

  // Helper function to format price consistently
  const formatPrice = (price: number | string): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2)
  }

  // Helper function to convert 12-hour time to 24-hour format
  const convertTo24Hour = (time12h: string): string => {
    const [time, modifier] = time12h.split(' ')
    let [hours, minutes] = time.split(':')
    
    if (modifier === 'AM') {
      if (hours === '12') {
        hours = '00'  // 12 AM = 00:xx
      }
    } else if (modifier === 'PM') {
      if (hours !== '12') {
        hours = (parseInt(hours, 10) + 12).toString()  // 1 PM = 13:xx, but 12 PM = 12:xx
      }
      
    }
    
    return `${hours.padStart(2, '0')}:${minutes}`
  }

  // Auto-select next available slot when booked slots are loaded
  const autoSelectAvailableSlot = async (bookedSlots: string[]) => {
    try {
      const nextAvailable = await findNextAvailableSlot(bookedSlots, selectedDate)
      
      if (nextAvailable) {
        if (nextAvailable.date !== selectedDate) {
          // Need to change date - auto select next available date
          console.log('🔄 Auto-selecting next available date:', nextAvailable.date)
          setSelectedDate(nextAvailable.date)
          // Time will be set when new date loads
        } else {
          // Same date, just select available time
          console.log('🎯 Auto-selecting available time:', nextAvailable.slot)
          setSelectedTime(nextAvailable.slot)
        }
      } else {
        console.log('⚠️ No available slots found in next 7 days')
      }
    } catch (error) {
      console.error('Error in auto-selection:', error)
    }
  }

  // Get current services to display (API or fallback to mock)
  const currentServiceCategories = apiServices.length > 0 ? organizeServicesByCategory(apiServices) : serviceCategories
  const currentBarbers = apiBarbers.length > 0 ? apiBarbers : barbers

  // Effects after all state declarations
  // Prevent body scrolling when booking system is open and manage global zoom
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    document.body.classList.add('booking-active')
    
    return () => {
      document.body.style.overflow = 'unset'
      document.body.classList.remove('booking-active')
    }
  }, [])

  // Update available slots when date changes
  useEffect(() => {
    if (selectedDate) {
      const loadBookedSlots = async () => {
        try {
          setIsLoadingSlots(true)
          setLoadingSlotsError('')
          const barberId = selectedBarber?.id // Only check for specific barber if selected
          console.log('🚀 Loading booked slots for date:', selectedDate, 'barber:', barberId)
          
          // Fetch both booked appointments and blocked time slots
          const [bookedSlots, blockedSlots] = await Promise.all([
            fetchBookedSlots(selectedDate, barberId),
            fetchBlockedSlots(selectedDate)
          ])
          
          // Combine booked and blocked slots
          const allUnavailableSlots = [...bookedSlots, ...blockedSlots]
          console.log('✅ Setting unavailable slots state:', {
            booked: bookedSlots,
            blocked: blockedSlots,
            total: allUnavailableSlots,
            bookedCount: bookedSlots.length,
            blockedCount: blockedSlots.length,
            totalCount: allUnavailableSlots.length,
            blockedSlotsDetails: blockedSlots
          })
          setCurrentDateBookedSlots(allUnavailableSlots)
          setCurrentDateBlockedSlots(blockedSlots)
          
          // Auto-select next available time slot
          await autoSelectAvailableSlot(allUnavailableSlots)
          
          // Clear any previous error
          setLoadingSlotsError('')
          console.log('🔍 State after setting:', bookedSlots)
        } catch (error) {
          console.error('❌ Failed to load booked slots after retries:', error)
          
          // Show user-friendly error message
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          if (errorMessage.includes('API call failed')) {
            setLoadingSlotsError('⚠️ Unable to load booking data. Please refresh the page or try again.')
          } else {
            setLoadingSlotsError('⚠️ Network error. Please check your connection and try again.')
          }
          
          // Set empty array as fallback - user can still select times but won't see conflicts
          setCurrentDateBookedSlots([])
          console.log('🔄 Using fallback: allowing all time slots due to API error')
        } finally {
          setIsLoadingSlots(false)
        }
      }
      
      // Add a small delay to avoid rapid-fire requests on component mount
      const timeoutId = setTimeout(() => {
        loadBookedSlots()
      }, 100)
      
      // Clear selected time when date changes to force user to select new time
      setSelectedTime('')
      
      // Cleanup timeout if component unmounts or dependencies change
      return () => clearTimeout(timeoutId)
    }
  }, [selectedDate, selectedBarber])

  // Auto-dismiss success popup after 4 seconds and close booking system
  useEffect(() => {
    if (showConfirmationPopup) {
      const timer = setTimeout(() => {
        setShowConfirmationPopup(false)
        // Close booking system by going back to previous page
        window.history.back()
      }, 4000) // 4 seconds

      return () => clearTimeout(timer)
    }
  }, [showConfirmationPopup])

  // Auto-dismiss failure popup after 5 seconds
  useEffect(() => {
    if (showFailurePopup) {
      const timer = setTimeout(() => {
        setShowFailurePopup(false)
      }, 5000) // 5 seconds

      return () => clearTimeout(timer)
    }
  }, [showFailurePopup])

  // Health check function to verify backend is ready
  const checkBackendHealth = async (retryCount = 0): Promise<boolean> => {
    const maxRetries = 3
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout
      
      const response = await fetch('http://localhost:5000/api/services', {
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' }
      })
      
      clearTimeout(timeoutId)
      return response.ok
    } catch (error) {
      if (retryCount < maxRetries) {
        console.log(`🔄 Backend health check failed, retrying in ${(retryCount + 1) * 1000}ms...`)
        await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 1000))
        return checkBackendHealth(retryCount + 1)
      }
      console.error('❌ Backend health check failed after retries:', error)
      return false
    }
  }

  // Fetch services and barbers from backend
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true)
      setDataError('')
      
      try {
        // Wait for backend to be ready first
        console.log('🔍 Checking backend health...')
        const isBackendReady = await checkBackendHealth()
        
        if (!isBackendReady) {
          throw new Error('Backend is not responding')
        }
        
        console.log('✅ Backend is ready, fetching data...')
        
        // Fetch services and barbers in parallel
        const [servicesResponse, barbersResponse] = await Promise.all([
          fetch('http://localhost:5000/api/services'),
          fetch('http://localhost:5000/api/barbers')
        ])

        if (!servicesResponse.ok || !barbersResponse.ok) {
          throw new Error('Failed to fetch data from backend')
        }

        const servicesData = await servicesResponse.json()
        const barbersData = await barbersResponse.json()

        console.log('Fetched services:', servicesData)
        console.log('Fetched barbers:', barbersData)

        setApiServices(servicesData.data || [])
        setApiBarbers(barbersData.data || [])
        
        // Set first category as active if we have API services
        if (servicesData.data && servicesData.data.length > 0) {
          const organizedCategories = organizeServicesByCategory(servicesData.data)
          if (organizedCategories.length > 0) {
            setActiveCategory(organizedCategories[0].id)
          }
        }
        
      } catch (error) {
        console.error('Error fetching data:', error)
        setDataError('Backend not ready or failed to load data. Using fallback data.')
        // Keep using mock data as fallback
      } finally {
        setIsLoadingData(false)
      }
    }

    // Add delay to allow backend to start up
    const timeoutId = setTimeout(() => {
      fetchData()
    }, 500) // 500ms delay for backend startup
    
    return () => clearTimeout(timeoutId)
  }, [])

  const steps = [
    { id: 1, title: 'Services & Barber', icon: User },
    { id: 2, title: 'Date & Time', icon: Calendar },
    { id: 3, title: 'Contact Details', icon: User },
    { id: 4, title: 'Payment & Review', icon: CreditCard }
  ]

  const handleServiceToggle = (service: Service) => {
    setSelectedServices(prev => {
      const exists = prev.find(s => s.id === service.id)
      if (exists) {
        return prev.filter(s => s.id !== service.id)
      } else {
        return [...prev, service]
      }
    })
  }

  const handleServiceExpand = (serviceId: number) => {
    setExpandedServices(prev => {
      const exists = prev.includes(serviceId)
      if (exists) {
        return prev.filter(id => id !== serviceId)
      } else {
        return [...prev, serviceId]
      }
    })
  }

  const handleNext = async () => {
    if (currentStep === 2) {
      // Validate time selection before proceeding to contact details
      const isTimeValid = await handleTimeValidation()
      if (isTimeValid) {
      setShowCancellationPolicy(true)
      }
      // If validation fails, stay on current step
    } else if (currentStep === 3) {
      // Check for duplicates before proceeding to payment
      await handleDuplicateCheck()
    } else {
      setCurrentStep(prev => Math.min(prev + 1, 4))
    }
  }

  // Handle time validation when moving from step 2 to 3
  const handleTimeValidation = async (): Promise<boolean> => {
    try {
      setTimeValidationError('') // Clear previous errors
      
      // Basic client-side validation first
      if (!selectedDate || !selectedTime) {
        setTimeValidationData({
          isValid: false,
          message: 'Please select both date and time',
          suggestion: null
        })
        setShowTimeValidationPopup(true)
        return false
      }

      // Call backend time validation API
      const response = await fetch('http://localhost:5000/api/appointments/validate-time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointment_date: selectedDate,
          appointment_time: convertTo24Hour(selectedTime)
        })
      })

      if (!response.ok) {
        const result = await response.json()
        
        // Show popup with error and suggestion
        setTimeValidationData({
          isValid: false,
          message: result.message || 'Invalid time selection',
          suggestion: result.suggestion || null
        })
        setShowTimeValidationPopup(true)
        return false
      }

      const result = await response.json()
      if (!result.success) {
        setTimeValidationData({
          isValid: false,
          message: result.message || 'Time validation failed',
          suggestion: null
        })
        setShowTimeValidationPopup(true)
        return false
      }

      // Time validation passed
      console.log('✅ Time validation passed')
      return true
      
    } catch (error) {
      console.error('Error validating time:', error)
      setTimeValidationData({
        isValid: false,
        message: 'Unable to validate time. Please try again.',
        suggestion: null
      })
      setShowTimeValidationPopup(true)
      return false
    }
  }

  // Handle duplicate checking when moving from step 3 to 4
  const handleDuplicateCheck = async () => {
    try {
      // Validate user details first
      if (!customerDetails.firstName || customerDetails.firstName.trim().length < 2) {
        alert('Please enter a valid name (at least 2 characters)')
        return
      }
      
      if (!customerDetails.email || !customerDetails.email.includes('@')) {
        alert('Please enter a valid email address')
        return
      }
      
      if (!customerDetails.phone || customerDetails.phone.replace(/[-\s\(\)]/g, '').length < 10) {
        alert('Please enter a valid phone number (at least 10 digits)')
        return
      }

      const cleanPhone = customerDetails.phone.replace(/[-\s\(\)]/g, '')

      // Check for duplicates (unless override is allowed)
      if (!allowDuplicateOverride) {
        const duplicateResponse = await fetch('http://localhost:5000/api/appointments/check-duplicate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer_phone: cleanPhone,
            customer_email: customerDetails.email,
            appointment_date: selectedDate
          })
        })

        if (duplicateResponse.ok) {
          const duplicateResult = await duplicateResponse.json()
          
          if (duplicateResult.success && duplicateResult.data.isDuplicate) {
            setDuplicateData(duplicateResult.data)
            setShowDuplicateWarning(true)
            return // Stop here to show duplicate warning
          }
        } else {
          console.warn('Duplicate check failed, proceeding to next step')
        }
      }

      // If no duplicates or override allowed, proceed to next step
      setCurrentStep(4)
    } catch (error) {
      console.error('Error checking duplicates:', error)
      // On error, still allow user to proceed
      setCurrentStep(4)
    }
  }

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleAgreeToPolicy = () => {
    setShowCancellationPolicy(false)
    setCurrentStep(3)
  }

  // Validation for 4-step flow
  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        // Services & Barber validation
        return selectedServices.length > 0 && (barberType === 'any' || selectedBarber !== null)
      case 2:
        // Date & Time validation
        return selectedDate && selectedTime
      case 3:
        // Contact Details validation
        return customerDetails.firstName && customerDetails.email && customerDetails.phone
      default:
        return true
    }
  }

  // Validate payment method and card details for proceeding to review
  const canProceedToReview = () => {
    if (!selectedPaymentMethod) return false
    
    // For "Pay at Venue", no card details needed
    if (selectedPaymentMethod === 'Pay at Venue') return true
    
    // For credit card payments, validate card details are complete
    if (selectedPaymentMethod === 'Credit Card') {
      const hasCardName = cardDetails.cardName && cardDetails.cardName.trim() !== ''
      const hasCardNumber = cardDetails.cardNumber && cardDetails.cardNumber.replace(/\s/g, '').length >= 13
      const hasExpiryDate = cardDetails.expiryDate && cardDetails.expiryDate.length >= 5
      const hasCvv = cardDetails.cvv && cardDetails.cvv.length >= 3
      const noErrors = Object.values(cardErrors).every(error => error === '')
      
      // Debug logging - remove in production
      console.log('Card validation:', { 
        selectedPaymentMethod, 
        hasCardName, 
        hasCardNumber, 
        hasExpiryDate, 
        hasCvv, 
        noErrors,
        cardDetails,
        cardErrors 
      })
      
      return hasCardName && hasCardNumber && hasExpiryDate && hasCvv && noErrors
    }
    
    // For other payment methods (Google Pay, Apple Pay, PayPal), allow proceed
    // (These would handle their own validation in real implementation)
    return true
  }

  // Handle appointment confirmation with API integration
  const handleConfirmAppointment = async () => {
    setIsConfirming(true)
    
    try {
      // Enhanced frontend validation
      if (!customerDetails.firstName || customerDetails.firstName.trim().length < 2) {
        throw new Error('Please enter a valid name (at least 2 characters)')
      }
      
      if (!customerDetails.email || !customerDetails.email.includes('@')) {
        throw new Error('Please enter a valid email address')
      }
      
      if (!customerDetails.phone || customerDetails.phone.replace(/[-\s\(\)]/g, '').length < 10) {
        throw new Error('Please enter a valid phone number (at least 10 digits)')
      }
      
      if (selectedServices.length === 0) {
        throw new Error('Please select at least one service')
      }
      
      if (!selectedDate || !selectedTime) {
        throw new Error('Please select date and time')
      }

      // Prepare appointment data for backend API
      const fullName = `${customerDetails.firstName} ${customerDetails.lastName || ''}`.trim()
      const cleanPhone = customerDetails.phone.replace(/[-\s\(\)]/g, '') // Remove formatting for validation
      
      // Calculate tip percentage based on tip type
      let calculatedTipPercentage = tipPercentage
      if (customTipActive && customTipValue) {
        if (customTipType === 'dollar') {
          // Calculate percentage from dollar amount
          const subtotal = totals.subtotal
          calculatedTipPercentage = subtotal > 0 ? (totals.tip / subtotal) * 100 : 0
        } else {
          // Use the percentage value directly
          calculatedTipPercentage = parseFloat(customTipValue) || 0
        }
      }
      
      const appointmentData = {
        customer_name: fullName.length >= 2 ? fullName : customerDetails.firstName, // Ensure minimum 2 chars
        customer_email: customerDetails.email,
        customer_phone: cleanPhone,
        barber_id: selectedBarber ? selectedBarber.id : 1, // Default to barber 1 if "any barber"
        appointment_date: selectedDate,
        appointment_time: convertTo24Hour(selectedTime), // Convert to 24-hour format
        services: selectedServices.map(service => service.id),
        notes: customerDetails.message || '', // Only user's custom notes
        tip_percentage: Math.round(calculatedTipPercentage * 100) / 100, // Round to 2 decimal places
        tip_amount: totals.tip, // Send the actual tip amount
        payment_method: selectedPaymentMethod,
        total_amount: totals.total
      }

      console.log('Booking appointment with data:', appointmentData)
      console.log('💡 Tip calculation:', {
        customTipActive,
        customTipType,
        customTipValue,
        originalTipPercentage: tipPercentage,
        calculatedTipPercentage,
        tipAmount: totals.tip,
        subtotal: totals.subtotal
      })

      // Call backend API
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData)
      })
      
      console.log('Response status:', response.status, response.statusText)
      console.log('Response headers:', response.headers.get('content-type'))
      
      // Check if response is valid JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text()
        console.error('Non-JSON response:', textResponse)
        throw new Error('Server returned invalid response format')
      }
      
      const result = await response.json()
      console.log('Response data:', result)
      
      if (!response.ok) {
        console.error('API Error - Status:', response.status, 'Data:', result)
        
        // Handle duplicate booking errors
        if (response.status === 409 && (result.type === 'duplicate_same_date' || result.type === 'duplicate_recent')) {
          console.log('🚫 Duplicate booking detected:', result)
          setDuplicateData({
            isDuplicate: true,
            type: result.type,
            message: result.message,
            existingAppointment: result.existingAppointment,
            allowOverride: result.allowOverride || false
          })
          setShowDuplicateWarning(true)
          setIsConfirming(false)
          return // Stop here to show duplicate warning
        }

        // Handle time validation with suggestions
        if (response.status === 400 && result.suggestion) {
          console.log('🕒 Backend suggests better time:', result.suggestion)
          
          // Auto-redirect to suggested date and time
          if (result.suggestion.date && result.suggestion.time) {
            setSelectedDate(result.suggestion.date)
            setSelectedTime(result.suggestion.display_time || result.suggestion.time)
            
            // Show a helpful message
            throw new Error(`${result.message} Redirected to: ${result.suggestion.display_time || result.suggestion.time} tomorrow.`)
          }
        }
        
        throw new Error(result.message || result.errors?.join(', ') || 'Failed to book appointment')
      }

      // Check if backend indicates success
      if (!result.success) {
        console.error('Backend Error:', result)
        throw new Error(result.message || 'Appointment booking failed')
      }

      console.log('Appointment booked successfully:', result)
      
      // Close appointment summary and show success
      setShowAppointmentSummary(false)
      setShowConfirmationPopup(true)
      setAppointmentError('') // Clear any previous errors
      
    } catch (error) {
      console.error('Error confirming appointment:', error)
      setAppointmentError(`Failed to confirm appointment: ${(error as Error).message}. Please try again.`)
      // Close appointment summary and show failure popup
      setShowAppointmentSummary(false)
      setShowFailurePopup(true)
    } finally {
      setIsConfirming(false)
    }
  }

  // Find next available slot (for backend integration)
  const findAvailableSlot = async () => {
    try {
      // TODO: Replace with actual backend API call
      // const response = await fetch('/api/available-slots', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     services: selectedServices,
      //     barberType,
      //     barberId: selectedBarber?.id
      //   })
      // })
      // const data = await response.json()
      
      // Mock implementation with business hours (9:00 AM - 7:30 PM)
      const now = new Date()
      const currentHour = now.getHours()
      const currentMinute = now.getMinutes()
      const currentTime = currentHour + (currentMinute / 60) // Convert to decimal hours
      
      // Business hours: 9:00 AM (9.0) to 7:30 PM (19.5)
      const openingTime = 9.0
      const closingTime = 19.5 // 7:30 PM
      
      // Check if we can still book for today
      const isWithinBusinessHours = currentTime >= openingTime && currentTime < closingTime
      const hasTimeForAppointment = currentTime < (closingTime - 0.5) // At least 30 minutes before closing
      const isBeforeOpeningToday = currentTime < openingTime // Early morning (before 9 AM)
      
      // Try today if we're within business hours OR if it's early morning (before opening)
      if ((isWithinBusinessHours && hasTimeForAppointment) || isBeforeOpeningToday) {
        // Try to book for today
        const year = now.getFullYear()
        const month = String(now.getMonth() + 1).padStart(2, '0')
        const day = String(now.getDate()).padStart(2, '0')
        setSelectedDate(`${year}-${month}-${day}`)
        
        // Determine the next available time slot
        let nextAvailableHour
        
        if (isBeforeOpeningToday) {
          // If it's early morning (before 9 AM), start from opening time
          nextAvailableHour = openingTime // 9:00 AM
        } else {
          // If within business hours, find next slot after current time
          nextAvailableHour = Math.ceil(currentTime + 0.5) // Next 30-min slot
          
          // If no more slots today, move to tomorrow
          if (nextAvailableHour >= closingTime) {
            const tomorrow = new Date()
            tomorrow.setDate(tomorrow.getDate() + 1)
            const tomorrowYear = tomorrow.getFullYear()
            const tomorrowMonth = String(tomorrow.getMonth() + 1).padStart(2, '0')
            const tomorrowDay = String(tomorrow.getDate()).padStart(2, '0')
            setSelectedDate(`${tomorrowYear}-${tomorrowMonth}-${tomorrowDay}`)
            setSelectedTime('9:00 AM')
            return
          }
        }
        
        // Format time for display
        const hour12 = nextAvailableHour > 12 ? nextAvailableHour - 12 : nextAvailableHour
        const ampm = nextAvailableHour >= 12 ? 'PM' : 'AM'
        const displayHour = Math.floor(hour12) === 0 ? 12 : Math.floor(hour12)
        const displayMinute = (nextAvailableHour % 1) === 0.5 ? '30' : '00'
        
        setSelectedTime(`${displayHour}:${displayMinute} ${ampm}`)
      } else {
        // Book for next business day (tomorrow)
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        const year = tomorrow.getFullYear()
        const month = String(tomorrow.getMonth() + 1).padStart(2, '0')
        const day = String(tomorrow.getDate()).padStart(2, '0')
        setSelectedDate(`${year}-${month}-${day}`)
        
        // Set to first available slot tomorrow (9:00 AM)
        setSelectedTime('9:00 AM')
      }
    } catch (error) {
      console.error('Error finding available slot:', error)
    }
  }

  const calculateTotal = () => {
    const serviceTotal = selectedServices.reduce((sum, service) => {
      const price = typeof service.price === 'string' ? parseFloat(service.price) : service.price
      return sum + (isNaN(price) ? 0 : price)
    }, 0)
    const barberFee = barberType === 'specific' ? 20 : 0 // $20 premium for specific barber
    
    let tipAmount = 0
    if (customTipActive && customTipValue) {
      if (customTipType === 'dollar') {
        tipAmount = parseFloat(customTipValue) || 0
      } else {
        const percentage = parseFloat(customTipValue) || 0
        tipAmount = (serviceTotal + barberFee) * (percentage / 100)
      }
    } else {
      tipAmount = (serviceTotal + barberFee) * (tipPercentage / 100)
    }
    
    // Ensure all values are numbers
    const subtotal = Number(serviceTotal + barberFee) || 0
    const tip = Number(tipAmount) || 0
    const total = Number(subtotal + tip) || 0
    
    return {
      subtotal: subtotal,
      tip: tip,
      total: total
    }
  }

  const handleCustomTipClick = () => {
    setCustomTipActive(true)
    setTipPercentage(0) // Deselect preset tips
    setCustomTipError('')
  }

  const handlePresetTipClick = (percentage: number) => {
    setTipPercentage(percentage)
    setCustomTipActive(false)
    setCustomTipValue('')
    setCustomTipError('')
  }

  const handleCustomTipInput = (value: string) => {
    setCustomTipValue(value)
    setCustomTipError('')
    
    // Auto-detect type based on input
    if (value.includes('$') || (!value.includes('%') && customTipType === 'dollar')) {
      setCustomTipType('dollar')
    } else if (value.includes('%') || customTipType === 'percentage') {
      setCustomTipType('percentage')
    }
  }

  const handleCustomTipSubmit = () => {
    const cleanValue = customTipValue.replace(/[$%]/g, '')
    const numValue = parseFloat(cleanValue)
    
    if (isNaN(numValue)) {
      setCustomTipError('Please enter a valid number')
      return
    }

    if (customTipType === 'dollar') {
      if (numValue < 5) {
        setCustomTipError('Minimum tip is $5')
        return
      }
      if (numValue > 300) {
        setCustomTipError('Maximum tip is $300')
        return
      }
    } else {
      if (numValue < 5) {
        setCustomTipError('Minimum tip is 5%')
        return
      }
      if (numValue > 300) {
        setCustomTipError('Maximum tip is 300%')
        return
      }
    }

    // Success - apply the tip
    setCustomTipValue(Math.floor(numValue).toString())
    setCustomTipError('')
  }

  // Payment Method Icons
  const GooglePayIcon = () => (
    <svg fill="currentColor" viewBox="0 0 32 32" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 13.333l-4.177 9.333h-1.292l1.552-3.266-2.75-6.068h1.359l1.99 4.651h0.026l1.927-4.651zM14.646 16.219v3.781h-1.313v-9.333h3.474c0.828-0.021 1.63 0.266 2.25 0.807 0.615 0.505 0.953 1.219 0.943 1.974 0.010 0.766-0.339 1.5-0.943 1.979-0.604 0.531-1.354 0.792-2.25 0.792zM14.641 11.818v3.255h2.198c0.484 0.016 0.958-0.161 1.297-0.479 0.339-0.302 0.526-0.714 0.526-1.141 0-0.432-0.188-0.844-0.526-1.141-0.349-0.333-0.818-0.51-1.297-0.495zM22.63 13.333c0.833 0 1.495 0.234 1.979 0.698s0.724 1.099 0.724 1.906v3.859h-1.083v-0.87h-0.047c-0.469 0.714-1.089 1.073-1.865 1.073-0.667 0-1.219-0.203-1.667-0.615-0.438-0.385-0.682-0.948-0.672-1.531 0-0.646 0.234-1.161 0.708-1.547 0.469-0.38 1.099-0.573 1.885-0.573 0.672 0 1.224 0.13 1.656 0.385v-0.271c0.005-0.396-0.167-0.776-0.464-1.042-0.297-0.276-0.688-0.432-1.094-0.427-0.63 0-1.13 0.276-1.5 0.828l-0.995-0.646c0.547-0.818 1.359-1.229 2.432-1.229zM21.167 17.88c-0.005 0.302 0.135 0.583 0.375 0.766 0.25 0.203 0.563 0.313 0.88 0.307 0.474 0 0.932-0.198 1.271-0.547 0.359-0.333 0.563-0.802 0.563-1.292-0.354-0.292-0.844-0.438-1.474-0.438-0.464 0-0.844 0.115-1.151 0.344-0.307 0.234-0.464 0.516-0.464 0.859zM5.443 10.667c1.344-0.016 2.646 0.479 3.641 1.391l-1.552 1.521c-0.568-0.526-1.318-0.813-2.089-0.797-1.385 0.005-2.609 0.891-3.057 2.198-0.229 0.661-0.229 1.38 0 2.042 0.448 1.307 1.672 2.193 3.057 2.198 0.734 0 1.365-0.182 1.854-0.505 0.568-0.375 0.964-0.958 1.083-1.625h-2.938v-2.052h5.13c0.063 0.359 0.094 0.719 0.094 1.083 0 1.625-0.594 3-1.62 3.927-0.901 0.813-2.135 1.286-3.604 1.286-2.047 0.010-3.922-1.125-4.865-2.938-0.771-1.505-0.771-3.286 0-4.792 0.943-1.813 2.818-2.948 4.859-2.938z"></path>
    </svg>
  )

  const ApplePayIcon = () => (
    <svg fill="currentColor" viewBox="0 0 640 512" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
      <path d="M116.9 158.5c-7.5 8.9-19.5 15.9-31.5 14.9-1.5-12 4.4-24.8 11.3-32.6 7.5-9.1 20.6-15.6 31.3-16.1 1.2 12.4-3.7 24.7-11.1 33.8m10.9 17.2c-17.4-1-32.3 9.9-40.5 9.9-8.4 0-21-9.4-34.8-9.1-17.9.3-34.5 10.4-43.6 26.5-18.8 32.3-4.9 80 13.3 106.3 8.9 13 19.5 27.3 33.5 26.8 13.3-.5 18.5-8.6 34.5-8.6 16.1 0 20.8 8.6 34.8 8.4 14.5-.3 23.6-13 32.5-26 10.1-14.8 14.3-29.1 14.5-29.9-.3-.3-28-10.9-28.3-42.9-.3-26.8 21.9-39.5 22.9-40.3-12.5-18.6-32-20.6-38.8-21.1m100.4-36.2v194.9h30.3v-66.6h41.9c38.3 0 65.1-26.3 65.1-64.3s-26.4-64-64.1-64h-73.2zm30.3 25.5h34.9c26.3 0 41.3 14 41.3 38.6s-15 38.8-41.4 38.8h-34.8V165zm162.2 170.9c19 0 36.6-9.6 44.6-24.9h.6v23.4h28v-97c0-28.1-22.5-46.3-57.1-46.3-32.1 0-55.9 18.4-56.8 43.6h27.3c2.3-12 13.4-19.9 28.6-19.9 18.5 0 28.9 8.6 28.9 24.5v10.8l-37.8 2.3c-35.1 2.1-54.1 16.5-54.1 41.5.1 25.2 19.7 42 47.8 42zm8.2-23.1c-16.1 0-26.4-7.8-26.4-19.6 0-12.3 9.9-19.4 28.8-20.5l33.6-2.1v11c0 18.2-15.5 31.2-36 31.2zm102.5 74.6c29.5 0 43.4-11.3 55.5-45.4L640 193h-30.8l-35.6 115.1h-.6L537.4 193h-31.6L557 334.9l-2.8 8.6c-4.6 14.6-12.1 20.3-25.5 20.3-2.4 0-7-.3-8.9-.5v23.4c1.8.4 9.3.7 11.6.7z"></path>
    </svg>
  )

  const PayPalIcon = () => (
    <svg fill="currentColor" viewBox="0 0 576 512" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
      <path d="M186.3 258.2c0 12.2-9.7 21.5-22 21.5-9.2 0-16-5.2-16-15 0-12.2 9.5-22 21.7-22 9.3 0 16.3 5.7 16.3 15.5zM80.5 209.7h-4.7c-1.5 0-3 1-3.2 2.7l-4.3 26.7 8.2-.3c11 0 19.5-1.5 21.5-14.2 2.3-13.4-6.2-14.9-17.5-14.9zm284 0H360c-1.8 0-3 1-3.2 2.7l-4.2 26.7 8-.3c13 0 22-3 22-18-.1-10.6-9.6-11.1-18.1-11.1zM576 80v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h480c26.5 0 48 21.5 48 48zM128.3 215.4c0-21-16.2-28-34.7-28h-40c-2.5 0-5 2-5.2 4.7L32 294.2c-.3 2 1.2 4 3.2 4h19c2.7 0 5.2-2.9 5.5-5.7l4.5-26.6c1-7.2 13.2-4.7 18-4.7 28.6 0 46.1-17 46.1-45.8zm84.2 8.8h-19c-3.8 0-4 5.5-4.2 8.2-5.8-8.5-14.2-10-23.7-10-24.5 0-43.2 21.5-43.2 45.2 0 19.5 12.2 32.2 31.7 32.2 9 0 20.2-4.9 26.5-11.9-.5 1.5-1 4.7-1 6.2 0 2.3 1 4 3.2 4H200c2.7 0 5-2.9 5.5-5.7l10.2-64.3c.3-1.9-1.2-3.9-3.2-3.9zm40.5 97.9l63.7-92.6c.5-.5.5-1 .5-1.7 0-1.7-1.5-3.5-3.2-3.5h-19.2c-1.7 0-3.5 1-4.5 2.5l-26.5 39-11-37.5c-.8-2.2-3-4-5.5-4h-18.7c-1.7 0-3.2 1.8-3.2 3.5 0 1.2 19.5 56.8 21.2 62.1-2.7 3.8-20.5 28.6-20.5 31.6 0 1.8 1.5 3.2 3.2 3.2h19.2c1.8-.1 3.5-1.1 4.5-2.6zm159.3-106.7c0-21-16.2-28-34.7-28h-39.7c-2.7 0-5.2 2-5.5 4.7l-16.2 102c-.2 2 1.3 4 3.2 4h20.5c2 0 3.5-1.5 4-3.2l4.5-29c1-7.2 13.2-4.7 18-4.7 28.4 0 45.9-17 45.9-45.8zm84.2 8.8h-19c-3.8 0-4 5.5-4.3 8.2-5.5-8.5-14-10-23.7-10-24.5 0-43.2 21.5-43.2 45.2 0 19.5 12.2 32.2 31.7 32.2 9.3 0 20.5-4.9 26.5-11.9-.3 1.5-1 4.7-1 6.2 0 2.3 1 4 3.2 4H484c2.7 0 5-2.9 5.5-5.7l10.2-64.3c.3-1.9-1.2-3.9-3.2-3.9zm47.5-33.3c0-2-1.5-3.5-3.2-3.5h-18.5c-1.5 0-3 1.2-3.2 2.7l-16.2 104-.3.5c0 1.8 1.5 3.5 3.5 3.5h16.5c2.5 0 5-2.9 5.2-5.7L544 191.2v-.3zm-90 51.8c-12.2 0-21.7 9.7-21.7 22 0 9.7 7 15 16.2 15 12 0 21.7-9.2 21.7-21.5.1-9.8-6.9-15.5-16.2-15.5z"></path>
    </svg>
  )

  const CreditCardIcon = () => (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path d="M0 0h24v24H0z" fill="none"></path>
        <path d="M22.222 15.768l-.225-1.125h-2.514l-.4 1.117-2.015.004a4199.19 4199.19 0 0 1 2.884-6.918c.164-.391.455-.59.884-.588.328.003.863.003 1.606.001L24 15.765l-1.778.003zm-2.173-2.666h1.62l-.605-2.82-1.015 2.82zM7.06 8.257l2.026.002-3.132 7.51-2.051-.002a950.849 950.849 0 0 1-1.528-5.956c-.1-.396-.298-.673-.679-.804C1.357 8.89.792 8.71 0 8.465V8.26h3.237c.56 0 .887.271.992.827.106.557.372 1.975.8 4.254L7.06 8.257zm4.81.002l-1.602 7.508-1.928-.002L9.94 8.257l1.93.002zm3.91-.139c.577 0 1.304.18 1.722.345l-.338 1.557c-.378-.152-1-.357-1.523-.35-.76.013-1.23.332-1.23.638 0 .498.816.749 1.656 1.293.959.62 1.085 1.177 1.073 1.782-.013 1.256-1.073 2.495-3.309 2.495-1.02-.015-1.388-.101-2.22-.396l.352-1.625c.847.355 1.206.468 1.93.468.663 0 1.232-.268 1.237-.735.004-.332-.2-.497-.944-.907-.744-.411-1.788-.98-1.774-2.122.017-1.462 1.402-2.443 3.369-2.443z"></path>
      </g>
    </svg>
  )

  const PayAtVenueIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M5 3C3.89543 3 3 3.89543 3 5V6.83772L1.49006 11.3675C1.10052 12.5362 1.8474 13.7393 3 13.963V20C3 21.1046 3.89543 22 5 22H9H10H14H15H19C20.1046 22 21 21.1046 21 20V13.963C22.1526 13.7393 22.8995 12.5362 22.5099 11.3675L21 6.83772V5C21 3.89543 20.1046 3 19 3H5ZM15 20H19V14H17.5H12H6.5H5V20H9V17C9 15.3431 10.3431 14 12 14C13.6569 14 15 15.3431 15 17V20ZM11 20H13V17C13 16.4477 12.5523 16 12 16C11.4477 16 11 16.4477 11 17V20ZM3.38743 12L4.72076 8H6.31954L5.65287 12H4H3.38743ZM7.68046 12L8.34713 8H11V12H7.68046ZM13 12V8H15.6529L16.3195 12H13ZM18.3471 12L17.6805 8H19.2792L20.6126 12H20H18.3471ZM19 5V6H16.5H12H7.5H5V5H19Z"/>
    </svg>
  )

  // Payment Method Handlers
  const paymentMethods = [
    { id: 'google', name: 'Google Pay', icon: GooglePayIcon },
    { id: 'apple', name: 'Apple Pay', icon: ApplePayIcon },
    { id: 'paypal', name: 'PayPal', icon: PayPalIcon },
    { id: 'visa', name: 'Credit Card', icon: CreditCardIcon },
    { id: 'venue', name: 'Pay at Venue', icon: PayAtVenueIcon }
  ]

  const handlePaymentMethodSelect = (method: any) => {
    setSelectedPaymentMethod(method.name)
    setShowPaymentDropdown(false)
    
    // Show card modal if Credit Card is selected
    if (method.id === 'visa') {
      setShowCardModal(true)
    }
  }

  // Handle appointment submission
  const handleSubmitAppointment = async () => {
    setIsSubmitting(true)
    
    try {
      // Future API call will go here
      // const response = await submitAppointment({...appointmentData})
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Show confirmation popup on success
      setShowConfirmationPopup(true)
    } catch (error) {
      console.error('Failed to submit appointment:', error)
      // Handle error - could show error popup or message
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const detectCardType = (number: string) => {
    const patterns = {
      visa: /^4/,
      mastercard: /^5[1-5]/,
      amex: /^3[47]/,
      discover: /^6/
    }
    
    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(number)) {
        return type
      }
    }
    return 'unknown'
  }

  const validateCardDetails = () => {
    const errors = {
      cardName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: ''
    }

    if (!cardDetails.cardName.trim()) {
      errors.cardName = 'Full name is required'
    }

    const cleanCardNumber = cardDetails.cardNumber.replace(/\s/g, '')
    if (!cleanCardNumber) {
      errors.cardNumber = 'Card number is required'
    } else if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
      errors.cardNumber = 'Invalid card number'
    }

    if (!cardDetails.expiryDate) {
      errors.expiryDate = 'Expiry date is required'
    } else if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiryDate)) {
      errors.expiryDate = 'Invalid format (MM/YY)'
    }

    if (!cardDetails.cvv) {
      errors.cvv = 'CVV is required'
    } else if (cardDetails.cvv.length < 3 || cardDetails.cvv.length > 4) {
      errors.cvv = 'Invalid CVV'
    }

    setCardErrors(errors)
    return Object.values(errors).every(error => !error)
  }

  const handleCardSubmit = () => {
    if (validateCardDetails()) {
      setShowCardModal(false)
      // Card details are valid, form closes
    }
  }

  const handleCardInputChange = (field: string, value: string) => {
    let formattedValue = value

    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value)
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryDate(value)
    } else if (field === 'cvv') {
      formattedValue = value.replace(/[^0-9]/g, '').substring(0, 4)
    }

    setCardDetails(prev => ({
      ...prev,
      [field]: formattedValue
    }))

    // Clear error when user starts typing
    if (cardErrors[field as keyof typeof cardErrors]) {
      setCardErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const totals = calculateTotal()

  return (
    <div className="fixed inset-0 bg-black text-white z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-black/90 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Back button - always visible */}
            <button onClick={handleBack} className="flex items-center text-gray-300 hover:text-white">
              <ArrowLeft size={20} className="mr-2" />
              Back
            </button>
            <h1 className="text-xl font-bold">Book Appointment</h1>
            {/* Close button - always visible */}
            <button 
              onClick={() => window.history.back()} 
              className="flex items-center justify-center w-8 h-8 text-gray-300 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Progress Steps - Compact */}
      <div className="bg-gray-900/50 py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center mb-1 ${
                    isActive ? 'bg-amber-500 text-black' : 
                    isCompleted ? 'bg-green-500 text-white' : 
                    'bg-gray-700 text-gray-400'
                  }`}>
                    <Icon size={12} />
                  </div>
                  <span className={`text-xs ${isActive ? 'text-amber-400' : 'text-gray-400'}`}>
                    {step.title}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-4 py-8 pb-16">
        {currentStep === 1 && (
          <div className="w-full px-3 py-4 scale-75 origin-top transform">
            <h2 className="text-xl font-bold text-center mb-3 text-amber-400">Services & Barber Selection</h2>
            
            {/* Side-by-Side Layout */}
            <div className="flex flex-col lg:flex-row gap-4 max-h-[85vh]">
              
              {/* Left Side - Services Selection */}
              <div className="w-full lg:w-1/2 flex flex-col">
                <h3 className="text-lg font-semibold mb-3 text-amber-400">Select Services</h3>
            
                {/* Service Categories - Compact tabs */}
                <div className="flex overflow-x-auto mb-3 pb-1">
              {currentServiceCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                      className={`px-3 py-1.5 rounded-full mr-2 whitespace-nowrap text-xs ${
                    activeCategory === category.id
                      ? 'bg-amber-500 text-black'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {category.title}
                </button>
              ))}
            </div>

                {/* Services List - Fixed Height Container with Internal Scroll */}
                <div className="flex-1">
                  <div className="bg-gray-900/30 rounded-lg p-2.5 max-h-[320px] overflow-y-auto scrollbar-hide">
                    <div className="space-y-1.5">
                {currentServiceCategories
                  .find(cat => cat.id === activeCategory)
                  ?.services.map((service) => {
                    const isSelected = selectedServices.find(s => s.id === service.id)
                    const isExpanded = expandedServices.includes(service.id)
                    return (
                      <div key={service.id} className="bg-gray-900/50 rounded-lg border border-gray-700">
                              {/* Service Header - Compact */}
                              <div className="flex items-center p-2.5">
                          <div className="flex-1 flex items-center">
                                  <h4 className="text-sm font-semibold text-white">{service.name}</h4>
                            {service.description && (
                              <button
                                onClick={() => handleServiceExpand(service.id)}
                                      className="ml-1.5"
                              >
                                <svg 
                                        className={`w-3 h-3 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                  fill="none" 
                                  stroke="currentColor" 
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                            )}
                          </div>
                          
                                <div className="text-right mr-2">
                                  <div className="text-amber-400 font-bold text-xs">${formatPrice(service.price)}</div>
                                  <div className="text-gray-300 text-xs">{service.duration}min</div>
                          </div>
                          
                          <button
                            onClick={() => handleServiceToggle(service)}
                                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              isSelected
                                ? 'bg-amber-500 border-amber-500 text-black'
                                : 'border-gray-400 text-gray-400'
                            }`}
                          >
                                  {isSelected && <CheckCircle size={12} />}
                          </button>
                        </div>
                        
                        {isExpanded && service.description && (
                                <div className="px-2.5 pb-2 border-t border-gray-700">
                                  <p className="text-gray-400 text-xs mt-1.5">{service.description}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
              </div>
            </div>
                </div>
              </div>
              
              {/* Right Side - Barber Selection */}
              <div className="w-full lg:w-1/2 flex flex-col">
                <h3 className="text-lg font-semibold mb-3 text-amber-400">Choose Barber</h3>
                
                {/* Ultra-Compact Barber Type Selection */}
                <div className="grid grid-cols-2 gap-2 mb-2">
              <button
                onClick={() => setBarberType('any')}
                    className={`p-2 rounded-lg border-2 transition-all ${
                  barberType === 'any'
                    ? 'border-amber-500 bg-amber-500/10'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                    <h4 className="text-xs font-semibold">Any Available</h4>
                    <span className="text-xs font-bold text-green-400">FREE</span>
              </button>
              
              <button
                onClick={() => setBarberType('specific')}
                    className={`p-2 rounded-lg border-2 transition-all ${
                  barberType === 'specific'
                    ? 'border-amber-500 bg-amber-500/10'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                    <h4 className="text-xs font-semibold">Specific Barber</h4>
                    <span className="text-xs font-bold text-amber-400">+$20</span>
              </button>
            </div>

                {/* Barber Selection List */}
            {barberType === 'specific' && (
                  <div className="flex-1">
                    <div className="bg-gray-900/30 rounded-lg p-2.5 max-h-[320px] overflow-y-auto scrollbar-hide">
                      <h4 className="text-sm font-medium text-amber-400 mb-2 text-center">Select Your Barber</h4>
                      <div className="grid grid-cols-1 gap-2">
                {currentBarbers.map((barber) => (
                  <div
                    key={barber.id}
                    onClick={() => setSelectedBarber(barber)}
                            className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:scale-[1.01] ${
                      selectedBarber?.id === barber.id
                        ? 'border-amber-500 bg-amber-500/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                            <div className="flex items-center space-x-2.5">
                      <Image
                        src={(barber as any).profile_image || (barber as any).image || '/images/default-barber.jpg'}
                        alt={barber.name}
                                width={40}
                                height={40}
                                className="rounded-full object-cover flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <h5 className="text-sm font-semibold truncate">{barber.name}</h5>
                                <p className="text-gray-400 text-xs truncate">
                                  {(() => {
                                    try {
                                      const specialties = typeof barber.specialties === 'string' 
                                        ? JSON.parse(barber.specialties) 
                                        : barber.specialties;
                                      return Array.isArray(specialties) 
                                        ? specialties.join(', ') 
                                        : (barber as any).specialization || 'General Barber';
                                    } catch {
                                      return (barber as any).specialization || 'General Barber';
                                    }
                                  })()}
                                </p>
                                <div className="flex items-center mt-0.5">
                                  <span className="text-amber-400 text-xs">★ {barber.rating || '4.5'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                      </div>
                    </div>
              </div>
            )}
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="w-full scale-75 origin-top transform">
            <h2 className="text-xl font-bold text-center mb-4 text-amber-400">Choose Day & Time</h2>
            
            {/* Side-by-Side Layout - 30% Calendar + 70% Available Times */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Side - Calendar (30% width) */}
              <div className="w-full lg:w-[30%] flex-shrink-0">
                {/* Available Slot Button */}
                <div className="flex justify-center mb-4">
                  <button
                    onClick={findAvailableSlot}
                    className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all text-sm font-medium border border-green-500/30 hover:border-green-500/50"
                  >
                    🟢 Available Slot
                  </button>
                </div>

                {/* Compact React Day Picker Calendar */}
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <div className="flex justify-center">
                    <DayPicker
                      mode="single"
                      selected={selectedDate ? new Date(selectedDate) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          // Use local date formatting to avoid timezone issues
                          const year = date.getFullYear()
                          const month = String(date.getMonth() + 1).padStart(2, '0')
                          const day = String(date.getDate()).padStart(2, '0')
                          setSelectedDate(`${year}-${month}-${day}`)
                        }
                      }}
                      className="rdp-custom rdp-compact"
                      modifiers={{
                        today: new Date(),
                      }}
                      modifiersStyles={{
                        selected: {
                          backgroundColor: '#fbbf24',
                          color: '#000000',
                        },
                        today: {
                          border: '2px solid #fbbf24',
                        }
                      }}
                    />
              </div>
              
                  {/* Availability Indicator */}
                  {selectedDate && (
                    <div className="text-center mt-2">
                      {isLoadingSlots ? (
                        <p className="text-xs text-amber-400">Loading available slots...</p>
                      ) : loadingSlotsError ? (
                        <p className="text-xs text-red-400">{loadingSlotsError}</p>
                      ) : (
                        <div className="text-xs">
                          <p className="text-gray-400">
                            {timeSlots.length - currentDateBookedSlots.length} available, {currentDateBookedSlots.length} booked for {new Date(selectedDate).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                          </p>
                          {selectedTime && (
                            <p className="text-amber-400 mt-1">
                              ✨ Auto-selected: {selectedTime}
                              {selectedDate !== defaultDate && (
                                <span className="block text-xs text-green-400 mt-1">
                                  📅 Moved to next available date
                                </span>
                              )}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  </div>
              </div>
              
              {/* Right Side - Time Slots (70% width - Always Visible) */}
              <div className="w-full lg:w-[70%] flex-grow">
                <div className="bg-gray-900/50 rounded-lg p-5 max-h-[500px] overflow-y-auto scrollbar-hide">
                  <h3 className="text-xl font-semibold mb-4">
                    Available Times
                    {selectedDate && (
                      <span className="text-sm text-gray-400 font-normal ml-2">
                        - {new Date(selectedDate).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    )}
                  </h3>
                    
                    {/* Quick Time Selection */}
                    <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                      <h4 className="text-sm font-medium text-gray-300 mb-2 text-center">
                        Popular Times
                        {selectedDate && (
                          <span className="block text-xs text-amber-400 mt-1">
                            {new Date(selectedDate).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric' 
                            })}
                          </span>
                        )}
                        {/* Loading/Error Status */}
                        {isLoadingSlots && (
                          <span className="block text-xs text-blue-400 mt-1 flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Loading availability...
                          </span>
                        )}
                        {loadingSlotsError && (
                          <span className="block text-xs text-orange-400 mt-1 text-center">
                            {loadingSlotsError}
                          </span>
                        )}
                      </h4>
                      <div className="flex gap-2 flex-wrap justify-center">
                        {['10:00 AM', '2:00 PM', '5:00 PM', '6:00 PM'].map(time => {
                          const isBooked = currentDateBookedSlots.includes(time)
                          const isSelected = selectedTime === time
                          const isBlocked = currentDateBlockedSlots.includes(time)
                          
                          // Debug logging for popular times
                          if (time.includes('5:00') || time.includes('6:00')) {
                            console.log(`🔍 Popular ${time} Debug:`, {
                              time,
                              currentDateBlockedSlots: currentDateBlockedSlots,
                              isBlocked: isBlocked,
                              blockedSlotsLength: currentDateBlockedSlots.length
                            })
                          }
                          
                          return (
                            <button
                              key={time}
                              onClick={() => {
                                if (!isBooked) {
                                  setSelectedTime(time)
                                  setShowTimeValidationPopup(false) // Clear validation popup on new selection
                                  setTimeValidationData(null)
                                }
                              }}
                              disabled={isBooked}
                              className={`quick-time-button px-3 py-1 rounded text-sm transition-all ${
                                isSelected
                                  ? 'bg-amber-500 text-black'
                                  : isBooked
                                  ? 'bg-red-500/20 text-red-400 cursor-not-allowed'
                                  : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                              }`}
                            >
                              {isBlocked ? '🚫 BLOCKED' : time}
                            </button>
                          )
                        })}
                      </div>
                    </div>
            
            <div className="space-y-6">
                      {/* Morning Section */}
              <div>
                        <h4 className="text-amber-400 font-semibold mb-3 flex items-center">
                          <span className="mr-2">🌅</span> Morning
                        </h4>
                        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                          {timeSections.morning.map((slot) => {
                            const isBooked = currentDateBookedSlots.includes(slot.display)
                            const isSelected = selectedTime === slot.display
                            const isBlocked = currentDateBlockedSlots.includes(slot.display)
                            
                            // Debug logging for all morning slots to see booking status
                            if (slot.display.includes('9:00') || slot.display.includes('10:00') || slot.display.includes('11:00')) {
                              console.log(`🔍 ${slot.display} Debug:`, {
                                slotDisplay: slot.display,
                                currentDateBookedSlots: currentDateBookedSlots,
                                currentDateBlockedSlots: currentDateBlockedSlots,
                                isBooked: isBooked,
                                isBlocked: isBlocked,
                                selectedDate: selectedDate,
                                bookedSlotsLength: currentDateBookedSlots.length,
                                blockedSlotsLength: currentDateBlockedSlots.length,
                                exactMatch: currentDateBookedSlots.includes(slot.display)
                              })
                            }
                            return (
                              <button
                                key={slot.time}
                                onClick={() => {
                                  if (!isBooked) {
                                    setSelectedTime(slot.display)
                                    setShowTimeValidationPopup(false) // Clear validation popup on new selection
                                    setTimeValidationData(null)
                                  }
                                }}
                                disabled={isBooked}
                                className={`py-2 px-3 rounded text-sm transition-all ${
                                  isBooked
                                    ? 'bg-red-600 text-red-200 cursor-not-allowed opacity-50'
                                    : isSelected
                                    ? 'bg-amber-500 text-black font-semibold'
                                    : 'bg-gray-800 hover:bg-gray-700 hover:scale-105'
                                }`}
                              >
                                {isBlocked ? '🚫 BLOCKED' : slot.display}
                              </button>
                            )
                          })}
                        </div>
              </div>
              
                      {/* Afternoon Section */}
              <div>
                        <h4 className="text-amber-400 font-semibold mb-3 flex items-center">
                          <span className="mr-2">☀️</span> Afternoon
                        </h4>
                        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                          {timeSections.afternoon.map((slot) => {
                            const isBooked = currentDateBookedSlots.includes(slot.display)
                            const isSelected = selectedTime === slot.display
                            const isBlocked = currentDateBlockedSlots.includes(slot.display)
                            
                            // Debug logging for afternoon slots to see blocked status
                            if (slot.display.includes('4:') || slot.display.includes('5:00')) {
                              console.log(`🔍 Afternoon ${slot.display} Debug:`, {
                                slotDisplay: slot.display,
                                slotTime: slot.time,
                                currentDateBlockedSlots: currentDateBlockedSlots,
                                isBlocked: isBlocked,
                                blockedSlotsLength: currentDateBlockedSlots.length,
                                blockedSlotsArray: currentDateBlockedSlots
                              })
                            }
                            
                            return (
                              <button
                                key={slot.time}
                                onClick={() => {
                                  if (!isBooked) {
                                    setSelectedTime(slot.display)
                                    setShowTimeValidationPopup(false) // Clear validation popup on new selection
                                    setTimeValidationData(null)
                                  }
                                }}
                                disabled={isBooked}
                                className={`py-2 px-3 rounded text-sm transition-all ${
                                  isBooked
                                    ? 'bg-red-600 text-red-200 cursor-not-allowed opacity-50'
                                    : isSelected
                                    ? 'bg-amber-500 text-black font-semibold'
                                    : 'bg-gray-800 hover:bg-gray-700 hover:scale-105'
                                }`}
                              >
                                {isBlocked ? '🚫 BLOCKED' : slot.display}
                              </button>
                            )
                          })}
                        </div>
            </div>

                      {/* Evening Section */}
                      <div>
                        <h4 className="text-amber-400 font-semibold mb-3 flex items-center">
                          <span className="mr-2">🌙</span> Evening
                        </h4>
                        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                          {timeSections.evening.map((slot) => {
                            const isBooked = currentDateBookedSlots.includes(slot.display)
                            const isSelected = selectedTime === slot.display
                            const isBlocked = currentDateBlockedSlots.includes(slot.display)
                            
                            // Debug logging for evening slots to see blocked status
                            if (slot.display.includes('5:') || slot.display.includes('6:') || slot.display.includes('7:')) {
                              console.log(`🔍 Evening ${slot.display} Debug:`, {
                                slotDisplay: slot.display,
                                slotTime: slot.time,
                                currentDateBlockedSlots: currentDateBlockedSlots,
                                isBlocked: isBlocked,
                                blockedSlotsLength: currentDateBlockedSlots.length,
                                blockedSlotsArray: currentDateBlockedSlots,
                                exactMatch: currentDateBlockedSlots.includes(slot.display)
                              })
                            }
                            
                            return (
                              <button
                                key={slot.time}
                                onClick={() => {
                                  if (!isBooked) {
                                    setSelectedTime(slot.display)
                                    setShowTimeValidationPopup(false) // Clear validation popup on new selection
                                    setTimeValidationData(null)
                                  }
                                }}
                                disabled={isBooked}
                                className={`py-2 px-3 rounded text-sm transition-all ${
                                  isBooked
                                    ? 'bg-red-600 text-red-200 cursor-not-allowed opacity-50'
                                    : isSelected
                                    ? 'bg-amber-500 text-black font-semibold'
                                    : 'bg-gray-800 hover:bg-gray-700 hover:scale-105'
                                }`}
                              >
                                {isBlocked ? '🚫 BLOCKED' : slot.display}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                </div>
              </div>
              </div>
            </div>

          </div>
        )}


        {currentStep === 3 && (
          <div className="max-w-4xl mx-auto flex justify-center scale-75 origin-top transform">
            {/* Styled Form Container - Compact */}
            <div className="styled-form-card1 w-full max-w-2xl">
              <div className="styled-form-card2">
                <form className="styled-form">
                  <p className="styled-form-heading">Contact & Details</p>
                  
                                    {/* Full Name */}
                  <div className="styled-form-field">
                <input
                      required
                      placeholder="Full Name"
                      className="styled-input-field"
                  type="text"
                  value={customerDetails.firstName}
                  onChange={(e) => setCustomerDetails(prev => ({ ...prev, firstName: e.target.value }))}
                />
              </div>
              
                  {/* Email */}
                  <div className="styled-form-field">
                <input
                      required
                      placeholder="Email Address"
                      className="styled-input-field"
                  type="email"
                  value={customerDetails.email}
                  onChange={(e) => setCustomerDetails(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              
                  {/* Phone */}
                  <div className="styled-form-field">
                <input
                      required
                      placeholder="Phone Number"
                      className="styled-input-field"
                  type="tel"
                  value={customerDetails.phone}
                  onChange={(e) => setCustomerDetails(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              
                  {/* Message */}
                  <div className="styled-form-field">
                <textarea
                      placeholder="Any special requests or notes..."
                      className="styled-input-field"
                      rows={3}
                  value={customerDetails.message}
                  onChange={(e) => setCustomerDetails(prev => ({ ...prev, message: e.target.value }))}
                />
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="w-full px-2 scale-75 origin-top transform">
            <h2 className="text-xl font-bold text-center mb-4 text-amber-400">Payment & Review</h2>
            
            {/* 2-Column Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 grid-rows-1 lg:grid-rows-3 gap-4">
              
              {/* Div 1 - Service Summary (Row Span 3) */}
              <div className="lg:row-span-3 bg-gray-900/50 rounded-lg p-6 max-h-[500px] overflow-y-auto scrollbar-hide">
                <h3 className="text-xl font-semibold mb-4 sticky top-0 bg-gray-900/50 pb-2">Service Summary</h3>
                <div className="space-y-2">
              {selectedServices.map((service) => (
                    <div key={service.id} className="flex items-center justify-between py-2 border-b border-gray-700 group">
                      <span className="flex-1">{service.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">${formatPrice(service.price)}</span>
                        <button
                          onClick={() => handleServiceToggle(service)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-red-500/20 rounded-full"
                          title="Remove service"
                        >
                          <svg 
                            className="w-4 h-4 text-red-400 hover:text-red-300" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                </div>
              ))}
              {barberType === 'specific' && (
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span>Specific Barber Fee</span>
                  <span>$20</span>
                </div>
              )}
                  <div className="flex justify-between py-2 font-semibold text-amber-400 text-lg">
                <span>Subtotal</span>
                <span>${totals.subtotal}</span>
                  </div>
              </div>
            </div>

              {/* Div 2 - Tip Selection - Compact */}
              <div className="bg-gray-900/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3">Tip Selection</h3>
                <div className="grid grid-cols-5 gap-1 mb-2">
                {['Later', '15%', '18%', '20%', 'Custom'].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                        if (option === 'Custom') {
                          handleCustomTipClick()
                        } else if (option === 'Later') {
                          handlePresetTipClick(0)
                        } else if (option === '15%') {
                          handlePresetTipClick(15)
                        } else if (option === '18%') {
                          handlePresetTipClick(18)
                        } else if (option === '20%') {
                          handlePresetTipClick(20)
                        }
                      }}
                      className={`px-2 py-1.5 rounded text-xs transition-all ${
                        (option === 'Custom' && customTipActive) ||
                        (option === '18%' && tipPercentage === 18 && !customTipActive) ||
                        (option === '15%' && tipPercentage === 15 && !customTipActive) ||
                        (option === '20%' && tipPercentage === 20 && !customTipActive) ||
                        (option === 'Later' && tipPercentage === 0 && !customTipActive)
                          ? 'bg-amber-500 text-black font-semibold'
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

                {/* Custom Tip Input - Only appears when Custom is selected */}
                {customTipActive && (
                  <div className="mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={customTipValue}
                          onChange={(e) => handleCustomTipInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleCustomTipSubmit()
                            }
                          }}
                          placeholder={customTipType === 'dollar' ? '$25' : '25%'}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-sm focus:border-amber-500 focus:outline-none"
                          autoFocus
                        />
                        <span className="absolute right-3 top-2 text-gray-400 text-sm">
                          {customTipType === 'dollar' ? '$' : '%'}
                        </span>
                      </div>
                      <button
                        onClick={handleCustomTipSubmit}
                        className="px-3 py-2 bg-amber-500 text-black rounded text-sm font-medium hover:bg-amber-400 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {customTipError && (
                      <p className="text-red-400 text-xs mt-1">{customTipError}</p>
                    )}
                    <p className="text-gray-400 text-xs mt-1">
                      Enter dollar amount ($5-$300) or percentage (5%-300%)
                    </p>
                  </div>
                )}

                {/* Tip Display */}
                {(tipPercentage > 0 && !customTipActive) && (
                  <div className="flex justify-between py-1 text-amber-400 text-sm">
                  <span>Tip ({tipPercentage}%)</span>
                  <span>${totals.tip.toFixed(2)}</span>
                </div>
              )}
                {(customTipActive && customTipValue && !customTipError) && (
                  <div className="flex justify-between py-1 text-amber-400 text-sm">
                    <span>Tip (Custom)</span>
                  <span>${totals.tip.toFixed(2)}</span>
                </div>
              )}
            </div>

              {/* Div 3 - Payment Method - Compact */}
              <div className="lg:col-start-2 bg-gray-900/50 rounded-lg p-3 relative">
                <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
                
                {/* Payment Method Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowPaymentDropdown(!showPaymentDropdown)}
                    className="w-full flex items-center justify-between p-3 border border-gray-700 rounded-lg hover:border-amber-500/50 transition-colors cursor-pointer bg-gray-800"
                  >
                    <div className="flex items-center space-x-3">
                      {selectedPaymentMethod ? (
                        (() => {
                          const selectedMethod = paymentMethods.find(method => method.name === selectedPaymentMethod)
                          const IconComponent = selectedMethod?.icon || CreditCardIcon
                          return (
                            <>
                              <div className="w-8 h-8 bg-amber-500 rounded flex items-center justify-center text-black">
                                <IconComponent />
              </div>
                              <span className="text-white">{selectedPaymentMethod}</span>
                            </>
                          )
                        })()
                      ) : (
                        <>
                          <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                            <CreditCard className="w-4 h-4 text-gray-400" />
            </div>
                          <span className="text-gray-400">Select Payment Method</span>
                        </>
                      )}
                    </div>
                    <svg className={`w-4 h-4 transition-transform ${showPaymentDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Options */}
                  {showPaymentDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden">
                      {paymentMethods.map((method) => {
                        const IconComponent = method.icon
                        return (
                          <button
                            key={method.id}
                            onClick={() => handlePaymentMethodSelect(method)}
                            className="w-full flex items-center space-x-3 p-3 hover:bg-amber-500/10 hover:border-amber-500/20 transition-all cursor-pointer border-b border-gray-700 last:border-b-0"
                          >
                            <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                              <IconComponent />
              </div>
                            <span className="text-white font-medium">{method.name}</span>
                            {method.id === 'visa' && (
                              <span className="text-xs text-gray-400 ml-auto">Opens card form</span>
                            )}
                          </button>
                        )
                      })}
            </div>
        )}
          </div>
              </div>

              {/* Div 4 - Total - Compact */}
              <div className="lg:col-start-2 lg:row-start-3 bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/20 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-xl font-bold text-amber-400">${totals.total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">All taxes and fees included</p>
                
                {/* Proceed to Review Button */}
                {selectedPaymentMethod && (
                  <div>
                    <button
                      onClick={() => {
                        if (canProceedToReview()) {
                          setShowAppointmentSummary(true)
                          setAppointmentError('') // Clear any previous errors
                        }
                      }}
                      disabled={!canProceedToReview()}
                      className={`w-full mt-3 py-2 px-4 rounded-lg font-semibold transition-colors text-sm ${
                        canProceedToReview() 
                          ? 'bg-amber-500 hover:bg-amber-600 text-black' 
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Proceed to Review
                    </button>
                    {!canProceedToReview() && selectedPaymentMethod === 'Credit Card' && (
                      <p className="text-red-400 text-xs mt-2 text-center">
                        Please complete card details to proceed
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
            
          </div>
        )}


        {/* Appointment Summary Popup */}
        {showAppointmentSummary && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-gray-900 rounded-lg p-6 max-w-lg w-full mx-4 border border-gray-700 relative scale-75 origin-center transform">
              {/* Close Button */}
              <button
                onClick={() => setShowAppointmentSummary(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-amber-400 mb-2">📋 Review Your Appointment</h3>
                <p className="text-gray-400 text-sm">Please review the details below before confirming</p>
                  </div>

              {/* Appointment Details */}
              <div className="bg-gray-800 rounded-lg p-4 space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Date:</span>
                  <span className="font-semibold text-white">{selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric' 
                  }) : ''}</span>
                  </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Time:</span>
                  <span className="font-semibold text-white">{selectedTime}</span>
                  </div>
                
                <div className="flex justify-between items-start">
                  <span className="text-gray-300 font-medium">Services:</span>
                  <div className="text-right">
                    {selectedServices.map(service => (
                      <div key={service.id} className="text-white font-medium">
                        {service.name} - ${formatPrice(service.price)}
                  </div>
                    ))}
                </div>
              </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Barber:</span>
                  <span className="font-semibold text-white">{barberType === 'specific' ? selectedBarber?.name : 'Any Available'}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Payment Type:</span>
                  <span className="font-semibold text-white">{selectedPaymentMethod}</span>
                </div>
                
                <div className="border-t border-gray-600 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Subtotal:</span>
                    <span className="text-white">${totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Tip:</span>
                    <span className="text-white">${totals.tip.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold mt-2 pt-2 border-t border-gray-600">
                    <span className="text-amber-400">Total:</span>
                    <span className="text-amber-400">${totals.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Important Notice */}
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 mb-6">
                <p className="text-yellow-400 text-sm text-center">
                  A temporary hold will be placed on your card for <strong>${totals.total.toFixed(2)}</strong>. 
                  You will not be charged until your appointment starts.
                </p>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleConfirmAppointment}
                disabled={isConfirming}
                className="w-full bg-amber-500 text-black py-3 rounded-lg font-bold hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isConfirming ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 818-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Confirming...
                  </>
                ) : (
                  'Confirm Appointment'
                )}
              </button>

              {/* Error Display */}
              {appointmentError && (
                <div className="mt-4 bg-red-900/20 border border-red-500/30 rounded-lg p-3 flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <p className="text-red-400 text-sm">{appointmentError}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Failure Popup */}
        {showFailurePopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-gray-900 rounded-lg p-6 max-w-sm w-full mx-4 border border-red-500/20 relative scale-75 origin-center transform">
              {/* Close Button */}
              <button
                onClick={() => setShowFailurePopup(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Failure Content */}
              <div className="text-center">
                <div className="bg-red-500/10 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-red-400 mb-2">Booking Failed!</h3>
                <p className="text-gray-400 text-sm mb-4">
                  {appointmentError || 'Something went wrong with your booking.'}<br/>
                  Please try again or contact support.
                </p>
                
                {/* Auto-dismiss indicator */}
                <div className="flex items-center justify-center text-xs text-gray-500 mb-4">
                  <svg className="animate-spin -ml-1 mr-2 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Auto-closing in a few seconds...
                </div>

                {/* Try Again Button */}
                <button
                  onClick={() => {
                    setShowFailurePopup(false)
                    setShowAppointmentSummary(true)
                  }}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors text-sm"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Popup */}
        {showConfirmationPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-gray-900 rounded-lg p-6 max-w-sm w-full mx-4 border border-green-500/20 relative scale-75 origin-center transform">
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowConfirmationPopup(false)
                  window.history.back()
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Success Content */}
              <div className="text-center">
                <div className="bg-green-500/10 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle size={48} className="text-green-500" />
      </div>
                <h3 className="text-xl font-bold text-green-400 mb-2">Appointment Confirmed!</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Your booking has been successfully scheduled.<br/>
                  You'll receive a confirmation email shortly.
                </p>
                
                {/* Auto-dismiss indicator */}
                <div className="flex items-center justify-center text-xs text-gray-500 mb-4">
                  <svg className="animate-spin -ml-1 mr-2 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Auto-closing in a few seconds...
                </div>

                {/* Done Button */}
                <button
                  onClick={() => {
                    setShowConfirmationPopup(false)
                    window.history.back()
                  }}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors text-sm"
                >
                  Done
                </button>

              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons - Compact */}
      {currentStep < 4 && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-gray-800 p-2.5">
          <div className="container mx-auto flex justify-between">
            <button
              onClick={handleBack}
              className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors text-sm"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!canProceedToNext()}
              className="px-5 py-2 bg-amber-500 text-black rounded-lg font-semibold hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Cancellation Policy Modal */}
      {showCancellationPolicy && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-4 max-w-sm w-full mx-4 scale-75 origin-center transform">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold">Cancellation Policy</h3>
              <button
                onClick={() => setShowCancellationPolicy(false)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 mb-4">
              <p className="text-gray-300 text-sm">
                Cancel up to <span className="text-amber-400 font-bold">24 hours</span> ahead of your appointment without getting charged.
              </p>
              <p className="text-gray-300 text-sm">
                May charge a <span className="text-amber-400 font-bold">25% fee</span> for cancelling late or a <span className="text-amber-400 font-bold">100% fee</span> for not showing up.
              </p>
            </div>
            <button
              onClick={handleAgreeToPolicy}
              className="w-full bg-amber-500 text-black py-2 rounded-lg font-semibold hover:bg-amber-400 transition-colors text-sm"
            >
              I Agree
            </button>
          </div>
        </div>
      )}

      {/* Custom CSS for scrollbar hiding */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* React Day Picker Custom Styling */
        .rdp-custom {
          --rdp-cell-size: 40px;
          --rdp-accent-color: #fbbf24;
          --rdp-background-color: #1f2937;
          --rdp-outline: 2px solid #fbbf24;
          --rdp-outline-selected: 2px solid #fbbf24;
        }

        /* Compact Calendar for Side-by-Side Layout */
        .rdp-compact {
          --rdp-cell-size: 35px;
          font-size: 0.875rem;
        }

        .rdp-custom .rdp-day {
          color: #f9fafb;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .rdp-custom .rdp-day:hover {
          background-color: #374151;
          transform: scale(1.05);
        }

        .rdp-custom .rdp-day_selected {
          background-color: #fbbf24 !important;
          color: #000000 !important;
          font-weight: bold;
        }

        .rdp-custom .rdp-day_today {
          border: 2px solid #fbbf24;
          font-weight: bold;
        }

        .rdp-custom .rdp-caption_label {
          color: #f9fafb;
          font-size: 1.25rem;
          font-weight: bold;
        }

        .rdp-custom .rdp-nav_button {
          color: #9ca3af;
          transition: all 0.2s ease;
        }

        .rdp-custom .rdp-nav_button:hover {
          color: #fbbf24;
          background-color: #374151;
        }

        .rdp-custom .rdp-head_cell {
          color: #9ca3af;
          font-weight: 600;
        }

        .rdp-custom .rdp-table {
          background-color: transparent;
        }

        .rdp-custom .rdp-tbody {
          background-color: transparent;
        }

        .rdp-custom .rdp-tfoot {
          background-color: transparent;
        }
        
        /* Time Section Styling */
        .time-section {
          transition: all 0.3s ease;
        }
        
        .time-section:hover {
          transform: translateY(-2px);
        }
        
        .time-slot-button {
          transition: all 0.2s ease;
        }
        
        .time-slot-button:hover {
          transform: scale(1.05) !important;
          box-shadow: 0 4px 12px rgba(251, 191, 36, 0.2);
        }
        
        .time-slot-button.selected {
          transform: scale(1.1) !important;
          box-shadow: 0 6px 16px rgba(251, 191, 36, 0.4);
        }
        
        .quick-time-button {
          transition: all 0.2s ease;
        }
        
        .quick-time-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(251, 191, 36, 0.3);
        }
        
        .quick-date-button {
          transition: all 0.2s ease;
        }
        
        .quick-date-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(251, 191, 36, 0.3);
        }

        /* Styled Form CSS */
        .styled-form {
          display: flex;
          flex-direction: column;
          align-self: center;
          font-family: inherit;
          gap: 15px;
          padding-inline: 3em;
          padding-bottom: 0.5em;
          background-color: #171717;
          border-radius: 20px;
        }

        .styled-form-heading {
          text-align: center;
          margin: 2em;
          color: #fbbf24;
          font-size: 1.2em;
          background-color: transparent;
          align-self: center;
          font-weight: bold;
        }

        .styled-form-field {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5em;
          border-radius: 12px;
          padding: 1em;
          border: none;
          outline: none;
          color: white;
          background-color: #171717;
          box-shadow: inset 2px 5px 10px rgb(5, 5, 5);
        }

        .styled-input-field {
          background: none;
          border: none;
          outline: none;
          width: 100%;
          color: #ccd6f6;
          padding-inline: 1em;
          resize: vertical;
        }

        .styled-input-field::placeholder {
          color: #64748b;
        }

        .styled-form-card1 {
          background-image: linear-gradient(163deg, #fbbf24 0%, #fbbf24 100%);
          border-radius: 22px;
          transition: all 0.3s;
          padding: 3px;
        }

        .styled-form-card1:hover {
          box-shadow: 0px 0px 30px 1px rgba(251, 191, 36, 0.3);
        }

        .styled-form-card2 {
          border-radius: 20px;
          transition: all 0.2s;
          background-color: #171717;
        }

        .styled-form-card2:hover {
          transform: scale(0.98);
          border-radius: 20px;
        }
      `}</style>

        {/* Card Details Modal */}
        {showCardModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="relative">
              {/* Close Button */}
              <button
                onClick={() => setShowCardModal(false)}
                className="absolute -top-2 -right-2 z-10 w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Credit Card Style Form */}
              <div className="w-80 h-48 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-600 relative overflow-hidden">
                {/* Card Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform rotate-12 translate-x-full animate-pulse"></div>
                
                {/* Mastercard Logo */}
                <div className="absolute top-4 right-4">
                  <svg
                    className="w-12 h-8"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#ff9800"
                      d="M32 10A14 14 0 1 0 32 38A14 14 0 1 0 32 10Z"
                    />
                    <path
                      fill="#d50000"
                      d="M16 10A14 14 0 1 0 16 38A14 14 0 1 0 16 10Z"
                    />
                    <path
                      fill="#ff3d00"
                      d="M18,24c0,4.755,2.376,8.95,6,11.48c3.624-2.53,6-6.725,6-11.48s-2.376-8.95-6-11.48 C20.376,15.05,18,19.245,18,24z"
                    />
                  </svg>
                </div>

                {/* Cardholder Name */}
                <div className="absolute top-4 left-4">
                  <input
                    className="bg-transparent border-none outline-none text-white text-sm font-light tracking-wider placeholder-gray-400 w-40"
                    type="text"
                    placeholder="Full Name"
                    value={cardDetails.cardName}
                    onChange={(e) => handleCardInputChange('cardName', e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCardSubmit()}
                  />
                  {cardErrors.cardName && (
                    <p className="text-red-400 text-xs mt-1">{cardErrors.cardName}</p>
                  )}
                </div>

                {/* Card Number */}
                <div className="absolute top-16 left-4 right-4">
                  <input
                    className="bg-transparent border-none outline-none text-white text-lg font-mono tracking-widest placeholder-gray-400 w-full"
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    value={cardDetails.cardNumber}
                    onChange={(e) => handleCardInputChange('cardNumber', e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCardSubmit()}
                    maxLength={19}
                  />
                  {cardErrors.cardNumber && (
                    <p className="text-red-400 text-xs mt-1">{cardErrors.cardNumber}</p>
                  )}
                </div>

                {/* Expiry and CVV */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div className="flex flex-col">
                    <label className="text-gray-400 text-xs uppercase tracking-wide mb-1">Exp</label>
                    <input
                      className="bg-transparent border-none outline-none text-white text-sm font-mono tracking-wide placeholder-gray-400 w-16"
                      type="text"
                      placeholder="MM/YY"
                      value={cardDetails.expiryDate}
                      onChange={(e) => handleCardInputChange('expiryDate', e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleCardSubmit()}
                      maxLength={5}
                    />
                    {cardErrors.expiryDate && (
                      <p className="text-red-400 text-xs mt-1">{cardErrors.expiryDate}</p>
                    )}
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="text-gray-400 text-xs uppercase tracking-wide mb-1">CVV</label>
                    <input
                      className="bg-transparent border-none outline-none text-white text-sm font-mono tracking-wide placeholder-gray-400 w-12 text-right"
                      type="text"
                      placeholder="CVV"
                      value={cardDetails.cvv}
                      onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleCardSubmit()}
                      maxLength={4}
                    />
                    {cardErrors.cvv && (
                      <p className="text-red-400 text-xs mt-1">{cardErrors.cvv}</p>
                    )}
                  </div>
                </div>

                {/* Instruction */}
                <div className="absolute -bottom-8 left-0 right-0">
                  <p className="text-center text-gray-400 text-xs">
                    Press Enter in any field to save
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Duplicate Booking Warning Popup */}
        {showDuplicateWarning && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-orange-500/30 rounded-xl p-6 max-w-md w-full mx-4">
              <div className="text-center">
                {/* Warning Icon */}
                <div className="mx-auto w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 8.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>

                {/* Title and Message */}
                <h3 className="text-xl font-bold text-white mb-2">
                  {duplicateData?.type === 'same_date' ? 'Duplicate Booking Detected' : 'Recent Booking Found'}
                </h3>
                
                <p className="text-gray-300 mb-4">
                  {duplicateData?.message}
                </p>

                {/* Existing Appointment Details */}
                {duplicateData?.existingAppointment && (
                  <div className="bg-gray-800 rounded-lg p-4 mb-4 text-left">
                    <h4 className="text-amber-500 font-semibold mb-2">Existing Appointment:</h4>
                    <div className="space-y-1 text-sm text-gray-300">
                      <p><span className="text-gray-400">Date:</span> {duplicateData.existingAppointment.date}</p>
                      <p><span className="text-gray-400">Time:</span> {duplicateData.existingAppointment.time}</p>
                      <p><span className="text-gray-400">Barber:</span> {duplicateData.existingAppointment.barber}</p>
                      <p><span className="text-gray-400">Status:</span> 
                        <span className={`ml-1 px-2 py-1 rounded text-xs ${
                          duplicateData.existingAppointment.status === 'confirmed' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {duplicateData.existingAppointment.status}
                        </span>
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {duplicateData?.type === 'recent_booking' && duplicateData?.allowOverride ? (
                    <>
                      <button
                        onClick={() => {
                          setShowDuplicateWarning(false)
                          setDuplicateData(null)
                        }}
                        className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          setAllowDuplicateOverride(true)
                          setShowDuplicateWarning(false)
                          setCurrentStep(4) // Proceed to payment step with override
                        }}
                        className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-400 transition-colors"
                      >
                        Book Anyway
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setShowDuplicateWarning(false)
                          setDuplicateData(null)
                        }}
                        className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Close
                      </button>
                      <button
                        onClick={() => {
                          setShowDuplicateWarning(false)
                          setDuplicateData(null)
                          // Could add logic to view/modify existing appointment
                        }}
                        className="flex-1 px-4 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition-colors"
                      >
                        Choose Different Date
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Time Validation Popup */}
        {showTimeValidationPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-red-500/30 rounded-xl p-6 max-w-md w-full mx-4">
              <div className="text-center">
                {/* Error Icon */}
                <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>

                {/* Title and Message */}
                <h3 className="text-xl font-bold text-white mb-2">
                  ❌ Invalid Time Selection
                </h3>
                
                <p className="text-gray-300 mb-4">
                  {timeValidationData?.message}
                </p>

                {/* Suggestion (if available) */}
                {timeValidationData?.suggestion && (
                  <div className="bg-gray-800 rounded-lg p-4 mb-4 text-left">
                    <h4 className="text-amber-500 font-semibold mb-2">💡 Suggested Time:</h4>
                    <div className="space-y-1 text-sm text-gray-300">
                      <p><span className="text-gray-400">Date:</span> {timeValidationData.suggestion.date}</p>
                      <p><span className="text-gray-400">Time:</span> {timeValidationData.suggestion.display_time || timeValidationData.suggestion.time}</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {timeValidationData?.suggestion ? (
                    <>
                      <button
                        onClick={() => {
                          setShowTimeValidationPopup(false)
                          setTimeValidationData(null)
                        }}
                        className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          // Auto-apply suggested time
                          if (timeValidationData.suggestion) {
                            setSelectedDate(timeValidationData.suggestion.date)
                            setSelectedTime(timeValidationData.suggestion.display_time || timeValidationData.suggestion.time)
                          }
                          setShowTimeValidationPopup(false)
                          setTimeValidationData(null)
                        }}
                        className="flex-1 px-4 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition-colors"
                      >
                        ✨ Use Suggested Time
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setShowTimeValidationPopup(false)
                        setTimeValidationData(null)
                      }}
                      className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-400 transition-colors"
                    >
                      OK, Choose Different Time
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}

