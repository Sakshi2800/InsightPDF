import React from "react";

const HeroSection = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient Background with Mountain Silhouette */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-purple-900 to-red-600 opacity-90"
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 100%)",
          backgroundImage: "linear-gradient(to bottom right, rgba(88, 28, 135, 0.9), rgba(220, 38, 38, 0.9))",
        }}
      >
        {/* Mountain Silhouette Effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: "url(/mountain-silhouette.svg)",
            backgroundPosition: "bottom",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover"
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-6 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Unlock your professional potential
          </h1>

          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Level up with community-powered learning, in-person or virtual events around the world, and endless tools for go-to-market leaders.
          </p>

          {/* Action Buttons */}
          <div className="mt-10 flex justify-center space-x-4">
            <button 
              className="bg-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/30 transition"
            >
              Explore
            </button>
            <button className="bg-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/30 transition">
              Upload files
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
