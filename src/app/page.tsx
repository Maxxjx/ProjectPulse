"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1128] to-[#1A1F71] text-white relative overflow-hidden">
      {/* Header/Navigation */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center backdrop-blur-md bg-[#1a0127]/30 fixed top-0 left-0 right-0 z-50 shadow-lg border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-[#8B5CF6] to-[#FF007F] rounded-xl flex items-center justify-center">
            <span className="font-bold text-white text-xl">P</span>
          </div>
          <span className="font-bold text-2xl bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">ProjectPulse</span>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex items-center space-x-8">
            <li><a href="#product" className="text-gray-300 hover:text-white hover:scale-105 transition-all duration-200">Home</a></li>
            <li><a href="#features" className="text-gray-300 hover:text-white hover:scale-105 transition-all duration-200">Features</a></li>
            <li><a href="#testimonials" className="text-gray-300 hover:text-white hover:scale-105 transition-all duration-200">Testimonials</a></li>
            <li><Link href="/login" className="bg-gradient-to-r from-[#8B5CF6] to-[#9F7AEA] px-6 py-2.5 rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200">Log in</Link></li>
            <li><Link href="/login" className="bg-gradient-to-r from-[#FF007F] to-[#FF4D94] px-6 py-2.5 rounded-lg hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-200">View Demo</Link></li>
          </ul>
        </nav>

        {/* Mobile Navigation */}
        <div className={`md:hidden fixed inset-0 bg-[#1a0127] bg-opacity-95 backdrop-blur-xl transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            <a href="#product" className="text-xl hover:text-white hover:scale-105 transition-all duration-200">Product</a>
            <a href="#features" className="text-xl hover:text-white hover:scale-105 transition-all duration-200">Features</a>
            <a href="#testimonials" className="text-xl hover:text-white hover:scale-105 transition-all duration-200">Testimonials</a>
            <Link href="/login" className="bg-gradient-to-r from-[#8B5CF6] to-[#9F7AEA] px-8 py-3 rounded-lg">Log in</Link>
            <Link href="/demo" className="bg-gradient-to-r from-[#FF007F] to-[#FF4D94] px-8 py-3 rounded-lg">View Demo</Link>
          </div>
        </div>
      </header>

      {/* Enhanced Hero Section with Beautiful Background */}
      <section className="container mx-auto pt-32 pb-20 px-4 text-center relative">
        {/* Create stunning background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob"></div>
        <div className="absolute top-32 -right-24 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-4000"></div>
        <div className="absolute right-1/3 bottom-8 w-8 h-8 bg-white rounded-full opacity-30 animate-ping"></div>
        <div className="absolute left-1/4 top-1/3 w-4 h-4 bg-white rounded-full opacity-20 animate-ping animation-delay-2000"></div>
        <div className="relative z-10">
          <span className="inline-block px-4 py-2 rounded-full bg-white/10 text-sm font-medium mb-6 hover:bg-white/20 transition-all cursor-pointer">
            🚀 Discover the future of project management
          </span>
          <h1 className="text-4xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text leading-tight">
            Better Projects with <br/>
            <span className="bg-gradient-to-r from-[#FF007F] to-[#8B5CF6] text-transparent bg-clip-text">ProjectPulse</span>
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-10 text-gray-300">
            Streamline your workflow, boost productivity, and deliver projects on time with our intelligent project management platform.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
            <Link 
              href="/get-started" 
              className="bg-gradient-to-r from-[#FF007F] to-[#8B5CF6] px-8 py-4 rounded-lg text-lg font-semibold hover:opacity-90 transition transform hover:scale-105 inline-flex items-center gap-2 shadow-lg shadow-purple-500/20"
            >
              Get Started Free
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link 
              href="/login" 
              className="px-8 py-4 rounded-lg text-lg font-semibold border border-white/20 hover:bg-white/10 transition inline-flex items-center gap-2"
            >
              Watch Demo
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section - Showcase Numbers */}
      <section className="container mx-auto py-16 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 blur-3xl rounded-3xl"></div>
        <div className="relative z-10 text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">Trusted by Teams Worldwide</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Our platform empowers teams to deliver exceptional results.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 transform transition-all hover:scale-105 hover:border-purple-500/30">
            <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#FF007F] text-transparent bg-clip-text mb-2">5,000+</h3>
            <p className="text-gray-400">Active Projects</p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 transform transition-all hover:scale-105 hover:border-purple-500/30">
            <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#FF007F] text-transparent bg-clip-text mb-2">98%</h3>
            <p className="text-gray-400">On-time Delivery</p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 transform transition-all hover:scale-105 hover:border-purple-500/30">
            <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#FF007F] text-transparent bg-clip-text mb-2">10,000+</h3>
            <p className="text-gray-400">Active Users</p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 transform transition-all hover:scale-105 hover:border-purple-500/30">
            <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#FF007F] text-transparent bg-clip-text mb-2">45%</h3>
            <p className="text-gray-400">Productivity Boost</p>
          </div>
        </div>
      </section>

      {/* Quick Access Section for Returning Users */}
      <section className="container mx-auto py-12 px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">Quick Access</h2>
          <Link href="/dashboard" className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
            View All 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 hover:bg-white/10 transition cursor-pointer border border-white/10 group">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Recent Projects</h3>
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">Quick access to your latest work</p>
            <div className="space-y-2">
              <div className="text-xs text-gray-300 bg-white/5 rounded-lg px-3 py-2 flex justify-between">
                <span>Website Redesign</span>
                <span className="text-purple-400">65%</span>
              </div>
              <div className="text-xs text-gray-300 bg-white/5 rounded-lg px-3 py-2 flex justify-between">
                <span>Mobile App Dev</span>
                <span className="text-purple-400">35%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 hover:bg-white/10 transition cursor-pointer border border-white/10 group">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Your Tasks</h3>
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">Your assigned tasks</p>
            <div className="space-y-2">
              <div className="text-xs text-gray-300 bg-white/5 rounded-lg px-3 py-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                <span>Design Homepage Mockup</span>
              </div>
              <div className="text-xs text-gray-300 bg-white/5 rounded-lg px-3 py-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span>API Integration</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 hover:bg-white/10 transition cursor-pointer border border-white/10 group">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Team Activity</h3>
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">Recent team updates</p>
            <div className="space-y-2">
              <div className="text-xs text-gray-300 bg-white/5 rounded-lg px-3 py-2">
                John completed API setup task
              </div>
              <div className="text-xs text-gray-300 bg-white/5 rounded-lg px-3 py-2">
                Sarah added new homepage designs
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 hover:bg-white/10 transition cursor-pointer border border-white/10 group">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Upcoming Deadlines</h3>
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">Don't miss important dates</p>
            <div className="space-y-2">
              <div className="text-xs text-gray-300 bg-white/5 rounded-lg px-3 py-2 flex justify-between">
                <span>Website Launch</span>
                <span className="text-red-400">2 days</span>
              </div>
              <div className="text-xs text-gray-300 bg-white/5 rounded-lg px-3 py-2 flex justify-between">
                <span>Client Meeting</span>
                <span className="text-yellow-400">5 days</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-[#111827]/50 backdrop-blur-xl border-t border-white/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">Key Features</h2>
          <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">Everything you need to manage projects efficiently and deliver results on time.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Feature Cards - keeping same structure but updating styles */}
            <div className="bg-[#1F2937]/50 backdrop-blur-xl p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-500/10 border border-white/5">
              <div className="w-14 h-14 bg-gradient-to-r from-[#8B5CF6] to-[#FF007F] rounded-xl flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">Multi-Role Access</h3>
              <p className="text-gray-400 leading-relaxed">
                Tailored dashboards for administrators, analysts, staff, and clients with role-specific features.
              </p>
            </div>
            
            {/* Copy same styling to other feature cards */}
            <div className="bg-[#1F2937]/50 backdrop-blur-xl p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-500/10 border border-white/5">
              <div className="w-14 h-14 bg-gradient-to-r from-[#8B5CF6] to-[#FF007F] rounded-xl flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">Real-Time Analytics</h3>
              <p className="text-gray-400 leading-relaxed">
                Interactive charts and reports provide insights into project performance and resource allocation.
              </p>
            </div>

            <div className="bg-[#1F2937]/50 backdrop-blur-xl p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-500/10 border border-white/5">
              <div className="w-14 h-14 bg-gradient-to-r from-[#8B5CF6] to-[#FF007F] rounded-xl flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">Task Management</h3>
              <p className="text-gray-400 leading-relaxed">
                Drag-and-drop Kanban boards, time tracking, and collaboration tools for efficient project execution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section id="testimonials" className="py-20 bg-[#111827]/30 backdrop-blur-xl border-t border-white/5 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute -right-64 -bottom-64 w-[500px] h-[500px] bg-blue-500/20 rounded-full mix-blend-multiply filter blur-[80px] opacity-30"></div>
        <div className="absolute -left-24 top-0 w-64 h-64 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-[80px] opacity-30"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-white/10 text-sm font-medium mb-4 hover:bg-white/20 transition-all cursor-pointer">
              ❤️ Trusted by thousands
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">What Our Users Say</h2>
            <p className="text-gray-400 text-center max-w-2xl mx-auto">Join thousands of satisfied teams who trust ProjectPulse for their project management needs.</p>
          </div>
          
          {/* Testimonial Carousel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Testimonial Cards */}
            <div className="bg-gradient-to-br from-[#1F2937]/80 to-[#1F2937]/30 backdrop-blur-xl p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/10 border border-white/10 flex flex-col">
              <div className="flex-grow">
                <div className="mb-6 text-2xl text-blue-400">
                  "" {/* Quotation mark */}
                </div>
                <p className="text-gray-200 leading-relaxed mb-6">
                  ProjectPulse revolutionized how our team collaborates. The real-time analytics and role-based access 
                  have significantly improved our project delivery times.
                </p>
              </div>
              <div className="flex items-center border-t border-white/10 pt-6 mt-auto">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full mr-4 flex items-center justify-center text-white font-bold">
                  SJ
                </div>
                <div>
                  <p className="font-semibold text-lg text-white">Sarah Johnson</p>
                  <p className="text-sm text-blue-400">CTO, TechInnovate</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1F2937]/80 to-[#1F2937]/30 backdrop-blur-xl p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-500/10 border border-white/10 flex flex-col">
              <div className="flex-grow">
                <div className="mb-6 text-2xl text-purple-400">
                  "" {/* Quotation mark */}
                </div>
                <p className="text-gray-200 leading-relaxed mb-6">
                  As a project manager, I've tried numerous tools, but ProjectPulse stands out with its intuitive 
                  interface and comprehensive feature set. It's a game-changer for our entire organization!
                </p>
              </div>
              <div className="flex items-center border-t border-white/10 pt-6 mt-auto">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-700 rounded-full mr-4 flex items-center justify-center text-white font-bold">
                  MC
                </div>
                <div>
                  <p className="font-semibold text-lg text-white">Michael Chen</p>
                  <p className="text-sm text-purple-400">Senior PM, GlobalSystems</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1F2937]/80 to-[#1F2937]/30 backdrop-blur-xl p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-indigo-500/10 border border-white/10 flex flex-col">
              <div className="flex-grow">
                <div className="mb-6 text-2xl text-indigo-400">
                  "" {/* Quotation mark */}
                </div>
                <p className="text-gray-200 leading-relaxed mb-6">
                  The dashboard analytics in ProjectPulse have given us unprecedented insights into our workflow efficiency. 
                  We've reduced project completion time by 35% since implementing it.
                </p>
              </div>
              <div className="flex items-center border-t border-white/10 pt-6 mt-auto">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-full mr-4 flex items-center justify-center text-white font-bold">
                  AT
                </div>
                <div>
                  <p className="font-semibold text-lg text-white">Alex Thompson</p>
                  <p className="text-sm text-indigo-400">Director, DataFirst Inc.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Logos */}
          <div className="mt-20 pt-10 border-t border-white/5">
            <p className="text-center text-sm text-gray-400 mb-8">Trusted by innovative companies worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70">
              <div className="w-32 h-10 bg-white/10 rounded-md"></div>
              <div className="w-32 h-10 bg-white/10 rounded-md"></div>
              <div className="w-32 h-10 bg-white/10 rounded-md"></div>
              <div className="w-32 h-10 bg-white/10 rounded-md"></div>
              <div className="w-32 h-10 bg-white/10 rounded-md"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section with 3D Elements */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        {/* Interactive background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5] via-[#9333EA] to-[#EC4899] opacity-90"></div>
        
        {/* Geometric shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-12 left-12 w-72 h-72 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/4 left-1/3 w-6 h-6 bg-white/30 rounded-full"></div>
          <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-white/20 rounded-full"></div>
          
          {/* Animated floating elements */}
          <div className="absolute top-20 right-1/4 w-24 h-24 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-lg rotate-12 animate-float"></div>
          <div className="absolute bottom-20 left-1/4 w-32 h-32 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-lg -rotate-12 animate-float-delay"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block px-4 py-2 rounded-full bg-white/20 text-sm font-medium mb-4 hover:bg-white/30 transition-all cursor-pointer">
              ✨ Limited Time Offer
            </span>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">Ready to Transform Your <br/> Project Management?</h2>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10 drop-shadow">
              Join thousands of teams who have already revolutionized their workflow with ProjectPulse.
            </p>
            
            {/* Stats in a row */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">30%</p>
                <p className="text-white/70 text-sm">Time Savings</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">45%</p>
                <p className="text-white/70 text-sm">Productivity Boost</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">14-day</p>
                <p className="text-white/70 text-sm">Free Trial</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
              <Link 
                href="/login" 
                className="w-full md:w-auto bg-white text-[#4F46E5] px-8 py-5 rounded-xl text-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105 inline-flex justify-center items-center gap-2 shadow-lg shadow-indigo-900/20"
              >
                Start Free Trial
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link
                href="/demo"
                className="w-full md:w-auto px-8 py-5 rounded-xl text-lg font-semibold border border-white/30 backdrop-blur-sm hover:bg-white/10 transition inline-flex justify-center items-center gap-2 text-white"
              >
                Schedule Demo
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Modern Footer */}
      <footer className="pt-16 pb-10 bg-[#0A1128] border-t border-white/5 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-[#111827] to-transparent opacity-70"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-12 left-1/3 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12 pb-12 border-b border-white/5">
            {/* Brand column */}
            <div className="col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-[#4F46E5] to-[#EC4899] rounded-xl flex items-center justify-center">
                  <span className="font-bold text-white text-lg">P</span>
                </div>
                <span className="font-bold text-2xl bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">ProjectPulse</span>
              </div>
              <p className="text-gray-400 mb-6">
                The next-generation platform for efficient project management and team collaboration.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg>
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path></svg>
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"></path></svg>
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Integrations</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Enterprise</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Security</a></li>
              </ul>
            </div>
            
            {/* Resources */}
            <div>
              <h3 className="font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Guides</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">API Reference</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Community</a></li>
              </ul>
            </div>
            
            {/* Company */}
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Terms</a></li>
              </ul>
            </div>
          </div>
          
          {/* Copyright and legal */}
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 mb-4 md:mb-0">© 2025 ProjectPulse. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-gray-400 hover:text-white transition">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition">Terms of Service</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
