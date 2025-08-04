import axios from 'axios';
import { Trash, ShoppingCart, ArrowRight, Plus, Minus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Footer from '../common/customer/Footer';
import Layout from '../common/customer/layout';
 
const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userId = localStorage.getItem("userId");
    const navigate = useNavigate();

    useEffect(() => {
        if (userId) {
            axios.get(`http://localhost:3000/api/v1/cart/${userId}`)
                .then(response => {
                    setCartItems(response.data.items);
                    setLoading(false);
                })
                .catch(err => {
                    setError("Error fetching cart data.");
                    setLoading(false);
                });
        } else {
            setError("No user ID found.");
            setLoading(false);
        }
    }, [userId]);

    const handleProceedToCheckout = async () => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        navigate("/checkout");

        if (!userId) {
            console.error("Error: No user ID found in local storage.");
            return;
        }

        try {
            await axios.delete(`http://localhost:3000/api/v1/cart/clear/${userId}`);
            setCartItems([]);
        } catch (error) {
            console.error("Error clearing cart:", error);
        }
    };

    const handleQuantityChange = async (id, type) => {
        setCartItems(prevItems => {
            const updatedItems = prevItems.map(item =>
                item.itemId._id === id
                    ? { ...item, quantity: type === "increase" ? item.quantity + 1 : Math.max(1, item.quantity - 1) }
                    : item
            );
            
            const itemToUpdate = updatedItems.find(item => item.itemId._id === id);

            axios.put(`http://localhost:3000/api/v1/cart/update`, {
                customerId: userId,
                itemId: id,
                quantity: itemToUpdate.quantity
            })
                .then(response => {
                    console.log("Cart updated successfully", response.data);
                })
                .catch(error => {
                    console.error("Error updating cart:", error);
                });

            return updatedItems;
        });
    };

    const handleRemoveItem = async (itemId) => {
        const customerId = localStorage.getItem("userId");

        if (!customerId) {
            setError("No user ID found.");
            return;
        }

        try {
            const response = await axios.delete(`http://localhost:3000/api/v1/cart/remove/${itemId}`, {
                params: { customerId },
            });

            console.log(response.data);
            toast.success("Item removed from cart successfully.");
            setCartItems((prevItems) => prevItems.filter(item => item.itemId._id !== itemId));

        } catch (error) {
            console.error("Error removing item from cart:", error.response ? error.response.data : error.message);
            setError("Error removing item from cart.");
        }
    };

    // Calculate total prices
    const subtotal = cartItems.reduce((total, item) => total + Number(item.itemId.price) * item.quantity, 0);
    const deliveryCharge = subtotal > 0 ? 5.00 : 0;
    const totalPrice = (subtotal + deliveryCharge).toFixed(2);

    return (
        <>
            <Layout />
            <div className="bg-gray-50 min-h-screen">
                {/* Header Section */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="text-center">
                            <div className="flex items-center justify-center mb-4">
                                <ShoppingCart className="w-8 h-8 text-gray-600 mr-3" />
                                <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                            </div>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Review your items and proceed to checkout
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Loading State */}
                    {loading && (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-gray-600"></div>
                            <span className="ml-3 text-gray-600 text-sm">Loading your cart...</span>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="text-center py-12">
                            <div className="text-red-400 text-4xl mb-3">⚠️</div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Error loading cart</h3>
                            <p className="text-gray-600 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Cart Content */}
                    {!loading && !error && (
                        <>
                            {cartItems.length > 0 ? (
                                <div className="flex flex-col lg:flex-row gap-8">
                                    {/* Cart Items */}
                                    <div className="lg:w-2/3">
                                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Cart Items ({cartItems.length})</h2>
                                            
                                            <div className="space-y-4">
                                                {cartItems.map((item) => (
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

                                                        {/* Quantity Controls */}
                                                        <div className="flex items-center space-x-2">
                                                            <button
                                                                className="bg-gray-100 text-gray-600 p-1 rounded-md hover:bg-gray-200 transition-colors duration-200"
                                                                onClick={() => handleQuantityChange(item.itemId._id, "decrease")}
                                                            >
                                                                <Minus className="w-4 h-4" />
                                                            </button>
                                                            <span className="w-8 text-center text-sm font-medium text-black">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                className="bg-gray-100 text-gray-600 p-1 rounded-md hover:bg-gray-200 transition-colors duration-200"
                                                                onClick={() => handleQuantityChange(item.itemId._id, "increase")}
                                                            >
                                                                <Plus className="w-4 h-4" />
                                                            </button>
                                                        </div>

                                                        {/* Subtotal */}
                                                        <div className="text-sm font-medium text-gray-900">
                                                            Rs {(Number(item.itemId.price) * item.quantity).toFixed(2)}
                                                        </div>

                                                        {/* Remove Button */}
                                                        <button
                                                            className="text-red-500 hover:text-red-700 transition-colors duration-200"
                                                            onClick={() => handleRemoveItem(item.itemId._id)}
                                                            title="Remove item"
                                                        >
                                                            <Trash className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Summary */}
                                    <div className="lg:w-1/3">
                                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                                            <h2 className="text-lg font-semibold text-black mb-4">Order Summary</h2>
                                            
                                            <div className="space-y-3 mb-6">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-black">Subtotal</span>
                                                    <span className="font-medium text-black">Rs {subtotal.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-black">Delivery Charge</span>
                                                    <span className="font-medium text-black">Rs {deliveryCharge.toFixed(2)}</span>
                                                </div>
                                                <div className="border-t border-gray-200 pt-3">
                                                    <div className="flex justify-between">
                                                        <span className="font-semibold text-black">Total</span>
                                                        <span className="font-semibold text-black">Rs {totalPrice}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <button 
                                                className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                                                onClick={handleProceedToCheckout}
                                            >
                                                <span>Proceed to Checkout</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <div className="text-gray-400 text-6xl mb-4">🛒</div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h3>
                                    <p className="text-gray-600 mb-6">
                                        Add some delicious items to your cart to get started
                                    </p>
                                    <div className="flex items-center justify-center space-x-4">
                                        <button
                                            onClick={() => window.location.href = '/'}
                                            className="bg-gray-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200"
                                        >
                                            Browse Menu
                                        </button>
                                        <button
                                            onClick={() => window.location.href = '/menu'}
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

export default Cart;
