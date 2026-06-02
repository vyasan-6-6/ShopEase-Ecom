
import { 
    Users, 
    ShoppingBag, 
    DollarSign, 
    Package, 
    TrendingUp, 
    ArrowUpRight, 
    ArrowDownRight,
    Clock
} from 'lucide-react';
import { memo } from 'react';

const AdminOverview = () => {
    const stats = [
        {
            title: "Total Revenue",
            value: "₹128,430.00",
            change: "+12.5%",
            isPositive: true,
            icon: DollarSign,
            color: "text-emerald-500",
            bg: "bg-emerald-50"
        }, 
        {
            title: "Total Orders",
            value: "1,240",
            change: "+8.2%",
            isPositive: true,
            icon: ShoppingBag,
            color: "text-indigo-500",
            bg: "bg-indigo-50"
        },
        {
            title: "Active Users",
            value: "8,201",
            change: "+15.3%",
            isPositive: true,
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-50"
        },
        {
            title: "Total Products",
            value: "450",
            change: "-2.4%",
            isPositive: false,
            icon: Package,
            color: "text-amber-500",
            bg: "bg-amber-50"
        }
    ];

    // Dummy Data for Recent Activities
    const recentActivities = [
        { id: 1, user: "John Doe", action: "placed an order", time: "2 minutes ago", amount: "₹150.00", status: "Success" },
        { id: 2, user: "Sarah Smith", action: "created a new account", time: "15 minutes ago", amount: null, status: "Success" },
        { id: 3, user: "Mike Johnson", action: "updated product inventory", time: "1 hour ago", amount: null, status: "Update" },
        { id: 4, user: "Emma Wilson", action: "requested a refund", time: "3 hours ago", amount: "₹45.00", status: "Pending" },
        { id: 5, user: "Robert Brown", action: "purchased 'Pro Headphones'", time: "5 hours ago", amount: "₹299.00", status: "Success" }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Overview</h1>
                    <p className="text-gray-500 mt-1 font-medium">Welcome back, Admin. Here's what's happening today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm">
                        <Clock className="w-4 h-4" /> Last 30 Days
                    </button>
                    <button className="px-4 py-2 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-black/10 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" /> Download Report
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
                            <div className={`flex items-center gap-1 text-sm font-bold ${stat.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {stat.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                {stat.change}
                            </div>
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
                        <button className="text-indigo-600 text-sm font-bold hover:underline">View All</button>
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
