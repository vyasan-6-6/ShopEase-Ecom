import { useEffect, useState } from 'react';
import adminApi from '../../services/AdminService';
import { toast } from 'react-toastify';

import { 
    Users, 
    ShoppingBag, 
    IndianRupee,
    Package, 
    TrendingUp, 
    ArrowUpRight, 
    ArrowDownRight,
    Clock
} from 'lucide-react';
import { memo } from 'react';

const AdminOverview = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [statsData, setStatsData] = useState({
        totalRevenue: { value: "₹0.00", change: null },
        totalOrders: { value: "0", change: null },
        totalUsers: { value: "0", change: null },
        totalProducts: { value: "0", change: null }
    });
    const [recentActivities, setRecentActivities] = useState([]);
    const [daysFilter, setDaysFilter] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setIsLoading(true);
                const res = await adminApi.getDashboardStats(daysFilter);
                if (res.success) {
                    setStatsData(res.data.stats);
                    setRecentActivities(res.data.recentActivities);
                }
            } catch (error) {
                toast.error("Failed to load dashboard statistics");
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, [daysFilter]);

    const handleDownloadReport = async () => {
        setIsDownloading(true);
        try {
            // Get date range (last 30 days)
            const endDate = new Date().toISOString();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 30);
            
            const res = await adminApi.getSalesReport(startDate.toISOString(), endDate);
            
            if (res.success && res.data) {
                const { totalRevenue, totalOrders, mostSoldProducts } = res.data;
                
                // Construct CSV
                let csvContent = "data:text/csv;charset=utf-8,";
                csvContent += "=== ShopEase 30-Day Sales Summary ===\n\n";
                csvContent += `Total Revenue,${totalRevenue}\n`;
                csvContent += `Total Orders,${totalOrders}\n\n`;
                csvContent += "--- Top 5 Best Selling Products ---\n";
                csvContent += "Product Name,Quantity Sold,Revenue Generated\n";
                
                mostSoldProducts.forEach(prod => {
                    const cleanName = prod.name.replace(/,/g, ''); // Remove commas to prevent CSV breakage
                    csvContent += `${cleanName},${prod.totalQuantitySold},${prod.revenueGenerated}\n`;
                });

                // Trigger Download
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "shopease_30day_report.csv");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                toast.success("Report downloaded successfully!");
            }
        } catch (error) {
            toast.error("Failed to generate report");
        } finally {
            setIsDownloading(false);
        }
    };

    const stats = [
        {
            title: "Total Revenue",
            value: statsData.totalRevenue?.value || "₹0.00",
            change: statsData.totalRevenue?.change,
            icon: IndianRupee,
            color: "text-emerald-500",
            bg: "bg-emerald-50"
        }, 
        {
            title: "Total Orders",
            value: statsData.totalOrders?.value || "0",
            change: statsData.totalOrders?.change,
            icon: ShoppingBag,
            color: "text-indigo-500",
            bg: "bg-indigo-50"
        },
        {
            title: "Active Users",
            value: statsData.totalUsers?.value || "0",
            change: statsData.totalUsers?.change,
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-50"
        },
        {
            title: "Total Products",
            value: statsData.totalProducts?.value || "0",
            change: statsData.totalProducts?.change,
            icon: Package,
            color: "text-amber-500",
            bg: "bg-amber-50"
        }
    ];

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <span className="w-10 h-10 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500 font-medium">Loading Overview...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Overview</h1>
                    <p className="text-gray-500 mt-1 font-medium">Welcome back, Admin. Here's what's happening today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setDaysFilter(daysFilter === 30 ? null : 30)}
                        className={`px-4 py-2 border rounded-xl font-bold transition-all flex items-center gap-2 shadow-sm ${
                            daysFilter === 30 
                            ? 'bg-gray-100 border-gray-300 text-gray-900' 
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <Clock className="w-4 h-4" /> Last 30 Days
                    </button>
                    <button 
                        onClick={handleDownloadReport}
                        disabled={isDownloading}
                        className={`px-4 py-2 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-black/10 flex items-center gap-2 ${isDownloading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        <TrendingUp className="w-4 h-4" /> 
                        {isDownloading ? 'Generating...' : 'Download Report'}
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div 
                        key={index} 
                        className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            {stat.change && (
                                <span className={`text-sm font-bold flex items-center gap-1 ${stat.change.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {stat.change.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                    {stat.change.value}
                                </span>
                            )}
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">{stat.title}</p>
                            <h3 className="text-2xl font-black text-gray-900 mt-1">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activities */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                        <h2 className="text-xl font-black text-gray-900">Recent Activity</h2>
                        <button className="text-indigo-600 text-sm font-bold hover:underline">
                            {/* View All */}
                            </button>
                    </div>
                    <div className="p-0">
                        {recentActivities.map((activity, idx) => (
                            <div 
                                key={activity.id} 
                                className={`flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors ${idx !== recentActivities.length - 1 ? 'border-b border-gray-50' : ''}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-400">
                                        {activity.user.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">
                                            {activity.user} <span className="font-medium text-gray-500">{activity.action}</span>
                                        </p>
                                        <p className="text-xs text-gray-400 font-medium">{activity.time}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    {activity.amount && (
                                        <p className="text-sm font-black text-gray-900">{activity.amount}</p>
                                    )}
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                                        activity.status === 'Success' ? 'bg-emerald-50 text-emerald-600' : 
                                        activity.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                                    }`}>
                                        {activity.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Shortcuts / Placeholder for Chart */}
                <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-2xl font-black mb-2">Grow Your Sales</h2>
                        <p className="text-indigo-100 font-medium">Use our new analytics tool to track your store performance in real-time.</p>
                        <button className="mt-6 px-6 py-3 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-all shadow-lg">
                            Upgrade Now
                        </button>
                    </div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-indigo-400/20 rounded-full blur-3xl"></div>
                    
                    <div className="mt-8 pt-8 border-t border-indigo-500/30 relative z-10">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-200 mb-4">Today's Tip</p>
                        <p className="text-sm font-medium italic">"Personalized recommendations can increase conversion rates by up to 30%."</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(AdminOverview);
