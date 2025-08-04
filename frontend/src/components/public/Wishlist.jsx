import axios from "axios";
import { ShoppingCart, Trash, Heart, ArrowRight, Plus, Minus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Footer from '../common/customer/Footer';
import Layout from '../common/customer/layout';

const API_BASE_URL = "http://localhost:3000/api/v1/wishlist";

const Wishlist = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [customerId, setCustomerId] = useState(null);
    const navigate = useNavigate();

    // Fetch userId from localStorage on component mount
    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
            setCustomerId(storedUserId);
            fetchWishlist(storedUserId);
        } else {
            setError("No user ID found.");
            setLoading(false);
        }
    }, []);

    // Fetch Wishlist Items from API
    const fetchWishlist = async (id) => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/customer/${id}`);
            setWishlistItems(response.data.wishlist.map(item => ({
                ...item,
                itemId: { ...item.itemId, price: Number(item.itemId.price) }
            })));
            setLoading(false);
        } catch (error) {
            console.error("Error fetching wishlist:", error);
            setError("Error fetching wishlist data.");
            setLoading(false);
        }
    };

    const handleRemoveItem = async (itemId) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/remove/${itemId}`, { params: { customerId } });
            console.log(response.data);
            toast.success("Item removed from wishlist successfully.");
            setWishlistItems((prevItems) => prevItems.filter(item => item._id !== itemId));
        } catch (error) {
            console.error("Error removing item:", error);
            setError("Error removing item from wishlist.");
        }
    };

    // Handle Move Item to Cart
    const handleMoveToCart = async (item) => {
        try {
            // Add item to cart
            const cartResponse = await axios.post('http://localhost:3000/api/v1/cart/add', {
                customerId: customerId,
                itemId: item.itemId._id,
                quantity: 1
            });
            
            if (cartResponse.status === 200) {
                toast.success("Item moved to cart successfully.");
                // Remove item from wishlist after moving it to cart
                await handleRemoveItem(item._id);
            }
        } catch (error) {
            console.error("Error moving to cart:", error);
            toast.error("Error moving item to cart.");
        }
    };

    // Handle quantity change for cart items
    const handleQuantityChange = async (item, type) => {
        try {
            const newQuantity = type === "increase" ? 1 : 1; // Wishlist items default to 1
            const response = await axios.put('http://localhost:3000/api/v1/cart/update', {
                customerId: customerId,
                itemId: item.itemId._id,
                quantity: newQuantity
            });
            
            if (response.status === 200) {
                toast.success("Cart updated successfully.");
            }
        } catch (error) {
            console.error("Error updating cart:", error);
            toast.error("Error updating cart.");
        }
    };

    // Calculate total prices (for display purposes)
    const totalItems = wishlistItems.length;
    const totalValue = wishlistItems.reduce((total, item) => total + Number(item.itemId.price), 0);

    return (
        <>
            <Layout />
            <div className="bg-gray-50 min-h-screen">
                {/* Header Section */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="text-center">
                            <div className="flex items-center justify-center mb-4">
                                <Heart className="w-8 h-8 text-gray-600 mr-3" />
                                <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
                            </div>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Save your favorite items and keep track of what you love
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Loading State */}
                    {loading && (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-gray-600"></div>
                            <span className="ml-3 text-gray-600 text-sm">Loading your wishlist...</span>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="text-center py-12">
                            <div className="text-red-400 text-4xl mb-3">⚠️</div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Error loading wishlist</h3>
                            <p className="text-gray-600 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Wishlist Content */}
                    {!loading && !error && (
                        <>
                            {wishlistItems.length > 0 ? (
                                <div className="flex flex-col lg:flex-row gap-8">
                                    {/* Wishlist Items */}
                                    <div className="lg:w-2/3">
                                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Wishlist Items ({wishlistItems.length})</h2>
                                            
                                            <div className="space-y-4">
                                                {wishlistItems.map((item) => (
                                                    <div key={`${item.itemId._id}-${item._id}`} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                                                        {/* Item Image */}
                                                        <div className="flex-shrink-0">
                                                            <img
                                                                src={item.itemId.image ? `http://localhost:3000/uploads/${item.itemId.image}` : undefined}
                                                                alt={item.itemId.name}
                                                                className="w-16 h-16 object-cover rounded-lg"
                                                            />
                                                        </div>

                                                        {/* Item Details */}
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-sm font-medium text-gray-900 truncate">
                                                                {item.itemId.name}
                                                            </h3>
                                                            <p className="text-sm text-gray-500">
                                                                Rs {item.itemId.price}
                                                            </p>
                                                        </div>

                                                        {/* Move to Cart Button */}
                                                        <button
                                                            className="bg-gray-100 text-gray-600 p-2 rounded-md hover:bg-gray-200 transition-colors duration-200"
                                                            onClick={() => handleMoveToCart(item)}
                                                            title="Move to Cart"
                                                        >
                                                            <ShoppingCart className="w-4 h-4" />
                                                        </button>

                                                        {/* Remove Button */}
                                                        <button
                                                            className="text-red-500 hover:text-red-700 transition-colors duration-200"
                                                            onClick={() => handleRemoveItem(item._id)}
                                                            title="Remove from wishlist"
                                                        >
                                                            <Trash className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Wishlist Summary */}
                                    <div className="lg:w-1/3">
                                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                                            <h2 className="text-lg font-semibold text-black mb-4">Wishlist Summary</h2>
                                            
                                            <div className="space-y-3 mb-6">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-black">Total Items</span>
                                                    <span className="font-medium text-black">{totalItems}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-black">Total Value</span>
                                                    <span className="font-medium text-black">Rs {totalValue.toFixed(2)}</span>
                                                </div>
                                            </div>

                                            <button 
                                                className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                                                onClick={() => navigate('/cart')}
                                            >
                                                <span>View Cart</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </button>

                                            <button 
                                                className="w-full mt-3 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                                                onClick={() => navigate('/menu')}
                                            >
                                                <span>Continue Shopping</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <div className="text-gray-400 text-6xl mb-4">💝</div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Your wishlist is empty</h3>
                                    <p className="text-gray-600 mb-6">
                                        Start adding items to your wishlist to save them for later
                                    </p>
                                    <div className="flex items-center justify-center space-x-4">
                                        <button
                                            onClick={() => navigate('/')}
                                            className="bg-gray-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200"
                                        >
                                            Browse Menu
                                        </button>
                                        <button
                                            onClick={() => navigate('/menu')}
                                            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
                                        >
                                            View All Items
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            <Footer />
            <ToastContainer />
        </>
    );
};

export default Wishlist;
