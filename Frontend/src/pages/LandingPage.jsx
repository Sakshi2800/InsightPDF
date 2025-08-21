import React from 'react'
import { useNavigate } from 'react-router-dom';

function LandingPage() {
    const navigate = useNavigate();

    const handlExplore = ()=> {
        const token = localStorage.getItem("token");
        if(token) navigate("/dashboard");
        else navigate("/login");
    }
  return (
    <div className='w-full'>
      <div className="relative min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <div className="container mx-auto px-6 py-16 h-full flex items-center">
        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-12">
          <div className="md:w-1/2 mb-10 md:mb-0 space-y-8">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-purple-900 leading-tight">
              AI Research <span className="text-purple-600">Assistant</span>
            </h1>
            <p className="text-2xl md:text-3xl text-purple-700 leading-relaxed">
              Your AI-powered partner for research and discovery, helping you analyze complex data and extract key insights.
            </p>
            <button 
              className="bg-purple-600 text-white px-8 py-4 rounded-xl hover:bg-purple-700 transition shadow-xl text-xl font-semibold"
              onClick={handlExplore}
            >
              Explore Now
            </button>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <img 
              src="/chatbotamico.svg" 
              alt="AI Assistant" 
              className="w-full max-w-xl lg:max-w-2xl xl:max-w-3xl h-auto"
            />
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default LandingPage
