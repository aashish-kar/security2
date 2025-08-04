import { Users, Truck, Shield, Smartphone, Mail, Phone, Clock, Heart, Star, Award } from "lucide-react";
import Footer from '../../components/common/customer/Footer';
import Layout from '../../components/common/customer/layout';

const About = () => { 
    return (
        <>
            <Layout />
            <div className="bg-gray-50 min-h-screen">
                {/* Header Section */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="text-center">
                            <div className="flex items-center justify-center mb-4">
                                <Clock className="w-8 h-8 text-gray-600 mr-3" />
                                <h1 className="text-3xl font-bold text-gray-900">About watchShop</h1>
                            </div>
                            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                                Timeless Elegance, Delivered to Your Doorstep 🕐
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Left Column - Story & Mission */}
                        <div className="space-y-8">
                    {/* Our Story */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Our Story</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    watchShop was founded with a passion for bringing premium timepieces to watch enthusiasts
                                    and collectors worldwide. What started as a small boutique has grown into a trusted online platform,
                                    connecting discerning customers with the finest watches from renowned brands.
                                </p>
                            </div>

                    {/* Our Mission */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Our Mission</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    We strive to make luxury watch shopping effortless and enjoyable, ensuring everyone
                                    has access to premium timepieces without leaving the comfort of their home.
                                    watchShop is committed to authentic products, exceptional service, and customer satisfaction.
                                </p>
                            </div>

                    {/* Our Team */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Our Team</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    We are a dedicated team of watch experts, tech enthusiasts, and customer service professionals
                                    working together to make your watchShop experience seamless and delightful.
                                    Customer satisfaction and product authenticity are our top priorities.
                                </p>
                            </div>

                    {/* Join Our Community */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Join Our Community</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Whether you're a watch collector looking for rare timepieces or a first-time buyer
                                    wanting to start your collection, watchShop welcomes you.
                                    Join us in celebrating the art of horology!
                                </p>
                            </div>
                        </div>

                        {/* Right Column - Features & Contact */}
                        <div className="space-y-8">
                            {/* Why Choose watchShop */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center mb-6">
                                    <Users className="w-5 h-5 text-gray-600 mr-2" />
                                    <h2 className="text-xl font-semibold text-gray-900">Why Choose watchShop?</h2>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <Truck className="w-4 h-4 text-gray-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900">Fast & Secure Delivery</h3>
                                            <p className="text-sm text-gray-600">Premium watches delivered safely to your doorstep</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <Award className="w-4 h-4 text-gray-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900">Authentic Products</h3>
                                            <p className="text-sm text-gray-600">100% genuine watches with warranty</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <Smartphone className="w-4 h-4 text-gray-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900">Easy Shopping</h3>
                                            <p className="text-sm text-gray-600">Simple platform for seamless watch shopping</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <Shield className="w-4 h-4 text-gray-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900">Secure Payments</h3>
                                            <p className="text-sm text-gray-600">Multiple safe and secure payment options</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                    {/* Contact Us */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center mb-6">
                                    <Mail className="w-5 h-5 text-gray-600 mr-2" />
                                    <h2 className="text-xl font-semibold text-gray-900">Contact Us</h2>
                                </div>
                                
                                <p className="text-gray-600 mb-4">
                                    Have questions about our watches or need assistance? We'd love to help!
                                </p>
                                
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <Mail className="w-4 h-4 text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Email</p>
                                            <p className="text-sm text-gray-600">support@watchshop.com</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <Phone className="w-4 h-4 text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Phone</p>
                                            <p className="text-sm text-gray-600">+1 234 567 890</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Section */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">watchShop by the Numbers</h2>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <div className="text-2xl font-bold text-gray-900">5000+</div>
                                        <div className="text-sm text-gray-600">Happy Customers</div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <div className="text-2xl font-bold text-gray-900">100+</div>
                                        <div className="text-sm text-gray-600">Premium Brands</div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <div className="text-2xl font-bold text-gray-900">24hr</div>
                                        <div className="text-sm text-gray-600">Customer Support</div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <div className="text-2xl font-bold text-gray-900">4.9★</div>
                                        <div className="text-sm text-gray-600">Customer Rating</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom CTA Section */}
                    <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                        <div className="flex items-center justify-center mb-4">
                            <Heart className="w-6 h-6 text-gray-600 mr-2" />
                            <h2 className="text-2xl font-bold text-gray-900">Ready to Explore watchShop?</h2>
                        </div>
                        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                            Join thousands of satisfied customers who trust watchShop for their premium timepieces. 
                            Start your watch collection journey today!
                        </p>
                        <div className="flex items-center justify-center space-x-4">
                            <button 
                                onClick={() => window.location.href = '/menu'}
                                className="bg-gray-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200"
                            >
                                Browse Watches
                            </button>
                            <button 
                                onClick={() => window.location.href = '/register'}
                                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
                            >
                                Sign Up Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default About;
