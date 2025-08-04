
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from "../../../context/AuthContext";

const checkWishlist = async (itemId, customerId, token, csrfToken) => {
    try {
        const response = await axios.get(`http://localhost:3000/api/v1/wishlist/check/${itemId}`, {
            params: { customerId },
            headers: {
                Authorization: `Bearer ${token}`,
                'X-CSRF-Token': csrfToken
            },
            withCredentials: true
        });
        return response.data.isWishlisted;
    } catch (error) {
        console.error('ItemCard.jsx: Error checking wishlist:', error.response?.data || error.message);
        return false;
    }
};

const ItemCard = ({ item, customerId, showWishlist = true }) => {
    const navigate = useNavigate();
    const { csrfToken, fetchCsrfToken } = useAuth();
    const [quantity, setQuantity] = useState(1);
    const [isCsrfLoading, setIsCsrfLoading] = useState(false);

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

    const { data: isWishlisted, isLoading: isWishlistLoading } = useQuery({
        queryKey: ['WISHLIST_CHECK', item._id, customerId],
        queryFn: async () => {
            const token = sessionStorage.getItem('token');
            console.log('ItemCard.jsx: JWT Token for wishlist check:', token);
            if (!token || !customerId) {
                return false;
            }
            return checkWishlist(item._id, customerId, token, csrfToken);
        },
        enabled: !!customerId && !!csrfToken && showWishlist,
        onError: (error) => {
            if (error.response?.status === 401) {
                toast.error('Session expired. Please log in again.', { autoClose: 4000 });
                setTimeout(() => navigate('/login'), 4000);
            }
        }
    });

    const toggleWishlistMutation = useMutation({
        mutationFn: async () => {
            const token = sessionStorage.getItem('token');
            const userId = sessionStorage.getItem('userId');
            console.log('ItemCard.jsx: JWT Token for wishlist toggle:', token);
            if (!token || !userId) {
                throw new Error('No authentication token or user ID found');
            }
            if (isWishlisted) {
                return axios.delete(`http://localhost:3000/api/v1/wishlist/remove/${item._id}`, {
                    params: { customerId: userId },
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'X-CSRF-Token': csrfToken
                    },
                    withCredentials: true
                });
            } else {
                return axios.post(`http://localhost:3000/api/v1/wishlist/add`, { customerId: userId, itemId: item._id }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'X-CSRF-Token': csrfToken
                    },
                    withCredentials: true
                });
            }
        },
        onSuccess: () => {
            toast.success(isWishlisted ? 'Removed from wishlist.' : 'Added to wishlist.', { autoClose: 4000 });
        },
        onError: (error) => {
            console.error('ItemCard.jsx: Error toggling wishlist:', error.response?.data || error.message);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please log in again.', { autoClose: 4000 });
                setTimeout(() => navigate('/login'), 4000);
            } else {
                toast.error(error.response?.data?.message || 'Failed to update wishlist.');
            }
        }
    });

    const addToCartMutation = useMutation({
        mutationFn: async () => {
            const token = sessionStorage.getItem('token');
            const userId = sessionStorage.getItem('userId');
            console.log('ItemCard.jsx: JWT Token for add to cart:', token);
            if (!token || !userId) {
                throw new Error('No authentication token or user ID found');
            }
            return axios.post(`http://localhost:3000/api/v1/cart/add`, {
                customerId: userId,
                itemId: item._id,
                quantity
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'X-CSRF-Token': csrfToken
                },
                withCredentials: true
            });
        },
        onSuccess: () => {
            toast.success('Item added to cart successfully.', { autoClose: 4000 });
        },
        onError: (error) => {
            console.error('ItemCard.jsx: Error adding to cart:', error.response?.data || error.message);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please log in again.', { autoClose: 4000 });
                setTimeout(() => navigate('/login'), 4000);
            } else {
                toast.error(error.response?.data?.message || 'Failed to add item to cart.');
            }
        }
    });

    const toggleWishlist = () => {
        if (!csrfToken) {
            toast.error('CSRF token not loaded. Please refresh the page.');
            return;
        }
        toggleWishlistMutation.mutate();
    };

    const addToCart = () => {
        if (!csrfToken) {
            toast.error('CSRF token not loaded. Please refresh the page.');
            return;
        }
        addToCartMutation.mutate();
    };

    const handleQuantityChange = (type) => {
        setQuantity((prev) => (type === 'increase' ? prev + 1 : Math.max(1, prev - 1)));
    };

    return (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <ToastContainer theme="light" position="top-right" autoClose={4000} />
            
            {/* Image Section */}
            <div className="relative">
                <img
                    src={`http://localhost:3000/uploads/${item.image}`}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                    onClick={() => navigate(`/item/details/${item._id}`)}
                />
                
                {/* Price Badge */}
                <div className="absolute top-3 right-3 bg-white text-gray-800 px-2 py-1 rounded font-semibold text-sm shadow">
                    Rs {item.price}
                </div>
            </div>
            
            {/* Content Section */}
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 cursor-pointer" 
                    onClick={() => navigate(`/item/details/${item._id}`)}>
                    {item.name}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4">
                    {item.description || 'Quality watch with excellent craftsmanship.'}
                </p>
                
                {/* Quantity and Add to Cart */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center bg-gray-50 rounded p-1">
                        <button
                            className="bg-gray-200 text-gray-700 p-1 rounded hover:bg-gray-300"
                            onClick={() => handleQuantityChange('decrease')}
                        >
                            -
                        </button>
                        <span className="w-10 h-7 flex items-center justify-center text-center text-gray-800 font-medium text-sm">
                            {quantity}
                        </span>
                        <button
                            className="bg-gray-200 text-gray-700 p-1 rounded hover:bg-gray-300"
                            onClick={() => handleQuantityChange('increase')}
                        >
                            +
                        </button>
                    </div>
                    
                    <button
                        className="bg-gray-800 text-white px-4 py-2 rounded font-medium hover:bg-gray-700"
                        onClick={addToCart}
                        disabled={addToCartMutation.isLoading || isCsrfLoading}
                    >
                        {addToCartMutation.isLoading ? 'Adding...' : 'Add to Cart'}
                    </button>
                </div>
                
                {/* Wishlist Button - Only show if showWishlist prop is true */}
                {showWishlist && (
                    <div className="mt-3">
                        <button
                            className={`w-full py-2 px-4 rounded font-medium ${
                                isWishlisted 
                                    ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                            onClick={toggleWishlist}
                            disabled={isWishlistLoading || isCsrfLoading}
                        >
                            {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ItemCard;
