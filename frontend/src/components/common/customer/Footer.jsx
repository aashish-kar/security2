const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Logo + About */}
        <div>
          <div className="flex items-center mb-4">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-lg">W</span>
            </div>
            <h2 className="text-xl font-bold">WATCHSHOP</h2>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            watchShop delivers luxury timepieces right to your door — authentic, secure, and backed by our quality guarantee.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li><a href="/about" className="hover:underline">About Us</a></li>
            <li><a href="/contact" className="hover:underline">Contact Us</a></li>
            <li><a href="/delivery-info" className="hover:underline">Delivery Info</a></li>
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Policies</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li><a href="/privacy-policy" className="hover:underline">Privacy Policy</a></li>
            <li><a href="/terms-conditions" className="hover:underline">Terms & Conditions</a></li>
            <li><a href="/refund-policy" className="hover:underline">Refund Policy</a></li>
            <li><a href="/cancellation-policy" className="hover:underline">Cancellation Policy</a></li>
          </ul>
        </div>

        {/* Contact + Socials */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Contact</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li><a href="mailto:contact@watchshop.com" className="hover:underline">contact@watchshop.com</a></li>
            <li>+1 (555) 123-4567</li>
            <li>Luxury District, New York</li>
          </ul>
          <div className="flex gap-4 mt-4">
            <a href="https://www.facebook.com/watchshop" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-400">
              Facebook
            </a>
            <a href="https://www.linkedin.com/company/watchshop" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-400">
              LinkedIn
            </a>
            <a href="https://x.com/watchshop" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-400">
              Twitter
            </a>
            <a href="https://www.instagram.com/watchshop" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-400">
              Instagram
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="text-center text-xs text-gray-400 border-t border-gray-600 mt-10 pt-6">
        © 2024 WatchShop. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
