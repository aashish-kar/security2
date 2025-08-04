import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Layout from "../common/customer/layout";
import Hero from "../common/customer/Hero";
import ItemCard from "../common/customer/ItemCard";
import { useAuth } from "../../context/AuthContext";
 
const fetchItems = async (token, csrfToken) => {
    try {
        const response = await axios.get('http://localhost:3000/api/v1/item/items-by-tags', {
            headers: {
                ...(token && { Authorization: `Bearer ${token}` }),
                ...(csrfToken && { 'X-CSRF-Token': csrfToken })
            },
            withCredentials: true
        });
        console.log('Home.jsx: fetchItems response:', response.status, response.data);
        return response.data;
    } catch (error) {
        console.error('Home.jsx: Error fetching items:', error.response?.data || error.message);
        throw error;
    }
};

const Home = () => {
    const navigate = useNavigate();
    const { csrfToken, fetchCsrfToken } = useAuth();
    const [isCsrfLoading, setIsCsrfLoading] = useState(false);
    const customerId = sessionStorage.getItem("userId");

    useEffect(() => {
        const initializeCsrf = async () => {
            if (!csrfToken) {
                setIsCsrfLoading(true);
                await fetchCsrfToken();
                setIsCsrfLoading(false);
            }
        };
        initializeCsrf();
    }, [csrfToken, fetchCsrfToken]);

    const { data, isLoading, error } = useQuery({
        queryKey: ['ITEMS_BY_TAGS'],
        queryFn: async () => {
            const token = sessionStorage.getItem('token');
            console.log('Home.jsx: JWT Token:', token);
            // Allow guests: fetch without token if not present
            return fetchItems(token, csrfToken);
        },
        enabled: !!csrfToken,
        select: (data) => data || undefined,
        onError: (error) => {
            if (error.response?.status === 401) {
                toast.error('Session expired. Please log in again.', { autoClose: 4000 });
                setTimeout(() => navigate('/login'), 4000);
            } else {
                toast.error(error.response?.data?.message || 'Failed to load items.', { autoClose: 4000 });
            }
        }
    });

    const featuredItems = data?.Featured ?? [];
    const trendingItems = data?.Trending ?? [];
    const bestSellerItems = data?.Popular ?? [];
    const specialItems = data?.Special ?? [];

    if (isLoading || isCsrfLoading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="text-xl font-semibold text-gray-800 mb-2">Loading...</div>
                <p className="text-gray-600">Please wait while we load the items</p>
            </div>
        </div>
    );
    
    if (error) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-8 bg-white rounded-lg shadow border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h2>
                <p className="text-gray-600 mb-6">We couldn't load the items right now. Please try again later.</p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
                >
                    Try Again
                </button>
            </div>
        </div>
    );

    return (
        <>
            <Layout />
            <Hero />
            <div className="bg-gray-50 min-h-screen">
                <ToastContainer theme="light" position="top-right" autoClose={4000} />
                
                {/* Featured Items Section */}
                <section className="py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Featured Watches
                            </h2>
                            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                                Discover our most popular and premium timepieces
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {featuredItems.length > 0 ? (
                                featuredItems.map((item) => (
                                    <div key={item._id || item.name}>
                                        <ItemCard item={item} customerId={customerId} showWishlist={false} />
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-16">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">No Featured Watches</h3>
                                    <p className="text-gray-600 mb-6">Check back soon for new premium timepieces!</p>
                                    <button 
                                        onClick={() => navigate('/menu')}
                                        className="bg-gray-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700"
                                    >
                                        Browse Collection
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Trending Items Section */}
                <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Trending Now
                            </h2>
                            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                                What's hot right now! These timepieces are popular
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {trendingItems.length > 0 ? (
                                trendingItems.map((item) => (
                                    <div key={item._id || item.name}>
                                        <ItemCard item={item} customerId={customerId} showWishlist={false} />
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-16">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">No Trending Watches</h3>
                                    <p className="text-gray-600 mb-6">Discover what's hot in our collection!</p>
                                    <button 
                                        onClick={() => navigate('/menu')}
                                        className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700"
                                    >
                                        Explore Trending
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Best Seller Items Section */}
                <section className="py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Best Sellers
                            </h2>
                            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                                Our most loved timepieces that customers can't get enough of
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {bestSellerItems.length > 0 ? (
                                bestSellerItems.map((item) => (
                                    <div key={item._id || item.name}>
                                        <ItemCard item={item} customerId={customerId} showWishlist={false} />
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-16">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">No Best Sellers</h3>
                                    <p className="text-gray-600 mb-6">Our most loved timepieces will appear here!</p>
                                    <button 
                                        onClick={() => navigate('/menu')}
                                        className="bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-700"
                                    >
                                        View Collection
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Special Items Section */}
                <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                watchShop Special
                            </h2>
                            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                                Exclusive deals and special timepieces just for you
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {specialItems.length > 0 ? (
                                specialItems.map((item) => (
                                    <div key={item._id || item.name}>
                                        <ItemCard item={item} customerId={customerId} showWishlist={false} />
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-16">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">No Special Watches</h3>
                                    <p className="text-gray-600 mb-6">Special offers and deals coming soon!</p>
                                    <button 
                                        onClick={() => navigate('/menu')}
                                        className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700"
                                    >
                                        Check Specials
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Call to Action Section */}
                <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            Ready to Find Your Perfect Timepiece?
                        </h2>
                        <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                            Explore our complete collection of luxury watches and find the perfect one that matches your style.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button 
                                onClick={() => navigate('/menu')}
                                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-blue-700"
                            >
                                Browse Collection
                            </button>
                            <button 
                                onClick={() => navigate('/about')}
                                className="border-2 border-white text-white px-8 py-4 rounded-lg font-medium hover:bg-white hover:text-gray-900"
                            >
                                Learn More
                            </button>
                        </div>
                    </div>
                </section>
            </div>
            {/* Footer component was removed from imports, so it's removed from here */}
        </>
    );
};

export default Home;
