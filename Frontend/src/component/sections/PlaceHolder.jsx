import React from 'react'
import { Sparkles } from 'lucide-react';

const PlaceHolder = ({ setInputMessage }) => {
    const suggestionButtons = [
        'Summarize PDF',
        'Explain the content of this pdf',
        'What is this PDF about?',
        'Show important terms',
        'Find a specific topic',
        'Give predictive analysis for this'
      ];

  return (
    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 mx-auto pb-12'>
        <div className="mb-12 ">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-6 h-6 text-gray-800" />
          </div>
          <h1 className="text-5xl font-semibold mb-2 ">Talk Data to Me</h1>
          <p className="text-gray-600 text-xl">
            Choose a prompt below or write your own to start chatting about the pdfs data.
            If you haven't uploaded any pdf then upload it <span className='cursor-pointer text-blue-600'>here</span>
          </p>
        </div>

        {/* Ask About Section */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
            {suggestionButtons.map((text, index) => (
              <button
                onClick={() => setInputMessage(text)}
                key={index}
                className="hover:bg-purple-100 border border-dark hover:bg-gray-200 px-4 py-2 rounded-full text-md transition-colors"
              >
                {text}
              </button>
            ))}
          </div>
        </div>
      </div>
  )
}

export default PlaceHolder
