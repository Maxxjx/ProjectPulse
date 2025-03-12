"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0127] to-[#200133] text-white">
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

      {/* Enhanced Hero Section */}
      <section className="container mx-auto pt-32 pb-20 px-4 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl"></div>
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

      {/* Quick Access Section for Returning Users */}
      <section className="container mx-auto py-10 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 hover:bg-white/10 transition cursor-pointer border border-white/10">
            <h3 className="font-semibold mb-2">Recent Projects</h3>
            <p className="text-sm text-gray-400">Quick access to your latest work</p>
          </div>
          {/* Add more quick access cards */}
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

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-[#111827]/30 backdrop-blur-xl border-t border-white/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">What Our Users Say</h2>
          <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">Join thousands of satisfied teams who trust ProjectPulse.</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Testimonial Cards */}
            <div className="bg-[#1F2937]/50 backdrop-blur-xl p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10 border border-white/5">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-[#8B5CF6] to-[#FF007F] rounded-xl mr-4"></div>
                <div>
                  <p className="font-semibold text-lg bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">Sarah Johnson</p>
                  <p className="text-sm text-gray-400">CTO, TechInnovate</p>
                </div>
              </div>
              <p className="text-gray-300 italic leading-relaxed">
                "ProjectPulse revolutionized how our team collaborates. The real-time analytics and role-based access 
                have significantly improved our project delivery times."
              </p>
            </div>

            <div className="bg-[#1F2937]/50 backdrop-blur-xl p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10 border border-white/5">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-[#8B5CF6] to-[#FF007F] rounded-xl mr-4"></div>
                <div>
                  <p className="font-semibold text-lg bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">Michael Chen</p>
                  <p className="text-sm text-gray-400">Senior PM, GlobalSystems</p>
                </div>
              </div>
              <p className="text-gray-300 italic leading-relaxed">
                "As a project manager, I've tried numerous tools, but ProjectPulse stands out with its intuitive 
                interface and comprehensive feature set. It's a game-changer!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-[#8B5CF6] to-[#FF007F] relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 mask-gradient"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 drop-shadow-lg">Ready to Transform Your Project Management?</h2>
          <p className="text-xl max-w-3xl mx-auto mb-10 drop-shadow">
            Join thousands of teams who have already revolutionized their workflow with ProjectPulse.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
            <Link 
              href="/login" 
              className="bg-white text-[#8B5CF6] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105 inline-block shadow-lg"
            >
              Start Free Trial
            </Link>
            <Link
              href="/demo"
              className="px-8 py-4 rounded-lg text-lg font-semibold border border-white hover:bg-white/10 transition"
            >
              Schedule Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#111827] border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-[#8B5CF6] to-[#FF007F] rounded-lg flex items-center justify-center">
                <span className="font-bold text-white text-sm">P</span>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">ProjectPulse</span>
            </div>
            <div className="flex items-center gap-8">
              <a href="#" className="text-gray-400 hover:text-white transition">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Contact</a>
            </div>
            <p className="text-sm text-gray-400">© 2023 ProjectPulse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
