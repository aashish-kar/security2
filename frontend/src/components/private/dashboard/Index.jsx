
import { Card } from "@/components/common/ui/card";
import axios from "axios";
import { DollarSign, LayoutDashboard, List, ShoppingBag, User } from 'lucide-react';
import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:3000/api/v1";

const Dashboard = () => {
    const [users, setUsers] = useState(0);
    const [orders, setOrders] = useState(0);
    const [items, setItems] = useState(0);
    const [revenue, setRevenue] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await axios.get(`${API_BASE_URL}/auth/getAllCustomers`);
                setUsers(userResponse.data.count || 0);

                const orderResponse = await axios.get(`${API_BASE_URL}/order/orders`);
                setOrders(orderResponse.data.length);

                const totalRevenue = orderResponse.data
                    ? orderResponse.data.reduce((sum, order) => sum + (order.totalPrice || 0), 0)
                    : 0;
                setRevenue(totalRevenue);

                const itemResponse = await axios.get(`${API_BASE_URL}/item/getItems`);
                setItems(itemResponse.data.count || 0);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="p-3 space-y-4 bg-gray-100 min-h-screen">
            <div className="flex items-center gap-2 text-xl font-bold text-[#00bf63]">
                <LayoutDashboard size={28} className="text-[#00bf63]" />
                Dashboard
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4 flex items-center gap-4 bg-green-50 shadow-md hover:bg-green-100 transition">
                    <User size={32} className="text-[#00bf63]" />
                    <div>
                        <h2 className="text-lg font-semibold text-[#00bf63]">Users</h2>
                        <p className="text-xl font-bold text-gray-800">{users}</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4 bg-green-50 shadow-md hover:bg-green-100 transition">
                    <ShoppingBag size={32} className="text-[#00bf63]" />
                    <div>
                        <h2 className="text-lg font-semibold text-[#00bf63]">Orders</h2>
                        <p className="text-xl font-bold text-gray-800">{orders}</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4 bg-green-50 shadow-md hover:bg-green-100 transition">
                    <DollarSign size={32} className="text-[#00bf63]" />
                    <div>
                        <h2 className="text-lg font-semibold text-[#00bf63]">Revenue</h2>
                        <p className="text-xl font-bold text-gray-800">Rs {revenue}</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4 bg-green-50 shadow-md hover:bg-green-100 transition">
                    <List size={32} className="text-[#00bf63]" />
                    <div>
                        <h2 className="text-lg font-semibold text-[#00bf63]">Menu Items</h2>
                        <p className="text-xl font-bold text-gray-800">{items}</p>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 shadow-md bg-green-50 hover:bg-green-100 transition">
                    <h2 className="text-lg font-semibold mb-4 text-[#00bf63]">Top Selling Foods</h2>
                    <ul className="list-disc ml-4 text-gray-800">
                        <li>Burger - 120 orders</li>
                        <li>Pizza - 95 orders</li>
                        <li>Pasta - 80 orders</li>
                        <li>Sushi - 75 orders</li>
                    </ul>
                </Card>
                <Card className="p-4 shadow-md bg-green-50 hover:bg-green-100 transition">
                    <h2 className="text-lg font-semibold mb-4 text-[#00bf63]">Top Category</h2>
                    <ul className="list-disc ml-4 text-gray-800">
                        <li>Grilled Chicken - 4.9/5</li>
                        <li>Vegan Salad - 4.8/5</li>
                        <li>Margherita Pizza - 4.7/5</li>
                        <li>Cheeseburger - 4.6/5</li>
                    </ul>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;