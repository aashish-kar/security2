import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <div 
      className="py-20 relative"
      style={{
        backgroundImage: `url('/src/assets/images/hero.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to watchShop
          </h1>
          <p className="text-lg text-white mb-8 max-w-2xl mx-auto">
            Find your perfect watch from our collection of quality timepieces
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate("/menu")}
              className="bg-blue-600 text-white py-3 px-8 text-lg font-semibold rounded-lg hover:bg-blue-700"
            >
              Shop Now
            </button>
            <button
              onClick={() => navigate("/menu")}
              className="border-2 border-white text-white py-3 px-8 text-lg font-semibold rounded-lg hover:bg-white hover:text-gray-800"
            >
              View Collection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
