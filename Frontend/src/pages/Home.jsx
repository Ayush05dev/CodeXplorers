import Navbar from '../components/Navbar';
import Button from '../components/Button';
import bgImage from '../assets/stevee.png';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <main 
        className="h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url(${bgImage})`}}
      >
        {/* Subtle dark gradient overlay for better text contrast */}
        {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div> */}
        
        <div className="text-center  relative z-10 mb-60  py-12 px-10 mr-140 mt-70 ">
          <h1 className="text-5xl font-bold mb-4 text-gray-200">Welcome to INVSTART HUB</h1>
          <p className="text-xl mb-8 text-gray-200">AI-powered startup funding made simple.</p>
          <Button className="transform transition-transform duration-400 hover:scale-105 shadow-lg">
            <Link to='/signup'>Get Started</Link>
          </Button>
        </div>
      </main>

      {/* How It Works Section */}
  
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-5xl font-extrabold text-center mb-12 text-gray-900">
              How <span className="text-blue-600">INVSTART HUB</span> Works
            </h2>
            <div className="relative bg-white shadow-lg rounded-xl p-8 border border-gray-200">
        
              <div className="absolute left-5 top-0 h-full w-1 bg-gray-300 rounded-full"></div>

      
              <div className="relative flex items-start mb-8">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg shadow-md">
                  1
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-gray-900">Create Your Profile</h3>
                  <p className="text-gray-600">
                    Build a comprehensive profile showcasing your startup or investment preferences.
                  </p>
                </div>
              </div>
              <div className="relative flex items-start mb-8">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg shadow-md">
                  2
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-gray-900">AI-Powered Matching</h3>
                  <p className="text-gray-600">
                    Our algorithm connects entrepreneurs with the most suitable investors.
                  </p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg shadow-md">
                  3
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-gray-900">Secure Funding</h3>
                  <p className="text-gray-600">
                    Connect, pitch, and secure the funding.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

     {/* Platform Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-5xl font-extrabold text-center mb-12 text-gray-900">
            Platform <span className="text-blue-600">Features</span>
          </h2>

          {/* Single Unified Card */}
          <div className="bg-white shadow-lg rounded-xl p-10 border border-gray-200 flex flex-col md:flex-row items-center">
            
            {/* Left Side: Entrepreneurs */}
            <div className="flex-1 p-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                🚀 For Entrepreneurs
              </h3>
              <ul className="space-y-5">
                <li className="flex items-start">
                  <span className="text-blue-500 text-xl mr-3">💡</span>
                  <div>
                    <h4 className="font-semibold">AI Pitch Evaluation</h4>
                    <p className="text-gray-600">Get instant feedback on your pitch deck from our AI system.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 text-xl mr-3">📈</span>
                  <div>
                    <h4 className="font-semibold">Business Plan Builder</h4>
                    <p className="text-gray-600">Create comprehensive business plans with AI assistance.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 text-xl mr-3">🤝</span>
                  <div>
                    <h4 className="font-semibold">Investor Matching</h4>
                    <p className="text-gray-600">Get matched with investors who align with your industry and goals.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Vertical Divider */}
            <div className="hidden md:block w-0.5 bg-gray-300 mx-8"></div>

            {/* Right Side: Investors */}
            <div className="flex-1 p-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                💰 For Investors
              </h3>
              <ul className="space-y-5">
                <li className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">🔍</span>
                  <div>
                    <h4 className="font-semibold">Smart Deal Flow</h4>
                    <p className="text-gray-600">Access pre-screened startups that match your investment criteria.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">📊</span>
                  <div>
                    <h4 className="font-semibold">Due Diligence Tools</h4>
                    <p className="text-gray-600">Comprehensive analysis and verification tools at your fingertips.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">📂</span>
                  <div>
                    <h4 className="font-semibold">Portfolio Management</h4>
                    <p className="text-gray-600">Track and manage your startup investments in one place.</p>
                  </div>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}