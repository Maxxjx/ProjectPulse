import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1F2937] text-white">
      {/* Header/Navigation */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#8B5CF6] rounded-md flex items-center justify-center">
            <span className="font-bold text-white">P</span>
          </div>
          <span className="font-bold text-xl">ProjectPulse</span>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li><a href="#features" className="hover:text-[#8B5CF6] transition">Features</a></li>
            <li><a href="#testimonials" className="hover:text-[#8B5CF6] transition">Testimonials</a></li>
            <li><Link href="/login" className="bg-[#8B5CF6] px-4 py-2 rounded-md hover:bg-opacity-90 transition">View Demo</Link></li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto py-20 px-4 text-center">
        <h1 className="text-5xl font-bold mb-6">Manage Projects with Precision and Ease</h1>
        <p className="text-xl max-w-3xl mx-auto mb-10 text-gray-300">
          ProjectPulse is a high-performance, scalable, and secure project management system 
          designed for teams of all sizes.
        </p>
        <Link 
          href="/login" 
          className="bg-[#8B5CF6] text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-opacity-90 transition inline-block"
        >
          View Demo
        </Link>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-[#111827]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#1F2937] p-6 rounded-lg">
              <div className="w-12 h-12 bg-[#8B5CF6] rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Multi-Role Access</h3>
              <p className="text-gray-400">
                Tailored dashboards for administrators, analysts, staff, and clients with role-specific features.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#1F2937] p-6 rounded-lg">
              <div className="w-12 h-12 bg-[#8B5CF6] rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-Time Analytics</h3>
              <p className="text-gray-400">
                Interactive charts and reports provide insights into project performance and resource allocation.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#1F2937] p-6 rounded-lg">
              <div className="w-12 h-12 bg-[#8B5CF6] rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Task Management</h3>
              <p className="text-gray-400">
                Drag-and-drop Kanban boards, time tracking, and collaboration tools for efficient project execution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">What Our Users Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-[#111827] p-6 rounded-lg">
              <p className="text-gray-300 italic mb-4">
                "ProjectPulse revolutionized how our team collaborates. The real-time analytics and role-based access 
                have significantly improved our project delivery times."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-[#8B5CF6] rounded-full mr-3"></div>
                <div>
                  <p className="font-medium">Sarah Johnson</p>
                  <p className="text-sm text-gray-400">CTO, TechInnovate</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-[#111827] p-6 rounded-lg">
              <p className="text-gray-300 italic mb-4">
                "As a project manager, I've tried numerous tools, but ProjectPulse stands out with its intuitive 
                interface and comprehensive feature set. It's a game-changer!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-[#8B5CF6] rounded-full mr-3"></div>
                <div>
                  <p className="font-medium">Michael Chen</p>
                  <p className="text-sm text-gray-400">Senior PM, GlobalSystems</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#8B5CF6]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Project Management?</h2>
          <p className="text-xl max-w-3xl mx-auto mb-10">
            Experience the power of ProjectPulse with our interactive demo.
          </p>
          <Link 
            href="/login" 
            className="bg-white text-[#8B5CF6] px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-100 transition inline-block"
          >
            View Demo
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-[#111827]">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-[#8B5CF6] rounded-md flex items-center justify-center">
                <span className="font-bold text-white text-xs">P</span>
              </div>
              <span className="font-bold">ProjectPulse</span>
            </div>
            <p className="text-sm text-gray-400">© 2023 ProjectPulse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
