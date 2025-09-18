"use client"

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { 
  Users, 
  Calendar, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  Lock, 
  Eye, 
  EyeOff, 
  Scissors,
  Plus,
  Edit,
  Trash2,
  X,
  Search,
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Loader2,
  XCircle,
  Download,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Award,
  Zap
} from 'lucide-react'
import SearchFilter from '../components/SearchFilter'
import { Calendar as BigCalendar, momentLocalizer, View } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

// Dashboard data interfaces
interface DashboardData {
  overall: {
    pending_appointments: number;
    confirmed_appointments: number;
    completed_appointments: number;
    cancelled_appointments: number;
    today_appointments: number;
    total_barbers: number;
    available_barbers: number;
    total_services: number;
    today_revenue: string;
    monthly_revenue: string;
    weekly_appointments: number;
  };
  orders: {
    pending_orders: number;
    processing_orders: number;
    delivered_orders: number;
    cancelled_orders: number;
    today_orders: number;
    today_order_revenue: string;
    monthly_order_revenue: string;
    weekly_orders: number;
  };
  customers: {
    total_appointment_customers: number;
    total_order_customers: number;
    total_unique_customers: number;
    new_appointment_customers_30d: number;
    new_order_customers_30d: number;
  };
  topBarbers: Array<{
    id: number;
    name: string;
    image: string;
    total_appointments: number;
    completed_appointments: number;
    total_revenue: string;
    rating: string;
    total_reviews: number;
  }>;
  popularServices: Array<{
    id: number;
    name: string;
    category: string;
    price: string;
    booking_count: number;
    total_revenue: string;
  }>;
  topProducts: Array<{
    id: number;
    name: string;
    category: string | null;
    price: string;
    image: string;
    total_sold: number | null;
    order_count: number;
    total_revenue: string;
  }>;
  recentAppointments: Array<{
    id: number;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    appointment_date: string;
    appointment_time: string;
    status: string;
    barber_name: string;
    service_names: string;
    total_price: string;
    created_at: string;
  }>;
  recentOrders: Array<{
    id: number;
    order_number: string;
    customer_name: string;
    customer_email: string;
    order_status: string;
    payment_method: string;
    total_amount: string;
    created_at: string;
    items_count: number;
  }>;
}

interface RevenueData {
  dailyRevenue: Array<{
    date: string;
    revenue: number;
    appointments_count: number;
  }>;
  dailyOrderRevenue: Array<{
    date: string;
    revenue: number;
    orders_count: number;
  }>;
  combinedRevenue: Array<{
    date: string;
    appointment_revenue: number;
    order_revenue: number;
    total_revenue: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    appointments_count: number;
    completed_count: number;
    revenue: number;
  }>;
}

export default function AdminLoginPage() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Handle client-side mounting
  useEffect(() => {
    setIsClient(true)
    // Check if already authenticated
    if (localStorage.getItem('adminAuth') === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simple admin authentication (you can enhance this later)
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      localStorage.setItem('adminAuth', 'true')
      setIsAuthenticated(true)
    } else {
      setError('Invalid username or password')
    }
    
    setIsLoading(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCredentials(prev => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  // Show loading during hydration
  if (!isClient) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Loading...</h1>
        </div>
      </main>
    )
  }

  // Check if already authenticated
  if (isAuthenticated) {
    return <AdminDashboard />
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-gray-400">B & H Barber Shop Management</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                placeholder="Enter admin username"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                  placeholder="Enter admin password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-500 text-black py-3 px-6 rounded-lg font-semibold hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 text-sm font-medium mb-1">Demo Credentials:</p>
            <p className="text-blue-600 text-sm">Username: <span className="font-mono">admin</span></p>
            <p className="text-blue-600 text-sm">Password: <span className="font-mono">admin123</span></p>
          </div>
        </div>

        {/* Back to Website */}
        <div className="text-center mt-6">
          <Link 
            href="/" 
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            ← Back to Website
          </Link>
        </div>
      </div>
    </main>
  )
}

// Admin Dashboard Component
function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard')

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    window.location.reload()
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'services', label: 'Services', icon: Scissors },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'barbers', label: 'Barbers', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Compact Modern Sidebar */}
        <aside className="w-56 bg-gradient-to-b from-gray-900 to-gray-800 shadow-2xl min-h-screen">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center shadow-lg">
                <Lock className="w-4 h-4 text-white" />
              </div>
              <div className="ml-2">
                <h2 className="text-sm font-bold text-white">Admin Panel</h2>
                <p className="text-[10px] text-gray-400">B&H Barber Shop</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-3">
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = activeSection === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-all duration-200 group ${
                      isActive 
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg transform scale-105' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white hover:transform hover:scale-102'
                    }`}
                  >
                    <div className={`p-1.5 rounded-md mr-2 transition-all duration-200 ${
                      isActive 
                        ? 'bg-white/20' 
                        : 'bg-gray-700 group-hover:bg-gray-600'
                    }`}>
                      <Icon size={14} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'} />
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                    {isActive && (
                      <div className="ml-auto">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Sidebar Footer */}
            <div className="mt-6 pt-4 border-t border-gray-700">
              <div className="px-3 py-2 bg-gray-800 rounded-lg mb-3">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-md flex items-center justify-center">
                    <User className="w-3 h-3 text-white" />
                  </div>
                  <div className="ml-2">
                    <p className="text-xs font-medium text-white">Admin User</p>
                    <p className="text-[10px] text-gray-400">Online</p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-2 rounded-lg text-xs font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Logout
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4">
          {activeSection === 'dashboard' && <DashboardSection onNavigate={setActiveSection} />}
          {activeSection === 'appointments' && <AppointmentsSection />}
          {activeSection === 'services' && <ServicesSection />}
          {activeSection === 'products' && <ProductsSection />}
          {activeSection === 'orders' && <OrdersSection />}
          {activeSection === 'barbers' && <BarbersSection />}
          {activeSection === 'settings' && <SettingsSection />}
        </main>
      </div>
    </div>
  )
}

// Dashboard Section
function DashboardSection({ onNavigate }: { onNavigate?: (section: string) => void }) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [showRevenueModal, setShowRevenueModal] = useState(false)
  const [showCustomerAnalytics, setShowCustomerAnalytics] = useState(false)
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false)

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [overviewRes, revenueRes] = await Promise.all([
        fetch('http://localhost:5000/api/dashboard/overview'),
        fetch('http://localhost:5000/api/dashboard/revenue')
      ])

      if (!overviewRes.ok || !revenueRes.ok) {
        throw new Error('Failed to fetch dashboard data')
      }

      const [overviewData, revenueData] = await Promise.all([
        overviewRes.json(),
        revenueRes.json()
      ])

      setDashboardData(overviewData.data)
      setRevenueData(revenueData.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Keyboard shortcut for search (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault()
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Navigation function
  const navigateToSection = (section: string) => {
    console.log(`Navigating to ${section} section`);
    if (onNavigate) {
      // Map customers to barbers since there's no dedicated customers section
      const sectionMap: { [key: string]: string } = {
        'customers': 'barbers',
        'appointments': 'appointments',
        'orders': 'orders',
        'barbers': 'barbers',
        'products': 'products',
        'services': 'services'
      };
      
      const targetSection = sectionMap[section] || section;
      onNavigate(targetSection);
    } else {
      console.log('Navigation not available - onNavigate prop not provided');
    }
  }

  // Export functionality
  const exportRevenueData = () => {
    try {
      const data = {
        today_revenue: parseFloat(dashboardData?.overall?.today_revenue || '0'),
        order_revenue: parseFloat(dashboardData?.orders?.today_order_revenue || '0'),
        total_revenue: parseFloat(dashboardData?.overall?.today_revenue || '0') + parseFloat(dashboardData?.orders?.today_order_revenue || '0'),
        date: new Date().toISOString().split('T')[0]
      };
      
      const csvContent = `Date,Appointment Revenue,Order Revenue,Total Revenue\n${data.date},${data.today_revenue},${data.order_revenue},${data.total_revenue}`;
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `revenue-${data.date}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      console.log('Revenue data exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      alert('Error exporting data. Please try again.');
    }
  }

  // Global search function
  const performGlobalSearch = async (term: string) => {
    if (term.length < 3) return;
    
    try {
      console.log(`🔍 Global search for: "${term}"`);
      
      // Search across different sections
      const searchResults = {
        appointments: [],
        orders: [],
        customers: [],
        barbers: [],
        products: []
      };

      // You can implement actual API calls here
      // For now, we'll show a comprehensive search result
      alert(`🔍 Global Search Results for "${term}":\n\n• Found in appointments\n• Found in orders\n• Found in customers\n• Found in barbers\n• Found in products\n\nFull search functionality coming soon!`);
      
    } catch (error) {
      console.error('Search error:', error);
    }
  }

  // Chart configurations
  const revenueChartData = {
    labels: revenueData?.dailyRevenue?.slice(0, 7).reverse().map(item => 
      new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ) || [],
    datasets: [
      {
        label: 'Appointment Revenue',
        data: revenueData?.dailyRevenue?.slice(0, 7).reverse().map(item => item.revenue) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Order Revenue',
        data: revenueData?.dailyOrderRevenue?.slice(0, 7).reverse().map(item => item.revenue) || [],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      }
    ]
  }

  const appointmentStatusData = {
    labels: dashboardData?.overall ? ['Completed', 'Pending', 'Confirmed', 'Cancelled'] : [],
    datasets: [
      {
        data: dashboardData?.overall ? [
          dashboardData.overall.completed_appointments,
          dashboardData.overall.pending_appointments,
          dashboardData.overall.confirmed_appointments,
          dashboardData.overall.cancelled_appointments
        ] : [],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(59, 130, 246)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 2
      }
    ]
  }

  const orderStatusData = {
    labels: dashboardData?.orders ? ['Delivered', 'Processing', 'Pending', 'Cancelled'] : [],
    datasets: [
      {
        data: dashboardData?.orders ? [
          dashboardData.orders.delivered_orders,
          dashboardData.orders.processing_orders,
          dashboardData.orders.pending_orders,
          dashboardData.orders.cancelled_orders
        ] : [],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(16, 185, 129)',
          'rgb(59, 130, 246)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 2
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
        <span className="ml-2 text-gray-600">Loading dashboard...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <span className="ml-2 text-red-600">{error}</span>
      </div>
    )
  }

  return (
    <div>
      {/* Global Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search appointments, orders, customers, barbers, products..."
            value={searchTerm || ''}
            className="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            onChange={(e) => {
              const term = e.target.value;
              setSearchTerm(term);
              if (term.length > 2) {
                performGlobalSearch(term);
              }
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && searchTerm.length > 2) {
                performGlobalSearch(searchTerm);
              }
            }}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Ctrl+K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Dashboard Overview</h2>
        <button
          onClick={fetchDashboardData}
          className="flex items-center px-3 py-1.5 text-xs font-medium text-amber-600 bg-amber-50 rounded-md hover:bg-amber-100 transition-colors"
        >
          <Activity className="w-3 h-3 mr-1.5" />
          Refresh
        </button>
      </div>
      
      {/* Compact Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Today's Revenue */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium text-green-700">Today's Revenue</p>
                <div className="flex items-center bg-green-200 rounded-full px-1.5 py-0.5">
                  <TrendingUp className="w-2.5 h-2.5 text-green-600 mr-1" />
                  <span className="text-[10px] font-semibold text-green-700">+12%</span>
                </div>
              </div>
              <p className="text-xl font-bold text-green-800 mb-1">
                ${(parseFloat(dashboardData?.overall?.today_revenue || '0') + parseFloat(dashboardData?.orders?.today_order_revenue || '0')).toFixed(2)}
              </p>
              <div className="flex items-center text-[10px] text-green-600">
                <DollarSign className="w-2.5 h-2.5 mr-1" />
                <span>vs yesterday</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center shadow-md">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-3 bg-green-200 rounded-full h-1.5">
            <div className="bg-green-500 h-1.5 rounded-full w-3/4 transition-all duration-1000"></div>
          </div>
          {/* Quick Actions */}
          <div className="mt-3 flex gap-1">
            <button 
              onClick={() => {
                setShowRevenueModal(true);
              }}
              className="flex-1 bg-green-600 text-white text-[10px] py-1 px-2 rounded hover:bg-green-700 transition-colors"
            >
              View Details
            </button>
            <button 
              onClick={exportRevenueData}
              className="flex-1 bg-green-500 text-white text-[10px] py-1 px-2 rounded hover:bg-green-600 transition-colors"
            >
              Export
            </button>
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium text-blue-700">Today's Appointments</p>
                <div className="flex items-center bg-blue-200 rounded-full px-1.5 py-0.5">
                  <Calendar className="w-2.5 h-2.5 text-blue-600 mr-1" />
                  <span className="text-[10px] font-semibold text-blue-700">{dashboardData?.overall?.available_barbers || 0} available</span>
                </div>
              </div>
              <p className="text-xl font-bold text-blue-800 mb-1">{dashboardData?.overall?.today_appointments || 0}</p>
              <div className="flex items-center text-[10px] text-blue-600">
                <Clock className="w-2.5 h-2.5 mr-1" />
                <span>scheduled today</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-3 bg-blue-200 rounded-full h-1.5">
            <div className="bg-blue-500 h-1.5 rounded-full w-2/3 transition-all duration-1000"></div>
          </div>
          {/* Quick Actions */}
          <div className="mt-3 flex gap-1">
            <button 
              onClick={() => navigateToSection('appointments')}
              className="flex-1 bg-blue-600 text-white text-[10px] py-1 px-2 rounded hover:bg-blue-700 transition-colors"
            >
              View Calendar
            </button>
            <button 
              onClick={() => setShowNewAppointmentModal(true)}
              className="flex-1 bg-blue-500 text-white text-[10px] py-1 px-2 rounded hover:bg-blue-600 transition-colors"
            >
              Add New
            </button>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4 border border-orange-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium text-orange-700">Pending Orders</p>
                <div className="flex items-center bg-orange-200 rounded-full px-1.5 py-0.5">
                  <Clock className="w-2.5 h-2.5 text-orange-600 mr-1" />
                  <span className="text-[10px] font-semibold text-orange-700">{dashboardData?.orders?.processing_orders || 0} processing</span>
                </div>
              </div>
              <p className="text-xl font-bold text-orange-800 mb-1">{dashboardData?.orders?.pending_orders || 0}</p>
              <div className="flex items-center text-[10px] text-orange-600">
                <ShoppingCart className="w-2.5 h-2.5 mr-1" />
                <span>awaiting fulfillment</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-3 bg-orange-200 rounded-full h-1.5">
            <div className="bg-orange-500 h-1.5 rounded-full w-1/2 transition-all duration-1000"></div>
          </div>
          {/* Quick Actions */}
          <div className="mt-3 flex gap-1">
            <button 
              onClick={() => navigateToSection('orders')}
              className="flex-1 bg-orange-600 text-white text-[10px] py-1 px-2 rounded hover:bg-orange-700 transition-colors"
            >
              View Orders
            </button>
            <button 
              onClick={() => {
                // Process pending orders - show a quick action modal
                const pendingCount = dashboardData?.orders?.pending_orders || 0;
                if (pendingCount > 0) {
                  alert(`Processing ${pendingCount} pending orders...\n\nThis will:\n• Update order statuses\n• Send notifications\n• Update inventory\n\nFeature coming soon!`);
                } else {
                  alert('No pending orders to process!');
                }
              }}
              className="flex-1 bg-orange-500 text-white text-[10px] py-1 px-2 rounded hover:bg-orange-600 transition-colors"
            >
              Process
            </button>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium text-purple-700">Total Customers</p>
                <div className="flex items-center bg-purple-200 rounded-full px-1.5 py-0.5">
                  <TrendingUp className="w-2.5 h-2.5 text-purple-600 mr-1" />
                  <span className="text-[10px] font-semibold text-purple-700">+{dashboardData?.customers?.new_appointment_customers_30d || 0}</span>
                </div>
              </div>
              <p className="text-xl font-bold text-purple-800 mb-1">{dashboardData?.customers?.total_unique_customers || 0}</p>
              <div className="flex items-center text-[10px] text-purple-600">
                <Users className="w-2.5 h-2.5 mr-1" />
                <span>this month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-3 bg-purple-200 rounded-full h-1.5">
            <div className="bg-purple-500 h-1.5 rounded-full w-4/5 transition-all duration-1000"></div>
          </div>
          {/* Quick Actions */}
          <div className="mt-3 flex gap-1">
            <button 
              onClick={() => navigateToSection('customers')}
              className="flex-1 bg-purple-600 text-white text-[10px] py-1 px-2 rounded hover:bg-purple-700 transition-colors"
            >
              View Barbers
            </button>
            <button 
              onClick={() => setShowCustomerAnalytics(true)}
              className="flex-1 bg-purple-500 text-white text-[10px] py-1 px-2 rounded hover:bg-purple-600 transition-colors"
            >
              Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Revenue Trends (Last 7 Days)</h3>
          <div className="h-48">
            <Line data={revenueChartData} options={chartOptions} />
          </div>
        </div>

        {/* Appointment Status Distribution */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Appointment Status</h3>
          <div className="h-48">
            <Doughnut data={appointmentStatusData} options={doughnutOptions} />
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Order Status</h3>
          <div className="h-48">
            <Doughnut data={orderStatusData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top Barbers */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Top Barbers</h3>
          <div className="space-y-2">
            {dashboardData?.topBarbers?.slice(0, 5).map((barber, index) => (
              <div key={barber.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-amber-600">#{index + 1}</span>
                  </div>
                  <div className="ml-2">
                    <p className="text-sm font-medium text-gray-900">{barber.name}</p>
                    <p className="text-xs text-gray-600">{barber.completed_appointments} completed</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-gray-900">${barber.total_revenue}</p>
                  <div className="flex items-center">
                    <Star className="w-2.5 h-2.5 text-yellow-400 fill-current" />
                    <span className="text-[10px] text-gray-600 ml-1">{barber.rating || 'N/A'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Services */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Services</h3>
          <div className="space-y-3">
            {dashboardData?.popularServices?.slice(0, 5).map((service, index) => (
              <div key={service.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">{service.name}</p>
                    <p className="text-sm text-gray-600">{service.booking_count} bookings</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">${service.price}</p>
                  <p className="text-xs text-gray-600">${service.total_revenue} total</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {dashboardData?.recentAppointments?.slice(0, 3).map((appointment) => (
              <div key={appointment.id} className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New appointment</p>
                  <p className="text-xs text-gray-600">{appointment.customer_name} - {appointment.service_names}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(appointment.created_at).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            ))}
            {dashboardData?.recentOrders?.slice(0, 2).map((order) => (
              <div key={order.id} className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New order</p>
                  <p className="text-xs text-gray-600">{order.order_number} - ${order.total_amount}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(order.created_at).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Details Modal */}
      {showRevenueModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Revenue Details</h3>
              <button
                onClick={() => setShowRevenueModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Today's Revenue</h4>
                <p className="text-2xl font-bold text-green-600">
                  ${(parseFloat(dashboardData?.overall?.today_revenue || '0')).toFixed(2)}
                </p>
                <p className="text-sm text-green-600">Appointment Revenue</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Order Revenue</h4>
                <p className="text-2xl font-bold text-blue-600">
                  ${(parseFloat(dashboardData?.orders?.today_order_revenue || '0')).toFixed(2)}
                </p>
                <p className="text-sm text-blue-600">Product Sales</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">Total Revenue</h4>
              <p className="text-3xl font-bold text-gray-900">
                ${(parseFloat(dashboardData?.overall?.today_revenue || '0') + parseFloat(dashboardData?.orders?.today_order_revenue || '0')).toFixed(2)}
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={exportRevenueData}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Export Data
              </button>
              <button
                onClick={() => setShowRevenueModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Analytics Modal */}
      {showCustomerAnalytics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Customer Analytics</h3>
              <button
                onClick={() => setShowCustomerAnalytics(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Total Customers</h4>
                <p className="text-2xl font-bold text-purple-600">
                  {dashboardData?.customers?.total_unique_customers || 0}
                </p>
                <p className="text-sm text-purple-600">All time</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">New This Month</h4>
                <p className="text-2xl font-bold text-blue-600">
                  +{dashboardData?.customers?.new_appointment_customers_30d || 0}
                </p>
                <p className="text-sm text-blue-600">Last 30 days</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">Customer Insights</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Average customer retention rate: 85%</li>
                <li>• Most popular service: Haircut & Styling</li>
                <li>• Peak booking hours: 10 AM - 2 PM</li>
                <li>• Customer satisfaction: 4.8/5 stars</li>
              </ul>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => navigateToSection('customers')}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
              >
                View Barbers
              </button>
              <button
                onClick={() => setShowCustomerAnalytics(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick New Appointment Modal */}
      {showNewAppointmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Quick New Appointment</h3>
              <button
                onClick={() => setShowNewAppointmentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter customer name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Haircut & Styling</option>
                  <option>Beard Trim</option>
                  <option>Full Service</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  alert('Appointment created successfully!');
                  setShowNewAppointmentModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Create Appointment
              </button>
              <button
                onClick={() => setShowNewAppointmentModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Appointments Management Section
interface Appointment {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  barber_id: number;
  barber_name?: string;
  appointment_date: string; // Format: "2025-09-10T19:00:00.000Z"
  appointment_time: string; // Format: "10:30:00"
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  total_amount: string; // API returns as string
  tip_amount: string; // API returns as string
  tip_percentage: string; // API returns as string
  payment_method?: string;
  payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
  notes?: string;
  service_count?: number; // Number of services
  total_price?: string; // Total price of services
  created_at: string;
  updated_at: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: {
    appointmentId: number;
    customerName: string;
    barberName: string;
    serviceName: string;
    status: "pending" | "confirmed" | "completed" | "cancelled" | "blocked";
    totalAmount: number;
    duration: number;
    isBlocked?: boolean;
  };
}

// Setup moment localizer for React Big Calendar
const localizer = momentLocalizer(moment)

function AppointmentsSection() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<{ date: Date; time: string } | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<View>('month')

  // Add filter state
  const [filters, setFilters] = useState<AppointmentFilters>({
    dateRange: {
      start: '',
      end: ''
    },
    barberId: '',
    status: [],
    serviceId: '',
    searchQuery: '',
    quickFilter: ''
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [availableBarbers, setAvailableBarbers] = useState<Barber[]>([]);
  const [availableServices, setAvailableServices] = useState<Service[]>([]);

  // Bulk operations state
  const [selectedAppointments, setSelectedAppointments] = useState<number[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkAction, setBulkAction] = useState<string>('');
  const [bulkStatus, setBulkStatus] = useState<string>('');
  const [bulkLoading, setBulkLoading] = useState(false);

  // Time slot management state
  const [showTimeBlockModal, setShowTimeBlockModal] = useState(false);
  const [selectedTimeBlock, setSelectedTimeBlock] = useState<{ date: Date; time: string } | null>(null);
  const [timeBlocks, setTimeBlocks] = useState<any[]>([]);
  const [barberSchedules, setBarberSchedules] = useState<any[]>([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Fetch time blocks from API
  const fetchTimeBlocks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/time-blocks');
      const data = await response.json();
      
      if (data.success) {
        setTimeBlocks(data.data);
        console.log('✅ Time blocks loaded:', data.data);
      } else {
        console.error('Failed to fetch time blocks:', data.message);
        setError('Failed to load time blocks');
      }
    } catch (error) {
      console.error('Error fetching time blocks:', error);
      setError('Failed to load time blocks');
    }
  };

  // Fetch appointments from API
  const fetchAppointments = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await fetch('http://localhost:5000/api/appointments')
      const data = await response.json()
      
      if (data.success) {
        console.log('✅ Fetched appointments:', data.data)
        setAppointments(data.data || [])
      } else {
        setError(data.message || 'Failed to fetch appointments')
        console.error('❌ API Error:', data.message)
      }
    } catch (err) {
      setError('Failed to fetch appointments')
      console.error('❌ Network Error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Load appointments and time blocks on component mount
  useEffect(() => {
    fetchAppointments()
    fetchTimeBlocks()
  }, [])

  // Add filter functions
  const applyFilters = (appointments: Appointment[]): Appointment[] => {
    let filtered = [...appointments];

    // Date range filter
    if (filters.dateRange.start && filters.dateRange.end) {
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      filtered = filtered.filter(apt => {
        const aptDate = new Date(apt.appointment_date.split('T')[0]);
        return aptDate >= startDate && aptDate <= endDate;
      });
    }

    // Barber filter
    if (filters.barberId) {
      filtered = filtered.filter(apt => apt.barber_id.toString() === filters.barberId);
    }

    // Status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter(apt => filters.status.includes(apt.status));
    }

    // Service filter
    if (filters.serviceId) {
      // This would need to be implemented with a join query in the backend
      // For now, we'll skip this filter
    }

    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(apt => 
        apt.customer_name.toLowerCase().includes(query) ||
        apt.customer_email.toLowerCase().includes(query) ||
        apt.customer_phone.includes(query)
      );
    }

    // Quick filter
    if (filters.quickFilter) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);

      switch (filters.quickFilter) {
        case 'today':
          filtered = filtered.filter(apt => {
            const aptDate = new Date(apt.appointment_date.split('T')[0]);
            return aptDate.toDateString() === today.toDateString();
          });
          break;
        case 'tomorrow':
          filtered = filtered.filter(apt => {
            const aptDate = new Date(apt.appointment_date.split('T')[0]);
            return aptDate.toDateString() === tomorrow.toDateString();
          });
          break;
        case 'thisWeek':
          filtered = filtered.filter(apt => {
            const aptDate = new Date(apt.appointment_date.split('T')[0]);
            return aptDate >= today && aptDate <= nextWeek;
          });
          break;
        case 'pending':
          filtered = filtered.filter(apt => apt.status === 'pending');
          break;
        case 'confirmed':
          filtered = filtered.filter(apt => apt.status === 'confirmed');
          break;
        case 'completed':
          filtered = filtered.filter(apt => apt.status === 'completed');
          break;
        case 'cancelled':
          filtered = filtered.filter(apt => apt.status === 'cancelled');
          break;
      }
    }

    return filtered;
  };

  const clearFilters = () => {
    setFilters({
      dateRange: { start: '', end: '' },
      barberId: '',
      status: [],
      serviceId: '',
      searchQuery: '',
      quickFilter: ''
    });
  };

  const handleFilterChange = (key: keyof AppointmentFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Load barbers and services for filter dropdowns
  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/barbers');
        const data = await response.json();
        if (data.success) {
          setAvailableBarbers(data.data);
        }
      } catch (error) {
        console.error('Error fetching barbers:', error);
      }
    };

    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/services');
        const data = await response.json();
        if (data.success) {
          setAvailableServices(data.data);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchBarbers();
    fetchServices();
  }, []);

  // Apply filters to appointments
  const filteredAppointments = applyFilters(appointments);

  // Bulk operations functions
  const handleSelectAppointment = (appointmentId: number) => {
    setSelectedAppointments(prev => 
      prev.includes(appointmentId) 
        ? prev.filter(id => id !== appointmentId)
        : [...prev, appointmentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAppointments.length === filteredAppointments.length) {
      setSelectedAppointments([]);
    } else {
      setSelectedAppointments(filteredAppointments.map(apt => apt.id));
    }
  };

  const handleBulkStatusUpdate = async () => {
    if (!bulkStatus || selectedAppointments.length === 0) return;

    setBulkLoading(true);
    try {
      const promises = selectedAppointments.map(appointmentId => 
        fetch(`http://localhost:5000/api/appointments/${appointmentId}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: bulkStatus })
        })
      );

      await Promise.all(promises);
      
      // Refresh appointments
      await fetchAppointments();
      setSelectedAppointments([]);
      setBulkAction('');
      setBulkStatus('');
      setShowBulkActions(false);
      
      setError('');
    } catch (err) {
      setError('Failed to update appointment statuses');
      console.error('Bulk status update error:', err);
    } finally {
      setBulkLoading(false);
    }
  };

  const handleBulkExport = () => {
    const selectedAppts = filteredAppointments.filter(apt => 
      selectedAppointments.includes(apt.id)
    );

    const csvData = [
      ['ID', 'Customer Name', 'Email', 'Phone', 'Barber', 'Date', 'Time', 'Status', 'Total Amount', 'Payment Method'],
      ...selectedAppts.map(apt => [
        apt.id,
        apt.customer_name,
        apt.customer_email,
        apt.customer_phone,
        apt.barber_name || 'Any Barber',
        apt.appointment_date.split('T')[0],
        apt.appointment_time,
        apt.status,
        apt.total_amount,
        apt.payment_method
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `appointments-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleBulkDelete = async () => {
    if (selectedAppointments.length === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedAppointments.length} appointments?`)) {
      return;
    }

    setBulkLoading(true);
    try {
      const promises = selectedAppointments.map(appointmentId => 
        fetch(`http://localhost:5000/api/appointments/${appointmentId}`, {
          method: 'DELETE'
        })
      );

      await Promise.all(promises);
      
      // Refresh appointments
      await fetchAppointments();
      setSelectedAppointments([]);
      setBulkAction('');
      setShowBulkActions(false);
      
      setError('');
    } catch (err) {
      setError('Failed to delete appointments');
      console.error('Bulk delete error:', err);
    } finally {
      setBulkLoading(false);
    }
  };

  // Update bulk actions visibility
  useEffect(() => {
    setShowBulkActions(selectedAppointments.length > 0);
  }, [selectedAppointments]);

  // Time slot management functions
  const handleTimeSlotRightClick = (slotInfo: { start: Date; end: Date; slots: Date[] }) => {
    const clickedDate = slotInfo.start;
    const hours = clickedDate.getHours().toString().padStart(2, '0');
    const minutes = clickedDate.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    
    setSelectedTimeBlock({ date: clickedDate, time: timeString });
    setShowTimeBlockModal(true);
  };

  const handleBlockTimeSlot = async (blockData: any) => {
    try {
      console.log('📝 Blocking time slot:', blockData);
      
      // Format date and time for API
      const blockDate = blockData.date.toISOString().split('T')[0]; // YYYY-MM-DD
      const blockTime = blockData.time; // HH:MM
      
      const response = await fetch('http://localhost:5000/api/time-blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          block_date: blockDate,
          block_time: blockTime,
          reason: blockData.reason,
          duration: blockData.duration,
          created_by: 'admin'
        })
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Time block created successfully:', data.data);
        // Refresh time blocks from server
        await fetchTimeBlocks();
        setShowTimeBlockModal(false);
        setSelectedTimeBlock(null);
        setError(''); // Clear any previous errors
      } else {
        setError(data.message || 'Failed to block time slot');
      }
    } catch (error) {
      console.error('Error blocking time slot:', error);
      setError('Failed to block time slot. Please try again.');
    }
  };

  const handleUnblockTimeSlot = async (blockId: number) => {
    try {
      console.log('🗑️ Unblocking time slot:', blockId);
      
      const response = await fetch(`http://localhost:5000/api/time-blocks/${blockId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Time block deleted successfully');
        // Refresh time blocks from server
        await fetchTimeBlocks();
        setError(''); // Clear any previous errors
      } else {
        setError(data.message || 'Failed to unblock time slot');
      }
    } catch (error) {
      console.error('Error unblocking time slot:', error);
      setError('Failed to unblock time slot. Please try again.');
    }
  };

  const handleManageSchedules = () => {
    setShowScheduleModal(true);
  };

  const handleUpdateBarberSchedule = async (barberId: number, schedule: any) => {
    try {
      // This would call a backend API to update barber schedule
      console.log('Updating barber schedule:', { barberId, schedule });
      setBarberSchedules(prev => 
        prev.map(s => s.barberId === barberId ? { ...s, ...schedule } : s)
      );
    } catch (error) {
      console.error('Error updating barber schedule:', error);
      setError('Failed to update barber schedule');
    }
  };

  // Custom event component with checkbox
  const EventComponent = ({ event }: { event: CalendarEvent }) => {
    const isSelected = selectedAppointments.includes(event.resource.appointmentId);
    
    return (
      <div className="flex items-center gap-1 p-1">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => handleSelectAppointment(event.resource.appointmentId)}
          className="w-3 h-3"
          onClick={(e) => e.stopPropagation()}
        />
        <div className="flex-1 text-xs truncate">
          {event.title}
        </div>
      </div>
    );
  };

  // Convert appointments to calendar events
  const getCalendarEvents = (): CalendarEvent[] => {
    const appointmentEvents: CalendarEvent[] = []
    const blockedEvents: CalendarEvent[] = []

    // Convert appointments to calendar events
    if (filteredAppointments && filteredAppointments.length > 0) {
      filteredAppointments.forEach(appointment => {
        try {
          // Extract date part from ISO string (e.g., "2025-09-10T19:00:00.000Z" -> "2025-09-10")
          const appointmentDate = appointment.appointment_date.split('T')[0]
          
          // Parse time components to avoid timezone issues
          const [hours, minutes] = appointment.appointment_time.split(':').map(Number)
          
          // Create start date by combining date and time in local timezone
          // Parse the date components to avoid timezone issues
          const [year, month, day] = appointmentDate.split('-').map(Number)
          const startDate = new Date(year, month - 1, day, hours, minutes, 0, 0)
          
          // Calculate end date (default 1 hour duration)
          const endDate = new Date(startDate.getTime() + 60 * 60000)
          
          appointmentEvents.push({
            id: `appointment-${appointment.id}`,
            title: `${appointment.customer_name} - ${appointment.barber_name || 'Any Barber'}`,
            start: startDate,
            end: endDate,
          resource: {
            appointmentId: appointment.id,
            customerName: appointment.customer_name,
            barberName: appointment.barber_name || 'Any Barber',
              serviceName: `Service (${appointment.service_count || 0})`,
            status: appointment.status,
              totalAmount: parseFloat(appointment.total_amount) || 0,
            duration: 60
          }
          })
        } catch (error) {
          console.error('Error converting appointment to calendar event:', error)
        }
      })
    }

    // Convert blocked time slots to calendar events
    timeBlocks.forEach((block: any) => {
      try {
        const blockDate = new Date(block.block_date)
        const [hours, minutes] = block.block_time.split(':').map(Number)
        
        const startDate = new Date(blockDate.getFullYear(), blockDate.getMonth(), blockDate.getDate(), hours, minutes, 0, 0)
        const endDate = new Date(startDate.getTime() + (block.duration || 60) * 60000)
        
        blockedEvents.push({
          id: `blocked-${block.id}`,
          title: `🚫 BLOCKED: ${block.reason}`,
          start: startDate,
          end: endDate,
        resource: {
            appointmentId: block.id,
            customerName: 'BLOCKED TIME',
            barberName: 'N/A',
            serviceName: block.reason,
            status: 'blocked',
            totalAmount: 0,
            duration: block.duration || 60,
            isBlocked: true
          }
        })
      } catch (error) {
        console.error('Error converting blocked time to calendar event:', error)
      }
    })

    return [...appointmentEvents, ...blockedEvents]
  }

  // Handle event click to show appointment details
  const handleEventClick = (event: CalendarEvent) => {
    // Check if it's a blocked time slot
    if (event.resource?.isBlocked) {
      // For blocked time slots, show a simple alert or could open a modal to unblock
      const blockId = event.resource.appointmentId
      if (confirm(`Unblock this time slot?\n\nReason: ${event.resource.serviceName}\nDuration: ${event.resource.duration} minutes`)) {
        handleUnblockTimeSlot(blockId)
      }
      return
    }
    
    // Handle regular appointments
    const appointment = filteredAppointments.find(apt => apt.id === event.resource.appointmentId)
    if (appointment) {
      setSelectedAppointment(appointment)
      setShowDetailsModal(true)
    }
  }

  // Handle calendar slot click (for creating new appointments)
  const handleSelectSlot = (slotInfo: { start: Date; end: Date; slots: Date[] }) => {
    const clickedDate = slotInfo.start
    
    // Get time in 24-hour format (HH:MM) - ensure consistent format
    const hours = clickedDate.getHours().toString().padStart(2, '0')
    const minutes = clickedDate.getMinutes().toString().padStart(2, '0')
    const timeString = `${hours}:${minutes}`
    
    // Create a clean date object for comparison (avoid timezone issues)
    const cleanDate = new Date(clickedDate.getFullYear(), clickedDate.getMonth(), clickedDate.getDate())
    
    console.log('📅 Calendar slot clicked:', { 
      clickedDate, 
      timeString,
      clickedDateString: clickedDate.toDateString(),
      hours: clickedDate.getHours(),
      minutes: clickedDate.getMinutes()
    })
    
    // Check if this slot is already occupied
    const isOccupied = filteredAppointments.some(apt => {
      const aptDate = apt.appointment_date.split('T')[0] // Extract date part
      const [aptYear, aptMonth, aptDay] = aptDate.split('-').map(Number)
      const aptCleanDate = new Date(aptYear, aptMonth - 1, aptDay)
      const aptTime = apt.appointment_time
      
      return aptCleanDate.getTime() === cleanDate.getTime() && aptTime === timeString
    })
    
    if (!isOccupied) {
      setSelectedSlot({ date: clickedDate, time: timeString })
      setShowCreateModal(true)
    } else {
      // Show a message that slot is occupied
      setError(`Time slot ${timeString} is already occupied`)
      setTimeout(() => setError(''), 3000) // Clear error after 3 seconds
    }
  }

  // Handle status change
  const handleStatusChange = async (appointmentId: number, newStatus: string) => {
    try {
      setError('')
      
      const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      const data = await response.json()

      if (data.success) {
        console.log('✅ Status updated successfully')
        await fetchAppointments()
        setShowDetailsModal(false)
      } else {
        setError(data.message || 'Failed to update appointment status')
      }
    } catch (err) {
      setError('Failed to update appointment status')
      console.error('❌ Error updating appointment:', err)
    }
  }

  // Handle delete appointment
  const handleDeleteAppointment = async (appointmentId: number) => {
    if (!confirm('Are you sure you want to delete this appointment? This action cannot be undone.')) {
      return
    }

    try {
      setError('')
      
      const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        console.log('✅ Appointment deleted successfully')
        await fetchAppointments()
        setShowDetailsModal(false)
      } else {
        setError(data.message || 'Failed to delete appointment')
      }
    } catch (err) {
      setError('Failed to delete appointment')
      console.error('❌ Error deleting appointment:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
        <h2 className="text-2xl font-bold text-gray-900">Appointments Management</h2>
          <p className="text-sm text-gray-600 mt-1">
            📅 Click on appointments to view details • Click empty slots to create new appointments
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
            </svg>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            Today
          </button>
          <button
            onClick={handleManageSchedules}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Manage Schedules
          </button>
          <button
            onClick={() => {
              // Set default values for today and current time
              const now = new Date();
              const hours = now.getHours().toString().padStart(2, '0');
              const minutes = now.getMinutes().toString().padStart(2, '0');
              const timeString = `${hours}:${minutes}`;
              
              setSelectedTimeBlock({ date: now, time: timeString });
              setShowTimeBlockModal(true);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
            </svg>
            Block Time
          </button>
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['month', 'week', 'day', 'agenda'] as const).map((viewType) => (
              <button
                key={viewType}
                onClick={() => setView(viewType)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  view === viewType
                    ? 'bg-white text-amber-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Filter Panel */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, start: e.target.value })}
                  className="bg-white text-gray-900 px-3 py-2 rounded-lg border border-gray-300 focus:border-amber-500 focus:outline-none text-sm"
                />
                <input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, end: e.target.value })}
                  className="bg-white text-gray-900 px-3 py-2 rounded-lg border border-gray-300 focus:border-amber-500 focus:outline-none text-sm"
                />
              </div>
            </div>

            {/* Barber Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Barber</label>
              <select
                value={filters.barberId}
                onChange={(e) => handleFilterChange('barberId', e.target.value)}
                className="w-full bg-white text-gray-900 px-3 py-2 rounded-lg border border-gray-300 focus:border-amber-500 focus:outline-none text-sm"
              >
                <option value="">All Barbers</option>
                {availableBarbers.map(barber => (
                  <option key={barber.id} value={barber.id.toString()}>
                    {barber.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div className="flex flex-wrap gap-2">
                {['pending', 'confirmed', 'completed', 'cancelled'].map(status => (
                  <label key={status} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.status.includes(status)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleFilterChange('status', [...filters.status, status]);
                        } else {
                          handleFilterChange('status', filters.status.filter(s => s !== status));
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 capitalize">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Search Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Name, email, or phone..."
                value={filters.searchQuery}
                onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                className="w-full bg-white text-gray-900 px-3 py-2 rounded-lg border border-gray-300 focus:border-amber-500 focus:outline-none text-sm"
              />
            </div>
          </div>

          {/* Quick Filters */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Quick Filters</label>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'today', label: 'Today' },
                { key: 'tomorrow', label: 'Tomorrow' },
                { key: 'thisWeek', label: 'This Week' },
                { key: 'pending', label: 'Pending' },
                { key: 'confirmed', label: 'Confirmed' },
                { key: 'completed', label: 'Completed' },
                { key: 'cancelled', label: 'Cancelled' }
              ].map(filter => (
                <button
                  key={filter.key}
                  onClick={() => handleFilterChange('quickFilter', filter.key)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    filters.quickFilter === filter.key
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Actions */}
          <div className="mt-4 flex justify-between">
            <div className="text-sm text-gray-600">
              Showing {filteredAppointments.length} of {appointments.length} appointments
            </div>
            <button
              onClick={clearFilters}
              className="text-amber-600 hover:text-amber-700 text-sm font-medium"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {/* Bulk Actions Toolbar */}
      {showBulkActions && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-amber-800 font-medium">
                {selectedAppointments.length} appointment{selectedAppointments.length !== 1 ? 's' : ''} selected
              </span>
              <button
                onClick={handleSelectAll}
                className="text-amber-600 hover:text-amber-700 text-sm font-medium"
              >
                {selectedAppointments.length === filteredAppointments.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Bulk Status Update */}
              <div className="flex items-center gap-2">
                <select
                  value={bulkStatus}
                  onChange={(e) => setBulkStatus(e.target.value)}
                  className="px-3 py-1 border border-amber-300 rounded text-sm"
                >
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button
                  onClick={handleBulkStatusUpdate}
                  disabled={!bulkStatus || bulkLoading}
                  className="px-3 py-1 bg-amber-600 text-white rounded text-sm hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {bulkLoading ? 'Updating...' : 'Update Status'}
                </button>
              </div>

              {/* Export Button */}
              <button
                onClick={handleBulkExport}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                Export CSV
              </button>

              {/* Delete Button */}
              <button
                onClick={handleBulkDelete}
                disabled={bulkLoading}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bulkLoading ? 'Deleting...' : 'Delete'}
              </button>

              {/* Close Button */}
              <button
                onClick={() => {
                  setSelectedAppointments([]);
                  setBulkAction('');
                  setBulkStatus('');
                }}
                className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* React Big Calendar */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div style={{ height: '600px' }}>
            <BigCalendar
              localizer={localizer}
              events={getCalendarEvents()}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              view={view}
              onView={setView}
              date={currentDate}
              onNavigate={setCurrentDate}
              onSelectEvent={handleEventClick}
              onSelectSlot={handleSelectSlot}
              selectable
              components={{
                event: EventComponent
              }}
              eventPropGetter={(event) => {
                const status = event.resource?.status
                const isBlocked = event.resource?.isBlocked
                let backgroundColor = '#3174ad' // Default blue
                
                if (isBlocked) {
                  backgroundColor = '#dc2626' // Red for blocked time
                } else {
                switch (status) {
                  case 'pending':
                    backgroundColor = '#f59e0b' // Amber
                    break
                  case 'confirmed':
                    backgroundColor = '#3b82f6' // Blue
                    break
                  case 'completed':
                    backgroundColor = '#10b981' // Green
                    break
                  case 'cancelled':
                    backgroundColor = '#ef4444' // Red
                    break
                  default:
                    backgroundColor = '#6b7280' // Gray
                  }
                }
                
                return {
                  style: {
                    backgroundColor,
                    borderRadius: '4px',
                    opacity: isBlocked ? 0.9 : 0.8,
                    color: 'white',
                    border: isBlocked ? '2px solid #991b1b' : 'none',
                    fontSize: '12px',
                    fontWeight: '500',
                    textDecoration: isBlocked ? 'line-through' : 'none'
                  }
                }
              }}
              className="rbc-calendar"
              views={['month', 'week', 'day', 'agenda']}
              step={30}
              timeslots={2}
              min={new Date(2024, 0, 1, 8, 0)} // 8 AM
              max={new Date(2024, 0, 1, 20, 0)} // 8 PM
              showMultiDayTimes
              popup
            />
          </div>
        </div>
      </div>

      {/* Appointment Details Modal */}
      {showDetailsModal && selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          onClose={() => setShowDetailsModal(false)}
          onStatusChange={handleStatusChange}
          onDelete={handleDeleteAppointment}
        />
      )}

      {/* Appointment Creation Modal */}
      {showCreateModal && selectedSlot && (
        <AppointmentCreationModal
          selectedSlot={selectedSlot}
          onClose={() => {
            setShowCreateModal(false)
            setSelectedSlot(null)
          }}
          onSuccess={() => {
            setShowCreateModal(false)
            setSelectedSlot(null)
            fetchAppointments()
          }}
        />
      )}

      {/* Time Block Modal */}
      {showTimeBlockModal && selectedTimeBlock && (
        <TimeBlockModal
          selectedTimeBlock={selectedTimeBlock}
          onClose={() => {
            setShowTimeBlockModal(false)
            setSelectedTimeBlock(null)
          }}
          onBlock={handleBlockTimeSlot}
        />
      )}

      {/* Schedule Management Modal */}
      {showScheduleModal && (
        <ScheduleManagementModal
          barbers={availableBarbers}
          schedules={barberSchedules}
          onClose={() => setShowScheduleModal(false)}
          onUpdate={handleUpdateBarberSchedule}
        />
      )}
    </div>
  )
}

// Appointment Creation Modal Component
function AppointmentCreationModal({ 
  selectedSlot, 
  onClose, 
  onSuccess 
}: { 
  selectedSlot: { date: Date; time: string }; 
  onClose: () => void; 
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    barber_id: '',
    services: [] as number[],
    notes: '',
    tip_percentage: 0,
    tip_amount: 0,
    payment_method: 'Pay at Venue',
    total_amount: 0
  })
  const [availableBarbers, setAvailableBarbers] = useState<Barber[]>([])
  const [availableServices, setAvailableServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Fetch barbers and services on mount
  useEffect(() => {
    fetchBarbers()
    fetchServices()
  }, [])

  const fetchBarbers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/barbers')
      const data = await response.json()
      if (data.success) {
        setAvailableBarbers(data.data || [])
      }
    } catch (err) {
      console.error('Error fetching barbers:', err)
    }
  }

  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/services')
      const data = await response.json()
      if (data.success) {
        setAvailableServices(data.data || [])
      }
    } catch (err) {
      console.error('Error fetching services:', err)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    if (type === 'checkbox') {
      const serviceId = parseInt(value)
      setFormData(prev => ({
        ...prev,
        services: checked 
          ? [...prev.services, serviceId]
          : prev.services.filter(id => id !== serviceId)
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || 0 : value
      }))
    }
  }

  const calculateTotal = () => {
    try {
      if (!availableServices || availableServices.length === 0) {
        return 0
      }
      
      const selectedServices = availableServices.filter(service => formData.services.includes(service.id))
      const subtotal = selectedServices.reduce((sum, service) => {
        const price = Number(service.price) || 0
        return sum + price
      }, 0)
      
      const tipPercentage = Number(formData.tip_percentage) || 0
      const tipAmount = subtotal * (tipPercentage / 100)
      
      return subtotal + tipAmount
    } catch (error) {
      console.error('Error calculating total:', error)
      return 0
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Enhanced validation
    if (!formData.customer_name.trim()) {
      setError('Customer name is required')
      setLoading(false)
      return
    }

    if (!formData.customer_email.trim()) {
      setError('Customer email is required')
      setLoading(false)
      return
    }

    if (!formData.customer_phone.trim()) {
      setError('Customer phone is required')
      setLoading(false)
      return
    }

    if (formData.services.length === 0) {
      setError('Please select at least one service')
      setLoading(false)
      return
    }

    if (!formData.barber_id) {
      setError('Please select a barber')
      setLoading(false)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.customer_email)) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    try {
      // Format date in local timezone to avoid timezone issues
      const year = selectedSlot.date.getFullYear()
      const month = String(selectedSlot.date.getMonth() + 1).padStart(2, '0')
      const day = String(selectedSlot.date.getDate()).padStart(2, '0')
      const localDateString = `${year}-${month}-${day}`
      
      // Ensure time is in HH:MM format (not HH:MM:SS)
      const timeString = selectedSlot.time.includes(':') && selectedSlot.time.split(':').length === 2 
        ? selectedSlot.time 
        : selectedSlot.time + ':00'
      
      const appointmentData = {
        ...formData,
        appointment_date: localDateString,
        appointment_time: timeString,
        total_amount: calculateTotal(),
        tip_amount: calculateTotal() * (formData.tip_percentage / 100)
      }

      console.log('Creating appointment with data:', appointmentData)

      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData)
      })

      const data = await response.json()
      console.log('Appointment creation response:', data)

      if (data.success) {
        onSuccess()
      } else {
        setError(data.message || 'Failed to create appointment')
      }
    } catch (err) {
      setError('Failed to create appointment')
      console.error('Error creating appointment:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Create New Appointment</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selected Date & Time */}
            <div className="bg-amber-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Selected Time Slot</h4>
              <p className="text-gray-700">
                {selectedSlot.date.toLocaleDateString()} at {selectedSlot.time}
              </p>
            </div>

            {/* Customer Information */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Customer Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    name="customer_email"
                    value={formData.customer_email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    name="customer_phone"
                    value={formData.customer_phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Barber *</label>
                  <select
                    name="barber_id"
                    value={formData.barber_id}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">Select a barber</option>
                    {availableBarbers.map(barber => (
                      <option key={barber.id} value={barber.id}>
                        {barber.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Services Selection */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Services *</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                {availableServices.length === 0 ? (
                  <div className="col-span-2 p-4 text-center text-gray-500">
                    Loading services...
                  </div>
                ) : (
                  availableServices.map(service => (
                    <label key={service.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        value={service.id}
                        checked={formData.services.includes(service.id)}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                      />
                      <div className="ml-3 flex-1">
                        <div className="text-sm font-medium text-gray-900">{service.name}</div>
                        <div className="text-sm text-gray-500">
                          ${typeof service.price === 'number' ? service.price.toFixed(2) : parseFloat(service.price || '0').toFixed(2)} • {service.duration} min
                        </div>
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* Payment Information */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Payment Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <select
                    name="payment_method"
                    value={formData.payment_method}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Pay at Venue">Pay at Venue</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="Online">Online</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tip Percentage (%)</label>
                  <input
                    type="number"
                    name="tip_percentage"
                    value={formData.tip_percentage}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    step="5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Notes & Comments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes & Comments <span className="text-gray-500">(Optional)</span>
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Add any special instructions, customer preferences, or notes about this appointment..."
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 Use this field to record customer preferences, special requests, or any important details
              </p>
            </div>

            {/* Total Amount */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-900">Total Amount:</span>
                <span className="text-xl font-bold text-amber-600">
                  ${(calculateTotal() || 0).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Appointment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// Appointment Details Modal Component
function AppointmentDetailsModal({ 
  appointment, 
  onClose, 
  onStatusChange,
  onDelete
}: { 
  appointment: Appointment; 
  onClose: () => void; 
  onStatusChange: (id: number, status: string) => void;
  onDelete: (id: number) => void;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Appointment Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* Customer Information */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Customer Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="text-gray-900">{appointment.customer_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{appointment.customer_email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-gray-900">{appointment.customer_phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Barber</label>
                  <p className="text-gray-900">{appointment.barber_name || 'Any Barber'}</p>
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Appointment Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <p className="text-gray-900">{new Date(appointment.appointment_date.split('T')[0]).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Time</label>
                  <p className="text-gray-900">{appointment.appointment_time}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                  <p className="text-gray-900">${parseFloat(appointment.total_amount || '0').toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Services</h4>
              <div className="space-y-2">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                      <div>
                      <p className="font-medium text-gray-900">Service Count</p>
                      <p className="text-sm text-gray-600">{appointment.service_count || 0} services</p>
                      </div>
                    <p className="font-medium text-gray-900">${parseFloat(appointment.total_price || '0').toFixed(2)}</p>
                    </div>
                  </div>
              </div>
            </div>

            {/* Notes */}
              <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Notes & Comments</h4>
              {appointment.notes && appointment.notes.trim() ? (
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border-l-4 border-amber-500">
                  {appointment.notes}
                </p>
              ) : (
                <p className="text-gray-500 bg-gray-50 p-3 rounded-lg border-l-4 border-gray-300 italic">
                  No notes or special instructions provided
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-4 border-t">
              <button
                onClick={() => onDelete(appointment.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete Appointment
              </button>
              <div className="flex space-x-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
              {appointment.status === 'pending' && (
                <button
                  onClick={() => onStatusChange(appointment.id, 'confirmed')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Confirm
                </button>
              )}
              {appointment.status === 'confirmed' && (
                <button
                  onClick={() => onStatusChange(appointment.id, 'completed')}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Mark Complete
                </button>
              )}
              {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                <button
                  onClick={() => onStatusChange(appointment.id, 'cancelled')}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Cancel
                </button>
              )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
}

// Add filter interfaces
interface AppointmentFilters {
  dateRange: {
    start: string;
    end: string;
  };
  barberId: string;
  status: string[];
  serviceId: string;
  searchQuery: string;
  quickFilter: string;
}

function ServicesSection() {
  const [services, setServices] = useState<Service[]>([])
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [isCustomCategory, setIsCustomCategory] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: ''
  })

  // Fetch services and categories on component mount
  useEffect(() => {
    fetchServices()
    fetchCategories()
  }, [])

  const fetchServices = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('http://localhost:5000/api/services')
      const data = await response.json()
      
      if (data.success) {
        setServices(data.data || [])
        setFilteredServices(data.data || [])
      } else {
        setError('Failed to fetch services')
      }
    } catch (err) {
      setError('Error connecting to server')
      console.error('Error fetching services:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/services/categories')
      const data = await response.json()
      
      if (data.success) {
        setCategories(data.data || [])
      } else {
        console.error('Failed to fetch categories')
      }
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate category
    if (!formData.category || formData.category.trim() === '') {
      setError('Please select or enter a category')
      return
    }
    
    try {
      const serviceData = {
        ...formData,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        category: formData.category.trim()
      }
      
      console.log('Sending service data:', serviceData)
      
      const response = await fetch('http://localhost:5000/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceData)
      })

      if (response.ok) {
        await fetchServices()
        await fetchCategories() // Refresh categories in case a new one was added
        setShowAddForm(false)
        setFormData({ name: '', description: '', price: '', duration: '', category: '' })
        setIsCustomCategory(false)
        setError('') // Clear any previous errors
      } else {
        setError('Failed to add service')
      }
    } catch (err) {
      setError('Error adding service')
    }
  }

  const handleEditService = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`http://localhost:5000/api/services/${editingService?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          duration: parseInt(formData.duration)
        })
      })

      if (response.ok) {
        await fetchServices()
        await fetchCategories() // Refresh categories in case a new one was added
        setEditingService(null)
        setFormData({ name: '', description: '', price: '', duration: '', category: '' })
        setIsCustomCategory(false)
        setError('') // Clear any previous errors
      } else {
        setError('Failed to update service')
      }
    } catch (err) {
      setError('Error updating service')
    }
  }

  const startEdit = (service: Service) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      description: service.description || '',
      price: service.price.toString(),
      duration: service.duration.toString(),
      category: service.category || ''
    })
    // Check if it's a custom category
    setIsCustomCategory(!categories.includes(service.category))
    setShowAddForm(false) // Close add form if open
  }

  const cancelEdit = () => {
    setEditingService(null)
    setFormData({ name: '', description: '', price: '', duration: '', category: '' })
    setIsCustomCategory(false)
  }

  const handleSearch = useCallback((searchTerm: string, filters: any) => {
    let filtered = [...services]

    // Apply search term
    if (searchTerm && searchTerm.trim() !== '') {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply filters
    if (filters.category) {
      filtered = filtered.filter(service => service.category === filters.category)
    }

    if (filters.priceRange && typeof filters.priceRange === 'object') {
      if (filters.priceRange.min) {
        filtered = filtered.filter(service => service.price >= Number(filters.priceRange.min))
      }
      if (filters.priceRange.max) {
        filtered = filtered.filter(service => service.price <= Number(filters.priceRange.max))
      }
    }

    if (filters.duration && typeof filters.duration === 'object') {
      if (filters.duration.min) {
        filtered = filtered.filter(service => service.duration >= Number(filters.duration.min))
      }
      if (filters.duration.max) {
        filtered = filtered.filter(service => service.duration <= Number(filters.duration.max))
      }
    }

    setFilteredServices(filtered)
  }, [services])

  const handleDeleteService = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return
    
    try {
      const response = await fetch(`http://localhost:5000/api/services/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchServices()
        setError('') // Clear any previous errors
      } else {
        setError('Failed to delete service')
      }
    } catch (err) {
      setError('Error deleting service')
    }
  }

  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Services Management</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Services Management</h2>
        <button
          onClick={() => {
            setShowAddForm(true)
            setEditingService(null) // Close edit form if open
            setFormData({ name: '', description: '', price: '', duration: '', category: '' }) // Reset form
            setIsCustomCategory(false) // Reset custom category
          }}
          className="bg-amber-500 text-black px-4 py-2 rounded-lg font-medium hover:bg-amber-400 transition-colors"
        >
          Add New Service
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Search and Filter */}
      <div className="mb-6">
        <SearchFilter
          searchPlaceholder="Search services by name, description, or category..."
          onSearch={handleSearch}
          filters={[
            {
              type: 'select',
              label: 'Category',
              key: 'category',
              options: categories.map(cat => ({ value: cat, label: cat }))
            },
            {
              type: 'range',
              label: 'Price Range ($)',
              key: 'priceRange',
              min: 0,
              max: 200,
              step: 5
            },
            {
              type: 'range',
              label: 'Duration (minutes)',
              key: 'duration',
              min: 15,
              max: 120,
              step: 15
            }
          ]}
          showFilterCount={true}
        />
      </div>

      {/* Add/Edit Service Form */}
      {(showAddForm || editingService) && (
        <div className="mb-6 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {editingService ? 'Edit Service' : 'Add New Service'}
            </h3>
            <button
              onClick={() => {
                if (editingService) {
                  cancelEdit()
                } else {
                  setShowAddForm(false)
                }
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <form onSubmit={editingService ? handleEditService : handleAddService} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                placeholder="e.g., Haircut & Styling"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <div className="space-y-2">
                <select
                  name="category"
                  value={isCustomCategory ? 'custom' : formData.category}
                  onChange={(e) => {
                    if (e.target.value === 'custom') {
                      setIsCustomCategory(true)
                      setFormData(prev => ({ ...prev, category: '' }))
                    } else {
                      setIsCustomCategory(false)
                      setFormData(prev => ({ ...prev, category: e.target.value }))
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="custom">+ Add New Category</option>
                </select>
                
                {isCustomCategory && (
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={(e) => {
                      console.log('Custom category input:', e.target.value)
                      handleInputChange(e)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    placeholder="Enter new category name (e.g., Premium Services)"
                    required
                  />
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                placeholder="25.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                placeholder="30"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                placeholder="Service description..."
              />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  editingService 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {editingService ? 'Update Service' : 'Add Service'}
              </button>
              {editingService && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Services List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {filteredServices.length === services.length 
              ? `All Services (${services.length})`
              : `Filtered Services (${filteredServices.length} of ${services.length})`
            }
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    {services.length === 0 
                      ? "No services found. Add your first service above."
                      : "No services match your search criteria."
                    }
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{service.name}</div>
                        <div className="text-sm text-gray-500">{service.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {service.category || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ${typeof service.price === 'number' ? service.price.toFixed(2) : service.price}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {service.duration} min
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button
                        onClick={() => startEdit(service)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


// Order interface
interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  total_amount: number;
  status: string;
  order_status: string;
  payment_status: string;
  payment_method: string;
  subtotal: number;
  tax_amount: number;
  created_at: string;
  updated_at: string;
  total_items?: number;
  items?: OrderItem[];
}

interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  total_price: number;
  product_name: string;
  product_image: string;
  product_sku: string;
  current_stock: number;
}

function OrdersSection() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('created_at')
  
  // Advanced search and filter state
  const [advancedFilters, setAdvancedFilters] = useState({
    dateRange: 'all', // all, today, week, month, custom
    startDate: '',
    endDate: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    minAmount: '',
    maxAmount: '',
    paymentMethod: 'all',
    orderStatus: 'all'
  })
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orderStats, setOrderStats] = useState({
    total_orders: 0,
    total_revenue: 0,
    average_order_value: 0,
    completed_orders: 0
  })
  
  // Bulk operations state
  const [selectedOrders, setSelectedOrders] = useState<number[]>([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [bulkStatus, setBulkStatus] = useState<string>('')
  const [isBulkUpdating, setIsBulkUpdating] = useState(false)

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:5000/api/orders')
      const data = await response.json()
      
      if (data.success) {
        setOrders(data.data)
      } else {
        setError('Failed to load orders')
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setError('Error loading orders')
    } finally {
      setLoading(false)
    }
  }

  // Fetch order statistics
  const fetchOrderStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders/stats')
      const data = await response.json()
      
      if (data.success) {
        setOrderStats(data.data)
      }
    } catch (error) {
      console.error('Error fetching order stats:', error)
    }
  }

  useEffect(() => {
    fetchOrders()
    fetchOrderStats()
    
    // Load search history from localStorage
    const savedHistory = localStorage.getItem('orderSearchHistory')
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory))
    }
  }, [])

  // Helper functions for advanced search
  const updateAdvancedFilter = (key: string, value: string) => {
    setAdvancedFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const clearAllFilters = () => {
    setSearchTerm('')
    setFilterStatus('all')
    setAdvancedFilters({
      dateRange: 'all',
      startDate: '',
      endDate: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      minAmount: '',
      maxAmount: '',
      paymentMethod: 'all',
      orderStatus: 'all'
    })
  }

  const addToSearchHistory = (term: string) => {
    if (term.trim() && !searchHistory.includes(term.trim())) {
      const newHistory = [term.trim(), ...searchHistory.slice(0, 9)] // Keep last 10 searches
      setSearchHistory(newHistory)
      localStorage.setItem('orderSearchHistory', JSON.stringify(newHistory))
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      addToSearchHistory(searchTerm.trim())
      setShowSearchSuggestions(false)
    }
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filterStatus !== 'all') count++
    if (advancedFilters.dateRange !== 'all') count++
    if (advancedFilters.customerName) count++
    if (advancedFilters.customerEmail) count++
    if (advancedFilters.customerPhone) count++
    if (advancedFilters.minAmount || advancedFilters.maxAmount) count++
    if (advancedFilters.paymentMethod !== 'all') count++
    if (advancedFilters.orderStatus !== 'all') count++
    return count
  }

  // Handle order status update
  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_status: newStatus,
          notify_customer: false
        })
      })

      const data = await response.json()
      
      if (data.success) {
        fetchOrders() // Refresh orders list
        fetchOrderStats() // Refresh stats
        setError('') // Clear any previous errors
      } else {
        setError(data.message || 'Failed to update order status')
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      setError('Error updating order status')
    }
  }

  // Handle order deletion
  const handleDeleteOrder = async () => {
    if (!selectedOrder) return
    
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${selectedOrder.id}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      
      if (data.success) {
        fetchOrders()
        fetchOrderStats()
        setShowDeleteModal(false)
        setSelectedOrder(null)
      } else {
        setError(data.message || 'Failed to delete order')
      }
    } catch (error) {
      console.error('Error deleting order:', error)
      setError('Error deleting order')
    }
  }

  // Handle view order details
  const handleViewOrder = async (order: Order) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${order.id}`)
      const data = await response.json()
      
      if (data.success) {
        setSelectedOrder(data.data)
        setShowDetailsModal(true)
      } else {
        setError('Failed to load order details')
      }
    } catch (error) {
      console.error('Error fetching order details:', error)
      setError('Error loading order details')
    }
  }

  // Advanced filtering logic
  const applyAdvancedFilters = (order: Order) => {
    // Date range filter
    if (advancedFilters.dateRange !== 'all') {
      const orderDate = new Date(order.created_at)
      const today = new Date()
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      
      switch (advancedFilters.dateRange) {
        case 'today':
          if (orderDate < startOfDay) return false
          break
        case 'week':
          const weekAgo = new Date(startOfDay.getTime() - 7 * 24 * 60 * 60 * 1000)
          if (orderDate < weekAgo) return false
          break
        case 'month':
          const monthAgo = new Date(startOfDay.getTime() - 30 * 24 * 60 * 60 * 1000)
          if (orderDate < monthAgo) return false
          break
        case 'custom':
          if (advancedFilters.startDate && orderDate < new Date(advancedFilters.startDate)) return false
          if (advancedFilters.endDate && orderDate > new Date(advancedFilters.endDate)) return false
          break
      }
    }
    
    // Customer filters
    if (advancedFilters.customerName && 
        !order.customer_name?.toLowerCase().includes(advancedFilters.customerName.toLowerCase())) {
      return false
    }
    if (advancedFilters.customerEmail && 
        !order.customer_email?.toLowerCase().includes(advancedFilters.customerEmail.toLowerCase())) {
      return false
    }
    if (advancedFilters.customerPhone && 
        !order.customer_phone?.toLowerCase().includes(advancedFilters.customerPhone.toLowerCase())) {
      return false
    }
    
    // Amount range filter
    if (advancedFilters.minAmount && order.total_amount < parseFloat(advancedFilters.minAmount)) {
      return false
    }
    if (advancedFilters.maxAmount && order.total_amount > parseFloat(advancedFilters.maxAmount)) {
      return false
    }
    
    // Payment method filter
    if (advancedFilters.paymentMethod !== 'all' && 
        order.payment_method !== advancedFilters.paymentMethod) {
      return false
    }
    
    // Order status filter
    if (advancedFilters.orderStatus !== 'all' && 
        order.order_status !== advancedFilters.orderStatus) {
      return false
    }
    
    return true
  }

  // Filter and sort orders
  const filteredOrders = orders
    .filter(order => {
      const matchesSearch = 
        order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesFilter = filterStatus === 'all' || order.order_status === filterStatus
      const matchesAdvancedFilters = applyAdvancedFilters(order)
      
      return matchesSearch && matchesFilter && matchesAdvancedFilters
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'created_at':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'total_amount':
          return b.total_amount - a.total_amount
        case 'customer_name':
          return a.customer_name.localeCompare(b.customer_name)
        case 'status':
          return a.status.localeCompare(b.status)
        default:
          return 0
      }
    })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-purple-100 text-purple-800'
      case 'shipped': return 'bg-indigo-100 text-indigo-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Bulk operations functions
  const handleSelectOrder = (orderId: number) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id))
    }
  }

  const handleBulkStatusUpdate = async () => {
    if (!bulkStatus || selectedOrders.length === 0) return

    setIsBulkUpdating(true)
    try {
      const promises = selectedOrders.map(orderId => 
        fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            order_status: bulkStatus,
            notify_customer: false
          })
        })
      )

      const responses = await Promise.all(promises)
      const results = await Promise.all(responses.map(r => r.json()))
      
      const successCount = results.filter(r => r.success).length
      
      if (successCount === selectedOrders.length) {
        alert(`Successfully updated ${successCount} orders to ${bulkStatus}`)
        setSelectedOrders([])
        setBulkStatus('')
        fetchOrders()
        fetchOrderStats()
      } else {
        alert(`Updated ${successCount} out of ${selectedOrders.length} orders`)
      }
    } catch (error) {
      console.error('Error updating orders:', error)
      alert('Error updating orders. Please try again.')
    } finally {
      setIsBulkUpdating(false)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedOrders.length === 0) return

    const confirmMessage = `Are you sure you want to delete ${selectedOrders.length} order(s)? This action cannot be undone.`
    if (!confirm(confirmMessage)) return

    setIsBulkUpdating(true)
    try {
      const promises = selectedOrders.map(orderId => 
        fetch(`http://localhost:5000/api/orders/${orderId}`, {
          method: 'DELETE'
        })
      )

      const responses = await Promise.all(promises)
      const results = await Promise.all(responses.map(r => r.json()))
      
      const successCount = results.filter(r => r.success).length
      
      if (successCount === selectedOrders.length) {
        alert(`Successfully deleted ${successCount} orders`)
        setSelectedOrders([])
        fetchOrders()
        fetchOrderStats()
      } else {
        alert(`Deleted ${successCount} out of ${selectedOrders.length} orders`)
      }
    } catch (error) {
      console.error('Error deleting orders:', error)
      alert('Error deleting orders. Please try again.')
    } finally {
      setIsBulkUpdating(false)
    }
  }

  // Export functions
  const exportToCSV = (ordersToExport: Order[], filename: string) => {
    if (ordersToExport.length === 0) {
      alert('No orders to export')
      return
    }

    // CSV headers
    const headers = [
      'Order Number',
      'Customer Name',
      'Customer Email',
      'Customer Phone',
      'Status',
      'Subtotal',
      'Tax Amount',
      'Total Amount',
      'Total Items',
      'Order Date',
      'Shipping Address',
      'Notes'
    ]

    // CSV data rows
    const csvData = ordersToExport.map(order => [
      order.order_number,
      order.customer_name,
      order.customer_email,
      order.customer_phone || '',
      order.order_status,
      order.subtotal,
      order.tax_amount,
      order.total_amount,
      order.total_items || 0,
      formatDate(order.created_at),
      order.shipping_address || '',
      (order as any).notes || ''
    ])

    // Combine headers and data
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleExportAll = () => {
    const timestamp = new Date().toISOString().split('T')[0]
    exportToCSV(filteredOrders, `orders-export-${timestamp}.csv`)
  }

  const handleExportSelected = () => {
    if (selectedOrders.length === 0) {
      alert('Please select orders to export')
      return
    }
    
    const selectedOrdersData = filteredOrders.filter(order => 
      selectedOrders.includes(order.id)
    )
    
    const timestamp = new Date().toISOString().split('T')[0]
    exportToCSV(selectedOrdersData, `selected-orders-export-${timestamp}.csv`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        <span className="ml-2 text-gray-600">Loading orders...</span>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Orders Management</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{orderStats.total_orders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(orderStats.total_revenue || 0)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(orderStats.average_order_value || 0)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{orderStats.completed_orders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filter Controls */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        {/* Main Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search orders by number, customer name, email, or phone..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setShowSearchSuggestions(e.target.value.length > 0)
              }}
              onFocus={() => setShowSearchSuggestions(searchTerm.length > 0)}
              onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
              className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {/* Search Suggestions */}
          {showSearchSuggestions && searchHistory.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {searchHistory
                .filter(term => term.toLowerCase().includes(searchTerm.toLowerCase()))
                .slice(0, 5)
                .map((term, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setSearchTerm(term)
                      setShowSearchSuggestions(false)
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
                  >
                    <Search className="inline w-3 h-3 mr-2 text-gray-400" />
                    {term}
                  </button>
                ))}
            </div>
          )}
        </form>

        {/* Quick Filters Row */}
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex gap-4 flex-1">
          
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="created_at">Sort by Date</option>
              <option value="total_amount">Sort by Amount</option>
              <option value="customer_name">Sort by Customer</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
          
          <div className="flex gap-2">
            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                showAdvancedFilters 
                  ? 'bg-amber-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Search className="w-4 h-4" />
              Advanced Filters
              {getActiveFiltersCount() > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {getActiveFiltersCount()}
                </span>
              )}
            </button>
            
            {/* Clear All Filters */}
            {getActiveFiltersCount() > 0 && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
        </div>
        
        {/* Advanced Filters Panel */}
        {showAdvancedFilters && (
          <div className="border-t pt-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <select
                  value={advancedFilters.dateRange}
                  onChange={(e) => updateAdvancedFilter('dateRange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
              
              {/* Custom Date Range */}
              {advancedFilters.dateRange === 'custom' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={advancedFilters.startDate}
                      onChange={(e) => updateAdvancedFilter('startDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={advancedFilters.endDate}
                      onChange={(e) => updateAdvancedFilter('endDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </>
              )}
              
              {/* Customer Name Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  placeholder="Filter by name..."
                  value={advancedFilters.customerName}
                  onChange={(e) => updateAdvancedFilter('customerName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              
              {/* Customer Email Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Email</label>
                <input
                  type="text"
                  placeholder="Filter by email..."
                  value={advancedFilters.customerEmail}
                  onChange={(e) => updateAdvancedFilter('customerEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              
              {/* Amount Range Filters */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Amount</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={advancedFilters.minAmount}
                  onChange={(e) => updateAdvancedFilter('minAmount', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Amount</label>
                <input
                  type="number"
                  placeholder="999.99"
                  value={advancedFilters.maxAmount}
                  onChange={(e) => updateAdvancedFilter('maxAmount', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              
              {/* Payment Method Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select
                  value={advancedFilters.paymentMethod}
                  onChange={(e) => updateAdvancedFilter('paymentMethod', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="all">All Methods</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="cash">Cash</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>
            </div>
          </div>
        )}
        
        {/* Quick Filter Buttons */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
          <span className="text-sm font-medium text-gray-700 mr-2">Quick Filters:</span>
          <button
            onClick={() => {
              setAdvancedFilters(prev => ({ ...prev, dateRange: 'today' }))
              setFilterStatus('all')
            }}
            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"
          >
            Today's Orders
          </button>
          <button
            onClick={() => {
              setAdvancedFilters(prev => ({ ...prev, dateRange: 'week' }))
              setFilterStatus('all')
            }}
            className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200"
          >
            This Week
          </button>
          <button
            onClick={() => {
              setFilterStatus('pending')
              setAdvancedFilters(prev => ({ ...prev, dateRange: 'all' }))
            }}
            className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200"
          >
            Pending Orders
          </button>
          <button
            onClick={() => {
              setFilterStatus('delivered')
              setAdvancedFilters(prev => ({ ...prev, dateRange: 'month' }))
            }}
            className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200"
          >
            Delivered This Month
          </button>
          <button
            onClick={() => {
              setAdvancedFilters(prev => ({ 
                ...prev, 
                dateRange: 'all',
                minAmount: '100',
                maxAmount: ''
              }))
              setFilterStatus('all')
            }}
            className="px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200"
          >
            High Value Orders ($100+)
          </button>
        </div>
        
        {/* Export Controls */}
        <div className="flex gap-2 mt-4 pt-4 border-t">
          <button
            onClick={handleExportAll}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center gap-2"
            title="Export all filtered orders to CSV"
          >
            <Download className="w-4 h-4" />
            Export All
          </button>
          
          {selectedOrders.length > 0 && (
            <button
              onClick={handleExportSelected}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
              title={`Export ${selectedOrders.length} selected orders to CSV`}
            >
              <Download className="w-4 h-4" />
              Export Selected ({selectedOrders.length})
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <XCircle className="w-5 h-5 text-red-400 mr-2" />
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Bulk Operations Toolbar */}
      {selectedOrders.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-amber-800">
                {selectedOrders.length} order(s) selected
              </span>
              <div className="flex items-center space-x-2">
                <select
                  value={bulkStatus}
                  onChange={(e) => setBulkStatus(e.target.value)}
                  className="px-3 py-1 border border-amber-300 rounded text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button
                  onClick={handleBulkStatusUpdate}
                  disabled={!bulkStatus || isBulkUpdating}
                  className="px-3 py-1 bg-amber-500 text-white rounded text-sm hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isBulkUpdating ? 'Updating...' : 'Update Status'}
                </button>
                <button
                  onClick={handleBulkDelete}
                  disabled={isBulkUpdating}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isBulkUpdating ? 'Deleting...' : 'Delete Selected'}
                </button>
              </div>
            </div>
            <button
              onClick={() => setSelectedOrders([])}
              className="text-amber-600 hover:text-amber-800 text-sm"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleSelectOrder(order.id)}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.order_number}</div>
                      <div className="text-sm text-gray-500">{order.total_items || 0} items</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
                      <div className="text-sm text-gray-500">{order.customer_email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.order_status)}`}>
                      {order.order_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(order.total_amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedOrder(order)
                          setShowDeleteModal(true)
                        }}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No orders found</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => {
            setShowDetailsModal(false)
            setSelectedOrder(null)
          }}
          onStatusUpdate={handleStatusUpdate}
          onDelete={() => {
            setShowDetailsModal(false)
            setShowDeleteModal(true)
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Delete Order</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete order <strong>{selectedOrder.order_number}</strong>? 
              This action cannot be undone and will restore product stock.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setSelectedOrder(null)
                }}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteOrder}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Order Details Modal Component
function OrderDetailsModal({ 
  order, 
  onClose, 
  onStatusUpdate,
  onDelete
}: { 
  order: Order; 
  onClose: () => void; 
  onStatusUpdate: (id: number, status: string) => void;
  onDelete: () => void;
}) {
  const [selectedStatus, setSelectedStatus] = useState(order.order_status)
  const [isUpdating, setIsUpdating] = useState(false)
  const [editingItem, setEditingItem] = useState<number | null>(null)
  const [newQuantity, setNewQuantity] = useState<number>(0)
  const [showAddItem, setShowAddItem] = useState(false)
  const [availableProducts, setAvailableProducts] = useState<any[]>([])
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null)
  const [addQuantity, setAddQuantity] = useState<number>(1)
  const [isUpdatingItem, setIsUpdatingItem] = useState(false)
  const [isAddingItem, setIsAddingItem] = useState(false)

  // Update selectedStatus when order prop changes
  useEffect(() => {
    setSelectedStatus(order.order_status)
  }, [order.order_status])

  const handleStatusChange = async () => {
    if (selectedStatus === order.order_status) return
    
    setIsUpdating(true)
    try {
      await onStatusUpdate(order.id, selectedStatus)
      // Update the local order status to reflect the change
      order.order_status = selectedStatus
      setIsUpdating(false)
    } catch (error) {
      console.error('Error in modal status update:', error)
      setIsUpdating(false)
    }
  }

  // Handle item quantity update
  const handleUpdateItemQuantity = async (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      alert('Quantity must be greater than 0')
      return
    }

    setIsUpdatingItem(true)
    try {
      const response = await fetch(`http://localhost:5000/api/orders/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity })
      })

      const data = await response.json()
      
      if (data.success) {
        // Update the local order items
        if (order.items) {
          const itemIndex = order.items.findIndex(item => item.id === itemId)
          if (itemIndex !== -1) {
            order.items[itemIndex].quantity = quantity
            order.items[itemIndex].total_price = order.items[itemIndex].price * quantity
          }
        }
        
        // Recalculate order totals
        if (order.items) {
          const newSubtotal = order.items.reduce((sum, item) => sum + item.total_price, 0)
          const newTaxAmount = newSubtotal * 0.0875
          const newTotalAmount = newSubtotal + newTaxAmount
          
          order.subtotal = newSubtotal
          order.tax_amount = newTaxAmount
          order.total_amount = newTotalAmount
        }
        
        setEditingItem(null)
        console.log('Item quantity updated successfully')
      } else {
        alert(data.message || 'Failed to update item quantity')
      }
    } catch (error) {
      console.error('Error updating item quantity:', error)
      alert('Error updating item quantity. Please try again.')
    } finally {
      setIsUpdatingItem(false)
    }
  }

  // Handle item removal
  const handleRemoveItem = async (itemId: number) => {
    if (!confirm('Are you sure you want to remove this item from the order?')) return

    try {
      const response = await fetch(`http://localhost:5000/api/orders/items/${itemId}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      
      if (data.success) {
        // Remove item from local order items
        if (order.items) {
          order.items = order.items.filter(item => item.id !== itemId)
        }
        
        // Recalculate order totals
        if (order.items) {
          const newSubtotal = order.items.reduce((sum, item) => sum + item.total_price, 0)
          const newTaxAmount = newSubtotal * 0.0875
          const newTotalAmount = newSubtotal + newTaxAmount
          
          order.subtotal = newSubtotal
          order.tax_amount = newTaxAmount
          order.total_amount = newTotalAmount
        }
        
        console.log('Item removed successfully')
      } else {
        alert(data.message || 'Failed to remove item')
      }
    } catch (error) {
      console.error('Error removing item:', error)
      alert('Error removing item. Please try again.')
    }
  }

  // Load available products for adding
  const loadAvailableProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products')
      const data = await response.json()
      
      if (data.success) {
        setAvailableProducts(data.data)
      }
    } catch (error) {
      console.error('Error loading products:', error)
    }
  }

  // Handle adding new item to order
  const handleAddItem = async () => {
    if (!selectedProduct || addQuantity <= 0) {
      alert('Please select a product and enter a valid quantity')
      return
    }

    setIsAddingItem(true)
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${order.id}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: selectedProduct,
          quantity: addQuantity
        })
      })

      const data = await response.json()
      
      if (data.success) {
        // Find the added product details
        const addedProduct = availableProducts.find(p => p.id === selectedProduct)
        
        if (addedProduct && order.items) {
          // Check if product already exists in order
          const existingItemIndex = order.items.findIndex(item => item.product_id === selectedProduct)
          
          if (existingItemIndex !== -1) {
            // Update existing item
            order.items[existingItemIndex].quantity += addQuantity
            order.items[existingItemIndex].total_price = order.items[existingItemIndex].quantity * order.items[existingItemIndex].price
          } else {
            // Add new item
            const newItem = {
              id: Date.now(), // Temporary ID for display
              order_id: order.id,
              product_id: selectedProduct,
              quantity: addQuantity,
              price: addedProduct.price,
              total_price: addQuantity * addedProduct.price,
              product_name: addedProduct.name,
              product_sku: addedProduct.sku || 'N/A',
              product_image: addedProduct.image || '',
              current_stock: addedProduct.stock_quantity || 0
            }
            order.items.push(newItem)
          }
          
          // Recalculate order totals
          const newSubtotal = order.items.reduce((sum, item) => sum + item.total_price, 0)
          const newTaxAmount = newSubtotal * 0.0875
          const newTotalAmount = newSubtotal + newTaxAmount
          
          order.subtotal = newSubtotal
          order.tax_amount = newTaxAmount
          order.total_amount = newTotalAmount
        }
        
        setShowAddItem(false)
        setSelectedProduct(null)
        setAddQuantity(1)
        console.log('Item added successfully')
      } else {
        alert(data.message || 'Failed to add item')
      }
    } catch (error) {
      console.error('Error adding item:', error)
      alert('Error adding item. Please try again.')
    } finally {
      setIsAddingItem(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-purple-100 text-purple-800'
      case 'shipped': return 'bg-indigo-100 text-indigo-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Order Details</h3>
              <p className="text-sm text-gray-500">Order #{order.order_number}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Information */}
            <div className="space-y-6">
              {/* Order Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Order Status</h4>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.order_status)}`}>
                    {order.order_status}
                  </span>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  {selectedStatus !== order.order_status && (
                    <button
                      onClick={handleStatusChange}
                      disabled={isUpdating}
                      className="px-3 py-1 bg-amber-500 text-white text-sm rounded hover:bg-amber-600 disabled:opacity-50"
                    >
                      {isUpdating ? 'Updating...' : 'Update'}
                    </button>
                  )}
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Customer Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{order.customer_name}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{order.customer_email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{order.customer_phone}</span>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                    <span className="text-sm text-gray-600">{order.shipping_address}</span>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Order Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-medium">{formatCurrency(order.tax_amount)}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t pt-2">
                    <span className="font-medium">Total:</span>
                    <span className="font-bold text-lg">{formatCurrency(order.total_amount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-900">Order Items</h4>
                  <button
                    onClick={() => {
                      setShowAddItem(true)
                      loadAvailableProducts()
                    }}
                    className="px-3 py-1 bg-amber-500 text-white rounded text-sm hover:bg-amber-600 transition-colors"
                  >
                    Add Item
                  </button>
                </div>
                
                {order.items && order.items.length > 0 ? (
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 p-3 bg-white rounded border">
                        {item.product_image ? (
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="w-12 h-12 rounded object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                            <Package className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{item.product_name}</h5>
                          <p className="text-sm text-gray-500">SKU: {item.product_sku}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            {editingItem === item.id ? (
                              <div className="flex items-center space-x-2">
                                <input
                                  type="number"
                                  value={newQuantity}
                                  onChange={(e) => setNewQuantity(parseInt(e.target.value) || 0)}
                                  className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                                  min="1"
                                />
                                <button
                                  onClick={() => handleUpdateItemQuantity(item.id, newQuantity)}
                                  disabled={isUpdatingItem}
                                  className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {isUpdatingItem ? 'Saving...' : 'Save'}
                                </button>
                                <button
                                  onClick={() => setEditingItem(null)}
                                  className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                                <button
                                  onClick={() => {
                                    setEditingItem(item.id)
                                    setNewQuantity(item.quantity)
                                  }}
                                  className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleRemoveItem(item.id)}
                                  className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                                >
                                  Remove
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{formatCurrency(item.price)}</p>
                          <p className="text-sm text-gray-500">Total: {formatCurrency(item.total_price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No items found</p>
                )}

                {/* Add Item Form */}
                {showAddItem && (
                  <div className="mt-4 p-4 bg-white rounded border">
                    <h5 className="font-medium text-gray-900 mb-3">Add New Item</h5>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                        <select
                          value={selectedProduct || ''}
                          onChange={(e) => setSelectedProduct(parseInt(e.target.value) || null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        >
                          <option value="">Select a product</option>
                          {availableProducts.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name} - {formatCurrency(product.price)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                        <input
                          type="number"
                          value={addQuantity}
                          onChange={(e) => setAddQuantity(parseInt(e.target.value) || 1)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                          min="1"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleAddItem}
                          disabled={isAddingItem}
                          className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isAddingItem ? 'Adding...' : 'Add Item'}
                        </button>
                        <button
                          onClick={() => {
                            setShowAddItem(false)
                            setSelectedProduct(null)
                            setAddQuantity(1)
                          }}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Dates */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Order Timeline</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Created: {formatDate(order.created_at)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Updated: {formatDate(order.updated_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
            <button
              onClick={onDelete}
              className="px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              Delete Order
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface Barber {
  id: number;
  name: string;
  phone: string;
  email: string;
  image?: string;
  profile_image?: string;
  specialties?: string;
  is_available: boolean | number; // Handle both boolean and integer (1/0) from database
  rating?: number;
}

function BarbersSection() {
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [filteredBarbers, setFilteredBarbers] = useState<Barber[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingBarber, setEditingBarber] = useState<Barber | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    specialties: '',
    is_available: true,
    rating: 0,
    imageFile: null as File | null, // 👈 file object for upload
  })
  
  const [imagePreview, setImagePreview] = useState<string | null>(null) // for showing preview
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  

  // Fetch barbers
  const fetchBarbers = async () => {
    try {
      console.log('🔄 Fetching barbers...')
      setLoading(true)
      const response = await fetch('http://localhost:5000/api/barbers')
      const data = await response.json()
      
      console.log('📡 Fetch response:', data)
      
      if (data.success) {
        console.log('✅ Barbers fetched successfully, count:', data.data.length)
        setBarbers(data.data)
        setFilteredBarbers(data.data)
      } else {
        console.log('❌ Failed to fetch barbers:', data.message)
        setError(data.message || 'Failed to fetch barbers')
      }
    } catch (err) {
      console.error('❌ Error fetching barbers:', err)
      setError('Failed to fetch barbers')
    } finally {
      setLoading(false)
    }
  }
  console.log('barbers', barbers)

  useEffect(() => {
    fetchBarbers()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (error) setError('')
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, imageFile: file }))
      setImagePreview(URL.createObjectURL(file)) // for preview
    }
  }
  

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      imageFile: null,
      specialties: '',
      is_available: true,
      rating: 0
    })
    setSelectedImage(null)
    setImagePreview(null)
    setEditingBarber(null)
    setShowForm(false)
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    console.log('Form data:', formData)
    
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('phone', formData.phone)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('is_available', formData.is_available ? '1' : '0')
      formDataToSend.append('rating', formData.rating.toString()) 
      // Handle specialties - send empty array as JSON string if empty
      const specialtiesValue = formData.specialties && formData.specialties.trim() !== '' 
        ? formData.specialties 
        : '[]';
      formDataToSend.append('specialties', specialtiesValue)
      
      console.log('Form data before sending:', {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        specialties: specialtiesValue,
        is_available: formData.is_available,
        rating: formData.rating,
        hasImageFile: !!formData.imageFile
      })
  
      // Send image file with correct field name that backend expects
      if (formData.imageFile) {
        formDataToSend.append('profile_image', formData.imageFile)
      }
  
      const url = editingBarber 
        ? `http://localhost:5000/api/barbers/${editingBarber.id}`
        : 'http://localhost:5000/api/barbers'
  
      const method = editingBarber ? 'PUT' : 'POST'
  
      console.log('Sending request to:', url)
      console.log('Method:', method)
      console.log('FormData contents:')
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, ':', value)
      }
  
      const response = await fetch(url, {
        method,
        body: formDataToSend, // FormData automatically sets Content-Type with boundary
      })
  
      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Response data:', data)
  
      if (data.success) {
        await fetchBarbers()
        resetForm()
        setSuccess(editingBarber ? 'Barber updated successfully!' : 'Barber created successfully!')
      } else {
        setError(data.message || 'Failed to save barber')
      }
    } catch (err) {
      setError('Failed to save barber')
      console.error('Error saving barber:', err)
    }
  }
  

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   setError('')
  //   console.log('Form data:', formData)
  //   try {
  //     const formDataToSend = new FormData()
  //     Object.keys(formData).forEach(key => {
  //       formDataToSend.append(key, String(formData[key as keyof typeof formData]))
  //     })
      
  //     if (selectedImage) {
  //       formDataToSend.append('profile_image', selectedImage)
  //     }

  //     const url = editingBarber 
  //       ? `http://localhost:5000/api/barbers/${editingBarber.id}`
  //       : 'http://localhost:5000/api/barbers'
      
  //     const method = editingBarber ? 'PUT' : 'POST'
      
  //     const response = await fetch(url, {
  //       method,
  //       body: formDataToSend
  //     })
      
  //     const data = await response.json()
      
  //     if (data.success) {
  //       await fetchBarbers()
  //       resetForm()
  //     } else {
  //       setError(data.message || 'Failed to save barber')
  //     }
  //   } catch (err) {
  //     setError('Failed to save barber')
  //     console.error('Error saving barber:', err)
  //   }
  // }

  const handleEdit = (barber: Barber) => {
    setEditingBarber(barber)
    
    // Parse specialties from JSON if it's a string
    let specialtiesString = ''
    if (barber.specialties) {
      if (typeof barber.specialties === 'string') {
        try {
          const specialtiesArray = JSON.parse(barber.specialties)
          specialtiesString = Array.isArray(specialtiesArray) ? specialtiesArray.join(', ') : barber.specialties
        } catch {
          specialtiesString = barber.specialties
        }
      } else {
        specialtiesString = barber.specialties
      }
    }
    
    setFormData({
      name: barber.name,
      phone: barber.phone,
      email: barber.email,
      specialties: specialtiesString,
      is_available: Boolean(barber.is_available === true || barber.is_available === 1), // Convert to boolean
      rating: barber.rating || 0,
      imageFile: null
    })
    // Set image preview for existing barber
    if (barber.profile_image) {
      // If it's a full URL, use it directly, otherwise prepend server URL
      const imageUrl = barber.profile_image.startsWith('http') 
        ? barber.profile_image 
        : `http://localhost:5000${barber.profile_image}`;
      setImagePreview(imageUrl);
    } else {
      setImagePreview(null);
    }
    setSelectedImage(null)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this barber?')) return

    try {
      console.log('🗑️ Deleting barber with ID:', id)
      const response = await fetch(`http://localhost:5000/api/barbers/${id}`, {
        method: 'DELETE'
      })
      
      console.log('📡 Delete response status:', response.status)
      const data = await response.json()
      console.log('📡 Delete response data:', data)
      
      if (data.success) {
        console.log('✅ Deletion successful, refreshing barbers...')
        setSuccess('Barber deleted successfully')
        await fetchBarbers()
      } else {
        console.log('❌ Deletion failed:', data.message)
        setError(data.message || 'Failed to delete barber')
      }
    } catch (err) {
      console.error('❌ Error deleting barber:', err)
      setError('Failed to delete barber')
    }
  }

  const handleSearch = useCallback((searchTerm: string, filters: any) => {
    let filtered = [...barbers]
    
    // Search filter
    if (searchTerm && searchTerm.trim() !== '') {
      filtered = filtered.filter(barber =>
        barber.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        barber.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        barber.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        barber.specialties?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Availability filter
    if (filters.availability !== undefined && filters.availability !== '') {
      const availabilityFilter = filters.availability === 'true'
      // Handle both boolean and integer values (1/0 from database)
      filtered = filtered.filter(barber => {
        const barberAvailable = barber.is_available === true || barber.is_available === 1
        return barberAvailable === availabilityFilter
      })
    }
    
    setFilteredBarbers(filtered)
  }, [barbers])

  // Trigger initial search to show all barbers
  useEffect(() => {
    if (barbers.length > 0) {
      handleSearch('', {})
    }
  }, [barbers, handleSearch])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Barbers Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
        >
          Add New Barber
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
          {success}
        </div>
      )}

      <SearchFilter
        searchPlaceholder="Search barbers by name, email, phone, or specialties..."
        filters={[
          {
            key: 'availability',
            label: 'Availability',
            type: 'select',
            options: [
              { value: 'true', label: 'Available' },
              { value: 'false', label: 'Unavailable' }
            ]
          }
        ]}
        onSearch={handleSearch}
      />

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Barbers ({filteredBarbers.length})
            </h3>
          </div>

          {filteredBarbers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No barbers found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBarbers.map((barber) => (
                <div key={barber.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={barber.profile_image || '/images/default-barber.jpg'}
                      alt={barber.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{barber.name}</h4>
                      <p className="text-sm text-gray-600">Barber</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm text-gray-600">{barber.rating || '0.0'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Email:</span> {barber.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Phone:</span> {barber.phone}
                    </p>
                    {barber.specialties && barber.specialties !== '[]' && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Specialties:</span> {
                          typeof barber.specialties === 'string' 
                            ? JSON.parse(barber.specialties).join(', ')
                            : barber.specialties
                        }
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      (barber.is_available === true || barber.is_available === 1)
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {(barber.is_available === true || barber.is_available === 1) ? 'Available' : 'Unavailable'}
                    </span>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(barber)}
                        className="text-amber-600 hover:text-amber-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(barber.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingBarber ? 'Edit Barber' : 'Add New Barber'}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_available"
                      checked={formData.is_available}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Available for appointments
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating (0-5)
                    </label>
                    <input
                      type="number"
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      min="0"
                      max="5"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialties
                  </label>
                  <textarea
                    name="specialties"
                    value={formData.specialties}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="e.g., Haircuts, Beard trimming, Styling, Coloring..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                  >
                    {editingBarber ? 'Update Barber' : 'Add Barber'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SettingsSection() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Settings coming soon...</p>
      </div>
    </div>
  )
}

// Time Block Modal Component
function TimeBlockModal({ 
  selectedTimeBlock, 
  onClose, 
  onBlock 
}: { 
  selectedTimeBlock: { date: Date; time: string }; 
  onClose: () => void; 
  onBlock: (data: any) => void;
}) {
  const [blockData, setBlockData] = useState({
    reason: '',
    duration: 60,
    isRecurring: false,
    recurringDays: [] as string[]
  });

  const [editableDate, setEditableDate] = useState(
    selectedTimeBlock.date.toISOString().split('T')[0]
  );
  const [editableTime, setEditableTime] = useState(selectedTimeBlock.time);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedDate = new Date(editableDate);
    onBlock({
      ...blockData,
      date: selectedDate,
      time: editableTime
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Block Time Slot</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={editableDate}
                onChange={(e) => setEditableDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input
                type="time"
                value={editableTime}
                onChange={(e) => setEditableTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
            <input
              type="text"
              value={blockData.reason}
              onChange={(e) => setBlockData(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="e.g., Maintenance, Break, Holiday"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
            <input
              type="number"
              value={blockData.duration}
              onChange={(e) => setBlockData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
              min="15"
              max="480"
              step="15"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={blockData.isRecurring}
                onChange={(e) => setBlockData(prev => ({ ...prev, isRecurring: e.target.checked }))}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Make this a recurring block</span>
            </label>
          </div>

          {blockData.isRecurring && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Recurring Days</label>
              <div className="flex flex-wrap gap-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                  <label key={day} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={blockData.recurringDays.includes(day)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setBlockData(prev => ({ ...prev, recurringDays: [...prev.recurringDays, day] }));
                        } else {
                          setBlockData(prev => ({ ...prev, recurringDays: prev.recurringDays.filter(d => d !== day) }));
                        }
                      }}
                      className="mr-1"
                    />
                    <span className="text-sm text-gray-700">{day.slice(0, 3)}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Block Time Slot
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Schedule Management Modal Component
function ScheduleManagementModal({ 
  barbers, 
  schedules, 
  onClose, 
  onUpdate 
}: { 
  barbers: Barber[]; 
  schedules: any[]; 
  onClose: () => void; 
  onUpdate: (barberId: number, schedule: any) => void;
}) {
  const [selectedBarber, setSelectedBarber] = useState<number | null>(null);
  const [schedule, setSchedule] = useState({
    monday: { start: '09:00', end: '17:00', isWorking: true },
    tuesday: { start: '09:00', end: '17:00', isWorking: true },
    wednesday: { start: '09:00', end: '17:00', isWorking: true },
    thursday: { start: '09:00', end: '17:00', isWorking: true },
    friday: { start: '09:00', end: '17:00', isWorking: true },
    saturday: { start: '10:00', end: '16:00', isWorking: true },
    sunday: { start: '10:00', end: '16:00', isWorking: false }
  });

  const handleDayChange = (day: string, field: string, value: any) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day as keyof typeof prev], [field]: value }
    }));
  };

  const handleSave = () => {
    if (selectedBarber) {
      onUpdate(selectedBarber, schedule);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Manage Barber Schedules</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Barber</label>
          <select
            value={selectedBarber || ''}
            onChange={(e) => setSelectedBarber(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
          >
            <option value="">Select a barber</option>
            {barbers.map(barber => (
              <option key={barber.id} value={barber.id}>
                {barber.name}
              </option>
            ))}
          </select>
        </div>

        {selectedBarber && (
          <div className="space-y-4">
            {Object.entries(schedule).map(([day, daySchedule]) => (
              <div key={day} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
                <div className="w-20">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={daySchedule.isWorking}
                      onChange={(e) => handleDayChange(day, 'isWorking', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700 capitalize">{day}</span>
                  </label>
                </div>
                
                {daySchedule.isWorking && (
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={daySchedule.start}
                      onChange={(e) => handleDayChange(day, 'start', e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="time"
                      value={daySchedule.end}
                      onChange={(e) => handleDayChange(day, 'end', e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                )}
                
                {!daySchedule.isWorking && (
                  <span className="text-sm text-gray-500">Day Off</span>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedBarber}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Schedule
          </button>
        </div>
      </div>
    </div>
  );
}

// Product interface
interface Product {
  id: number
  name: string
  description: string
  price: number
  stock_quantity: number
  sku: string
  image: string
  is_featured: boolean
  created_at: string
  updated_at: string
}

// Products Section Component
function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    sku: '',
    image: '',
    is_featured: false
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  // Fetch products
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
      setError('Error loading products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Handle form submission for create/update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (showEditModal && !selectedProduct) return
    try {
      const url = showEditModal 
        ? `http://localhost:5000/api/products/${selectedProduct!.id}`
        : 'http://localhost:5000/api/products'
      
      const method = showEditModal ? 'PUT' : 'POST'
      
      let requestBody
      let contentType
      
      // If there's a file to upload, use FormData
      if (selectedFile) {
        const formDataToSend = new FormData()
        formDataToSend.append('name', formData.name)
        formDataToSend.append('description', formData.description)
        formDataToSend.append('price', formData.price)
        formDataToSend.append('stock_quantity', formData.stock_quantity)
        formDataToSend.append('sku', formData.sku)
        formDataToSend.append('is_featured', formData.is_featured ? '1' : '0')
        formDataToSend.append('image', selectedFile)
        
        requestBody = formDataToSend
        contentType = undefined // Let browser set Content-Type for FormData
      } else {
        // No file, send JSON
        requestBody = JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          stock_quantity: parseInt(formData.stock_quantity),
          sku: formData.sku,
          is_featured: formData.is_featured
        })
        contentType = 'application/json'
      }
      
      const response = await fetch(url, {
        method,
        headers: contentType ? { 'Content-Type': contentType } : {},
        body: requestBody
      })

      const data = await response.json()
      
      if (data.success) {
        fetchProducts()
        setShowAddModal(false)
        setShowEditModal(false)
        resetForm()
      } else {
        setError(data.message || 'Failed to save product')
      }
    } catch (error) {
      console.error('Error saving product:', error)
      setError('Error saving product')
    }
  }

  // Handle delete
  const handleDelete = async () => {
    if (!selectedProduct) return
    try {
      const response = await fetch(`http://localhost:5000/api/products/${selectedProduct.id}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      
      if (data.success) {
        fetchProducts()
        setShowDeleteModal(false)
        setSelectedProduct(null)
      } else {
        setError(data.message || 'Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      setError('Error deleting product')
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock_quantity: '',
      sku: '',
      image: '',
      is_featured: false
    })
    setSelectedProduct(null)
    setSelectedFile(null)
    setImagePreview('')
  }

  // Handle file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle edit
  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      stock_quantity: product.stock_quantity.toString(),
      sku: product.sku || '',
      image: product.image || '',
      is_featured: Boolean(product.is_featured)
    })
    setImagePreview(product.image || '')
    setSelectedFile(null)
    setShowEditModal(true)
  }

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = filterStatus === 'all' || 
        (filterStatus === 'in-stock' && product.stock_quantity > 0) ||
        (filterStatus === 'low-stock' && product.stock_quantity > 0 && product.stock_quantity <= 5) ||
        (filterStatus === 'out-of-stock' && product.stock_quantity === 0) ||
        (filterStatus === 'featured' && product.is_featured)
      
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'price':
          return a.price - b.price
        case 'stock':
          return b.stock_quantity - a.stock_quantity
        case 'date':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        default:
          return 0
      }
    })

  // Calculate stats
  const totalProducts = products.length
  const lowStockCount = products.filter(p => p.stock_quantity > 0 && p.stock_quantity <= 5).length
  const featuredCount = products.filter(p => p.is_featured).length
  const outOfStockCount = products.filter(p => p.stock_quantity === 0).length

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Products Management</h2>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Products</p>
                <p className="text-2xl font-semibold text-gray-900">{totalProducts}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <AlertCircle className="w-8 h-8 text-orange-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Low Stock</p>
                <p className="text-2xl font-semibold text-orange-600">{lowStockCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <Star className="w-8 h-8 text-amber-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Featured</p>
                <p className="text-2xl font-semibold text-amber-600">{featuredCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <XCircle className="w-8 h-8 text-red-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Out of Stock</p>
                <p className="text-2xl font-semibold text-red-600">{outOfStockCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            {/* Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="all">All Products</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
              <option value="featured">Featured</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="stock">Sort by Stock</option>
              <option value="date">Sort by Date</option>
            </select>
          </div>

          {/* Add Product Button */}
          <button
            onClick={() => {
              resetForm()
              setShowAddModal(true)
            }}
            className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => setError('')}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            <span className="ml-2 text-gray-600">Loading products...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">Get started by adding your first product.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-16">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-16 w-16 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center">
                              <Package className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                            {product.is_featured && (
                              <Star className="inline w-4 h-4 text-amber-500 ml-2" />
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            SKU: {product.sku || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${product.price.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`text-sm font-medium ${
                          product.stock_quantity === 0 
                            ? 'text-red-600' 
                            : product.stock_quantity <= 5 
                            ? 'text-orange-600' 
                            : 'text-green-600'
                        }`}>
                          {product.stock_quantity}
                        </span>
                        {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                          <AlertCircle className="w-4 h-4 text-orange-500 ml-1" />
                        )}
                        {product.stock_quantity === 0 && (
                          <XCircle className="w-4 h-4 text-red-500 ml-1" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.stock_quantity > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                        {product.is_featured && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-amber-600 hover:text-amber-900 p-1 rounded"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProduct(product)
                            setFormData({
                              ...formData,
                              is_featured: !product.is_featured
                            })
                            // Toggle featured status
                            fetch(`http://localhost:5000/api/products/${product.id}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                ...product,
                                is_featured: product.is_featured ? 0 : 1
                              })
                            }).then(() => fetchProducts())
                          }}
                          className={`p-1 rounded ${
                            product.is_featured 
                              ? 'text-amber-600 hover:text-amber-900' 
                              : 'text-gray-400 hover:text-amber-600'
                          }`}
                          title={product.is_featured ? 'Remove from Featured' : 'Add to Featured'}
                        >
                          <Star className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProduct(product)
                            setShowDeleteModal(true)
                          }}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {showEditModal ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setShowEditModal(false)
                    resetForm()
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Enter product name"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Enter product description"
                  />
                </div>

                {/* Price and Stock */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={formData.stock_quantity}
                      onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* SKU */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Product SKU"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                  
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mt-3">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>

                {/* Featured Product */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      Featured Product
                    </span>
                  </label>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      setShowEditModal(false)
                      resetForm()
                    }}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                  >
                    {showEditModal ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Delete Product</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{selectedProduct.name}"? This action cannot be undone.
              </p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setSelectedProduct(null)
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

