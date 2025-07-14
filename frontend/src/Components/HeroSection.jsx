import React from 'react';

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const HeroSection = () => {
  const features = [
    {
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
      title: "AI Image Upscaler",
      description: "Enhance image resolution up to 4x using advanced AI algorithms while preserving quality."
    },
    {
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.486M7 17h.01" />
        </svg>
      ),
      title: "Image Converter",
      description: "Convert between JPG, PNG, WEBP, and other popular image formats with one click."
    },
    {
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      title: "Image Compressor",
      description: "Reduce file size without losing quality. Perfect for web and mobile optimization."
    },
    {
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      title: "Background Remover",
      description: "Instantly remove backgrounds from images with AI-powered precision."
    },
    {
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      ),
      title: "Image Resizer & Cropper",
      description: "Resize and crop images to exact dimensions while maintaining aspect ratio."
    },
    {
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.486M7 17h.01" />
        </svg>
      ),
      title: "Color Palette Extractor",
      description: "Generate beautiful color palettes from your images with a single click."
    }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 to-white">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-grid-indigo-100/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            All-in-One
            <span className="relative block">
              <span className="relative z-10 text-indigo-600">Image Processing</span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-indigo-100 -z-0 opacity-75"></span>
            </span>
            <span className="block text-2xl md:text-3xl font-normal mt-4">Powerful Tools for Your Images</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            From upscaling to background removal, we provide everything you need to enhance and transform your images.
            No design skills required – just upload and let our AI do the magic!
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-lg hover:shadow-indigo-200">
              Start Upscaling Now
            </button>
            <button className="px-8 py-4 bg-white text-indigo-600 font-medium border-2 border-indigo-100 rounded-lg hover:bg-indigo-50 transition-colors duration-200">
              Learn More
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Powerful Image Tools
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <a 
                href={`#${feature.title.toLowerCase().replace(/\s+/g, '-')}`}
                key={index}
                className="block hover:no-underline"
              >
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              </a>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
          <div className="text-center">
            <div className="text-4xl font-bold">6+</div>
            <div className="mt-2 text-indigo-100">Powerful Tools</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold">10M+</div>
            <div className="mt-2 text-indigo-100">Images Processed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold">99.9%</div>
            <div className="mt-2 text-indigo-100">Customer Satisfaction</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Transform Your Images?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust our tools for their image processing needs.
          </p>
          <button className="px-8 py-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-lg hover:shadow-indigo-200">
            Get Started for Free
          </button>
          <p className="mt-4 text-sm text-gray-500">No credit card required. Cancel anytime.</p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;