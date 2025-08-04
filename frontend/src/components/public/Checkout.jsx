import KhaltiCheckout from "khalti-checkout-web";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { CreditCard, Truck, ArrowRight, User, Mail, Phone, MapPin, Building, Hash } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../common/customer/Footer";
import Layout from "../common/customer/layout";
 
const Checkout = () => {
    const userId = localStorage.getItem("userId");
    const navigate = useNavigate();
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    if (!cartItems || cartItems.length === 0) {
        return (
            <>
                <Layout />
                <div className="bg-gray-50 min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-gray-400 text-6xl mb-4">🛒</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No items in cart</h3>
                        <p className="text-gray-600 mb-6">Please add some items to your cart before checkout</p>
                        <button
                            onClick={() => navigate('/cart')}
                            className="bg-gray-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200"
                        >
                            Go to Cart
                        </button>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    const subtotal = cartItems.reduce((total, item) => total + Number(item.itemId.price) * item.quantity, 0);
    const deliveryCharge = subtotal > 0 ? 5.00 : 0;
    const totalPrice = (subtotal + deliveryCharge).toFixed(2);

    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [billingDetails, setBillingDetails] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        zipCode: "",
    });

    const handleInputChange = (e) => {
        setBillingDetails({ ...billingDetails, [e.target.name]: e.target.value });
    };

    const handlePaymentChange = (method) => {
        setPaymentMethod(method);
    }

    const khaltiConfig = {
        publicKey: "test_public_key_617c4c6fe77c441d88451ec1408a0c0e",
        productIdentity: "1234567890",
        productName: "Order Payment",
        productUrl: "http://localhost:3000",
        eventHandler: {
            onSuccess(payload) {
                console.log("Payment Successful:", payload);

                fetch("http://localhost:3000/api/khalti/verify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token: payload.token, amount: totalPrice }),
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.message === "Payment verified successfully") {
                            toast.success("Payment successful!");
                            const orderData = {
                                userId,
                                cartItems: cartItems.map(item => ({
                                    itemId: item.itemId,
                                    price: item.itemId.price,
                                    quantity: item.quantity,
                                })),
                                billingDetails,
                                paymentMethod: "khalti",
                                subtotal,
                                deliveryCharge,
                                totalPrice,
                                status: "pending",
                            };

                            fetch("http://localhost:3000/api/v1/order/orders", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(orderData),
                            })
                                .then((res) => {
                                    if (res.ok) {
                                        return res.json();
                                    } else {
                                        throw new Error("Server responded with an error");
                                    }
                                })
                                .then((data) => {
                                    localStorage.removeItem("cartItems");
                                    toast.success("Order placed successfully!", {
                                        position: "top-right",
                                        autoClose: 5000,
                                    });

                                    setTimeout(() => {
                                        navigate("/checkout/success");
                                    }, 5000);
                                })
                                .catch((error) => {
                                    console.error("Error:", error);
                                    toast.error("Error placing order. Please try again.", {
                                        position: "top-right",
                                        autoClose: 5000,
                                    });
                                });
                        } else {
                            toast.error("Payment verification failed!");
                        }
                    })
                    .catch((err) => console.error("Error verifying payment:", err));
            },
            onError(error) {
                console.error("Payment Error:", error);
                toast.error("Khalti Payment Failed!");
            },
        },
    };

    const handleOrderSubmit = async () => {
        if (totalPrice > 200.0) {
            toast.error("Amount exceeds the limit of Rs 200. Please reduce the total price.");
            return;
        }

        if (paymentMethod === "khalti") {
            const khalti = new KhaltiCheckout(khaltiConfig);
            khalti.show({ amount: totalPrice * 100 });
            return;
        }
        const orderData = {
            userId,
            cartItems: cartItems.map(item => ({
                itemId: item.itemId,
                price: item.itemId.price,
                quantity: item.quantity,
            })),
            billingDetails,
            paymentMethod,
            subtotal,
            deliveryCharge,
            totalPrice,
            status: "pending",
        };

        try {
            const response = await fetch("http://localhost:3000/api/v1/order/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.removeItem("cartItems");
                toast.success("Order placed successfully!", {
                    position: "top-right",
                    autoClose: 5000,
                });

                setTimeout(() => {
                    navigate("/checkout/success");
                }, 5000);
            } else {
                toast.error("Error placing order. Please try again.", {
                    position: "top-right",
                    autoClose: 5000,
                });
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Network error. Please try again.", {
                position: "top-right",
                autoClose: 5000,
            });
        }
    };

    return (
        <>
            <Layout />
            <div className="bg-gray-50 min-h-screen">
                {/* Header Section */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Complete your order with secure payment and delivery
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left Column - Billing & Payment */}
                        <div className="lg:w-2/3 space-y-6">
                            {/* Billing Details */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center mb-6">
                                    <User className="w-5 h-5 text-gray-600 mr-2" />
                                    <h2 className="text-lg font-semibold text-gray-900">Billing Details</h2>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                        <input 
                                            type="text" 
                                            name="fullName" 
                                            placeholder="Enter your full name" 
                                            value={billingDetails.fullName} 
                                            onChange={handleInputChange} 
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-colors duration-200" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                        <input 
                                            type="email" 
                                            name="email" 
                                            placeholder="Enter your email" 
                                            value={billingDetails.email} 
                                            onChange={handleInputChange} 
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-colors duration-200" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                        <input 
                                            type="text" 
                                            name="phone" 
                                            placeholder="Enter your phone number" 
                                            value={billingDetails.phone} 
                                            onChange={handleInputChange} 
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-colors duration-200" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                        <input 
                                            type="text" 
                                            name="city" 
                                            placeholder="Enter your city" 
                                            value={billingDetails.city} 
                                            onChange={handleInputChange} 
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-colors duration-200" 
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                                        <input 
                                            type="text" 
                                            name="address" 
                                            placeholder="Enter your street address" 
                                            value={billingDetails.address} 
                                            onChange={handleInputChange} 
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-colors duration-200" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                                        <input 
                                            type="text" 
                                            name="zipCode" 
                                            placeholder="Enter zip code" 
                                            value={billingDetails.zipCode} 
                                            onChange={handleInputChange} 
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-colors duration-200" 
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center mb-6">
                                    <CreditCard className="w-5 h-5 text-gray-600 mr-2" />
                                    <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
                                </div>
                                
                                <div className="space-y-3">
                                    <label 
                                        className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                                            paymentMethod === "khalti" 
                                                ? "border-gray-400 bg-gray-50" 
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}
                                        onClick={() => handlePaymentChange("khalti")}
                                    >
                                        <input 
                                            type="radio" 
                                            name="paymentMethod" 
                                            value="khalti" 
                                            checked={paymentMethod === "khalti"} 
                                            onChange={() => handlePaymentChange("khalti")} 
                                            className="hidden" 
                                        />
                                        <div className="flex items-center justify-center w-5 h-5 border-2 border-gray-400 rounded-full mr-3">
                                            {paymentMethod === "khalti" && (
                                                <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900">Online Payment (Khalti)</div>
                                            <div className="text-sm text-gray-500">Fast and secure online payment</div>
                                        </div>
                                    </label>

                                    <label 
                                        className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                                            paymentMethod === "cod" 
                                                ? "border-gray-400 bg-gray-50" 
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}
                                        onClick={() => handlePaymentChange("cod")}
                                    >
                                        <input 
                                            type="radio" 
                                            name="paymentMethod" 
                                            value="cod" 
                                            checked={paymentMethod === "cod"} 
                                            onChange={() => handlePaymentChange("cod")} 
                                            className="hidden" 
                                        />
                                        <div className="flex items-center justify-center w-5 h-5 border-2 border-gray-400 rounded-full mr-3">
                                            {paymentMethod === "cod" && (
                                                <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900">Cash on Delivery</div>
                                            <div className="text-sm text-gray-500">Pay in cash when your order is delivered</div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className="lg:w-1/3">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                                
                                {/* Order Items */}
                                <div className="space-y-3 mb-6">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                            <img 
                                                src={item.itemId.image ? `http://localhost:3000/uploads/${item.itemId.image}` : undefined} 
                                                alt={item.itemId.name}
                                                className="w-12 h-12 rounded-lg object-cover" 
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-gray-900 truncate">
                                                    {item.itemId.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Qty: {item.quantity}
                                                </div>
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">
                                                Rs {(item.itemId.price * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Price Breakdown */}
                                <div className="space-y-3 border-t border-gray-200 pt-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium">Rs {subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Delivery Charge</span>
                                        <span className="font-medium">Rs {deliveryCharge.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-3">
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-gray-900">Total</span>
                                            <span className="font-semibold text-gray-900">Rs {totalPrice}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Place Order Button */}
                                <button 
                                    onClick={handleOrderSubmit} 
                                    className="w-full mt-6 bg-gray-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                                >
                                    <span>{paymentMethod === "khalti" ? "Pay Now" : "Place Order"}</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            <ToastContainer />
        </>
    );
};

export default Checkout; 