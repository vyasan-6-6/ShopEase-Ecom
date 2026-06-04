import  { useState, useRef, useEffect } from "react";
import { useAppSelector } from "../../redux/hooks";
import { selectUser, selectIsAuthenticated } from "../../redux/features/auth/authSelectors";
import orderApi from "../../services/OrderService";
import productApi from "../../services/ProductService";
import { confirmAction } from "../../utils/alerts";
import {
    MessageSquare,
    X,
    Send,
    Bot,
    User,
} from "lucide-react";

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: "welcome",
            text: "👋 Hello! I am your ShopEase Virtual Assistant. How can I help you today?",
            sender: "bot",
            timestamp: new Date(),
            type: "options",
            options: [
                { label: "📦 Track an Order", value: "track_order" },
                { label: "🛒 List My Orders", value: "list_orders" },
                { label: "✨ Recommended Products", value: "recommend_products" },
                { label: "❓ General FAQs", value: "faqs" }
            ]
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    
    const user = useAppSelector(selectUser);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const chatEndRef = useRef(null);//useref creates a object looks like {current : element} 

    // Auto-scroll to the bottom of the chat list
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isTyping]);

    // Handle initial personalized greeting if authenticated state changes
    useEffect(() => {
        if (isAuthenticated && user) {
            setMessages(prev => {
                // If we've already customized, don't repeat
                if (prev.some(m => m.id === "personalized-welcome")) return prev;//some is a function which checks if at least one element in array satisfies the condition
                return [
                    ...prev,
                    {
                        id: "personalized-welcome",
                        text: `✨ G'day ${user.name || 'User'}! I see you are logged in. I can quickly look up your account orders if you click "List My Orders" or provide an Order ID.`,
                        sender: "bot",
                        timestamp: new Date()
                    }
                ];
            });
        }
    }, [isAuthenticated, user]);

    // Simple reply helper
    const addBotMessage = (text, type = "text", extra = {}) => {
        setMessages(prev => [
            ...prev,
            {
                id: Date.now().toString(),
                text,
                sender: "bot",
                timestamp: new Date(),
                type,
                ...extra
            }
        ]);
    };

    // Main chatbot request handling logic
    const handleOrderLookup = async (orderId) => {
        setIsTyping(true);
        try {
            const response = await orderApi.getOrderStatusForChatbot(orderId);
            setIsTyping(false);
            
            if (response && response.success) {
                const order = response.data;
                const statusLabel = order.status.toUpperCase();
                
                let emoji = "⏳";
                if (statusLabel === "DELIVERED") emoji = "✅";
                else if (statusLabel === "SHIPPED") emoji = "🚚";
                else if (statusLabel === "CANCELLED") emoji = "❌";
                else if (statusLabel === "RETURNED") emoji = "↩️";

                const detailText = `📦 **Order Found!**\n\n` +
                    `• **Order ID**: \`${order.orderId}\`\n` +
                    `• **Status**: **${order.status}** ${emoji}\n` +
                    `• **Total Items**: ${order.itemCount} item(s)\n` +
                    `• **Total Amount**: ₹${parseFloat(order.totalAmount).toLocaleString('en-IN')}\n` +
                    `• **Payment**: ${order.paymentMethod} (${order.paymentStatus})\n` +
                    `• **Order Date**: ${new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}`;

                addBotMessage(detailText, "order_summary", { orderData: order });
            } else {
                addBotMessage(`❌ Sorry, I couldn't retrieve the details for order ID \`${orderId}\`. Please check the ID and try again.`);
            }
        } catch (error) {
            setIsTyping(false);
            const errMsg = error.message || "Something went wrong.";
            addBotMessage(`❌ **Error fetching status:** ${errMsg}\n\nPlease verify that the ID is a valid 24-character hexadecimal code.`);
        }
    };

    const handleCancelOrder = async (orderId) => {
        addBotMessage("Are you sure you want to cancel this order? This action cannot be undone.", "options", {
            options: [
                { label: "✅ Yes, Cancel Order", value: `confirm_cancel_${orderId}` },
                { label: "❌ No, Keep It", value: "abort_action" }
            ]
        });
    };

    const executeCancelOrder = async (orderId) => {
        setIsTyping(true);
        try {
            const response = await orderApi.cancelOrder(orderId);
            setIsTyping(false);
            if (response && response.success) {
                addBotMessage(`❌ **Order Cancelled Successfully!**\n\nYour order \`${orderId}\` has been cancelled. If you paid online, the refund has been credited to your Wallet.`);
                await handleOrderLookup(orderId);
            }
        } catch (error) {
            setIsTyping(false);
            addBotMessage(`❌ **Failed to cancel order:** ${error.message}`);
        }
    };

    const handleReturnOrder = async (orderId) => {
        addBotMessage("Are you sure you want to return this order? The refund will be processed to your wallet.", "options", {
            options: [
                { label: "✅ Yes, Return Order", value: `confirm_return_${orderId}` },
                { label: "❌ No, Keep It", value: "abort_action" }
            ]
        });
    };

    const executeReturnOrder = async (orderId) => {
        setIsTyping(true);
        try {
            const response = await orderApi.returnOrder(orderId);
            setIsTyping(false);
            if (response && response.success) {
                addBotMessage(`↩️ **Return Processed Successfully!**\n\nYour return for order \`${orderId}\` has been initiated. The refund has been credited directly to your Wallet.`);
                await handleOrderLookup(orderId);
            }
        } catch (error) {
            setIsTyping(false);
            addBotMessage(`❌ **Failed to process return:** ${error.message}`);
        }
    };

    const handleRecommendProducts = async () => {
        setIsTyping(true);
        try {
            const response = await productApi.getAllProducts({ limit: 3, sort: "price_desc" });
            setIsTyping(false);
            if (response && response.success && response.data.products?.length > 0) {
                addBotMessage("✨ **Top Recommended Products!**\nHere are some of our popular products chosen just for you. Click any product to view its details!", "product_list", {
                    products: response.data.products
                });
            } else {
                addBotMessage("Sorry, I couldn't fetch product recommendations at the moment. Please browse our Shop!");
            }
        } catch (error) {
            setIsTyping(false);
            addBotMessage(`❌ Failed to load recommendations: ${error.message}`);
        }
    };

    // Handle user inputs or options clicked
    const processMessage = async (text) => {
        const cleanedText = text.trim();
        if (!cleanedText) return;

        // Add user message to state
        setMessages(prev => [
            ...prev,
            {
                id: Date.now().toString(),
                text: cleanedText,
                sender: "user",
                timestamp: new Date()
            }
        ]);

        setIsTyping(true);

        // Simulate short conversational delay for premium look and feel
        setTimeout(async () => {
            // Regex to extract 24-character hex ID (MongoDB ObjectId)
            const mongoIdRegex = /[0-9a-fA-F]{24}/;
            const match = cleanedText.match(mongoIdRegex);

            if (match) {
                const orderId = match[0];
                setIsTyping(false);
                await handleOrderLookup(orderId);
            } else {
                setIsTyping(false);
                const lowerText = cleanedText.toLowerCase();

                if (lowerText.includes("hello") || lowerText.includes("hi") || lowerText.includes("hey")) {
                    addBotMessage("👋 Hello! Hope you are having a wonderful day! What can I assist you with?", "options", {
                        options: [
                            { label: "📦 Track an Order", value: "track_order" },
                            { label: "🛒 List My Orders", value: "list_orders" },
                            { label: "✨ Recommended Products", value: "recommend_products" },
                            { label: "❓ General FAQs", value: "faqs" }
                        ]
                    });
                } else if (lowerText.includes("track") || lowerText.includes("status") || lowerText.includes("order")) {
                    addBotMessage("To track your order, please provide your 24-character Order ID (e.g. `64b7f9a12a3b4c5d6e7f8g90`). If you are logged in, you can click \"List My Orders\" to see recent purchases.");
                } else if (lowerText.includes("list") || lowerText.includes("my orders")) {
                    await handleListOrdersOption();
                } else if (lowerText.includes("recommend") || lowerText.includes("product") || lowerText.includes("popular")) {
                    await handleRecommendProducts();
                } else if (lowerText.includes("faq") || lowerText.includes("help") || lowerText.includes("policy")) {
                    handleFaqOption();
                                } else {
                    try {
                        setIsTyping(true);
                        const response = await orderApi.askAI(cleanedText);
                        setIsTyping(false);
                        if (response && response.success && response.data?.reply) {
                            addBotMessage(response.data.reply);
                        } else {
                            throw new Error("Invalid response");
                        }
                    } catch (error) {
                        setIsTyping(false);
                        addBotMessage("I'm sorry, I didn't quite catch that. How can I help you? Choose one of these options or paste an Order ID:", "options", {
                            options: [
                                { label: "📦 Track an Order", value: "track_order" },
                                { label: "🛒 List My Orders", value: "list_orders" },
                                { label: "✨ Recommended Products", value: "recommend_products" },
                                { label: "❓ General FAQs", value: "faqs" }
                            ]
                        });
                    }
                }
            }
        }, 600);
    };

    const handleListOrdersOption = async () => {
        if (!isAuthenticated) {
            addBotMessage("🔒 **Authentication Required**\n\nYou must be logged in to view your orders automatically in the chatbot. Please log in to your account, or paste an Order ID directly here!", "text");
            return;
        }

        setIsTyping(true);
        try {
            const response = await orderApi.getMyOrders();
            setIsTyping(false);
            
            if (response && response.success && response.data.orders.length > 0) {
                const orders = response.data.orders.slice(0, 3); // Get 3 recent orders
                const buttons = orders.map(ord => ({
                    label: `📦 ID: ...${ord._id.slice(-6)} (₹${ord.totalAmount})`,
                    value: `order_select_${ord._id}`
                }));

                addBotMessage("🛍️ Here are your 3 most recent orders. Click one to instantly fetch its live tracking status!", "options", {
                    options: buttons
                });
            } else {
                addBotMessage("You don't have any orders placed yet! Once you shop, they will show up here.");
            }
        } catch (error) {
            setIsTyping(false);
            addBotMessage(`❌ Failed to load your orders: ${error.message}`);
        }
    };

    const handleFaqOption = () => {
        addBotMessage("📚 **ShopEase General FAQs**\nSelect a topic below to see answers immediately:", "options", {
            options: [
                { label: "🚚 Delivery Speed", value: "faq_delivery" },
                { label: "📦 Returns Policy", value: "faq_returns" },
                { label: "💳 Payments Options", value: "faq_payments" }
            ]
        });
    };

    // Handling clicked action buttons in the chat stream
    const handleOptionClick = async (option) => {
        const { label, value } = option;

        // Render user message representing their choice
        setMessages(prev => [
            ...prev,
            {
                id: Date.now().toString(),
                text: label,
                sender: "user",
                timestamp: new Date()
            }
        ]);

        setIsTyping(true);

        setTimeout(async () => {
            setIsTyping(false);
            
            if (value === "track_order") {
                addBotMessage("Please type or paste your **24-character hexadecimal Order ID** (e.g. `64b7f9a12a3b4c5d6e7f8g90`). The bot will instantly fetch the live status!");
            } else if (value === "list_orders") {
                await handleListOrdersOption();
            } else if (value === "recommend_products") {
                await handleRecommendProducts();
            } else if (value === "faqs") {
                handleFaqOption();
            } else if (value.startsWith("order_select_")) {
                const selectedOrderId = value.replace("order_select_", "");
                await handleOrderLookup(selectedOrderId);
            } else if (value.startsWith("confirm_cancel_")) {
                const selectedOrderId = value.replace("confirm_cancel_", "");
                await executeCancelOrder(selectedOrderId);
            } else if (value.startsWith("confirm_return_")) {
                const selectedOrderId = value.replace("confirm_return_", "");
                await executeReturnOrder(selectedOrderId);
            } else if (value === "abort_action") {
                addBotMessage("Okay, action cancelled. Let me know if you need anything else!");
            } else if (value === "faq_delivery") {
                addBotMessage("🚚 **Delivery Timelines:**\nStandard shipping takes 3-5 business days. Express shipping options are available at checkout and usually arrive within 1-2 business days.");
            } else if (value === "faq_returns") {
                addBotMessage("📦 **Simple 15-Day Returns:**\nIf you're not completely satisfied with your purchase, you can initiate a return within 15 days from your Profile -> Orders page. The refund will be credited directly to your Wallet or source account.");
            } else if (value === "faq_payments") {
                addBotMessage("💳 **Secure Payment Methods:**\nWe support Cash on Delivery (COD), UPI (GooglePay, PhonePe), Credit/Debit Cards, and Wallet payments. All transactions are securely processed via Razorpay.");
            }
        }, 500);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        processMessage(inputValue);
        setInputValue("");
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {/* Toggle Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer relative focus:outline-none`}
                aria-label="Toggle chatbot"
            >
                {isOpen ? (
                    <X className="w-6 h-6 transition-all duration-300 transform rotate-0" />
                ) : (
                    <>
                        <MessageSquare className="w-6 h-6 transition-all duration-300 transform scale-100" />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                    </>
                )}
            </button>

            {/* Chatbox Popup Window */}
            {isOpen && (
                <div 
                    className="absolute bottom-18 right-0 w-92 md:w-96 h-[520px] bg-white border border-gray-100 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ease-out origin-bottom-right"
                    style={{
                        animation: "fadeInUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards"
                    }}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-4 py-3.5 flex items-center justify-between shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm leading-tight text-white uppercase tracking-wider">ShopEase Assistant</h3>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                    <span className="text-[10px] text-white/80 font-medium lowercase">always active</span>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-full transition-all cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/70">
                        {messages.map((msg) => {
                            const isBot = msg.sender === "bot";
                            return (
                                <div key={msg.id} className={`flex items-start gap-2.5 ${isBot ? "" : "flex-row-reverse"}`}>
                                    {/* Icon Avatar */}
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm text-xs shrink-0 ${
                                        isBot ? "bg-indigo-50 border border-indigo-100 text-indigo-600" : "bg-purple-600 text-white"
                                    }`}>
                                        {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                    </div>

                                    {/* Message Capsule */}
                                    <div className="max-w-[75%] space-y-2">
                                        <div className={`rounded-2xl px-4 py-2.5 text-xs font-normal shadow-sm leading-relaxed whitespace-pre-line ${
                                            isBot 
                                                ? "bg-white text-gray-800 border border-gray-100 rounded-tl-none" 
                                                : "bg-indigo-600 text-white rounded-tr-none"
                                        }`}>
                                            {msg.text}
                                        </div>

                                        {/* Rich Order Summary Card */}
                                        {isBot && msg.type === "order_summary" && msg.orderData && (
                                            <div className="bg-white border border-gray-100 rounded-xl p-3.5 shadow-sm space-y-3 mt-1.5 animate-fadeIn">
                                                <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tracking Info</span>
                                                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold tracking-wider ${
                                                        msg.orderData.status === "Delivered" 
                                                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                                            : msg.orderData.status === "Shipped"
                                                            ? "bg-sky-50 text-sky-600 border border-sky-100"
                                                            : msg.orderData.status === "Cancelled" || msg.orderData.status === "Returned"
                                                            ? "bg-rose-50 text-rose-600 border border-rose-100"
                                                            : "bg-amber-50 text-amber-600 border border-amber-100"
                                                    }`}>
                                                        {msg.orderData.status}
                                                    </span>
                                                </div>

                                                {/* Visual Progress Steps */}
                                                {msg.orderData.status !== 'Cancelled' && msg.orderData.status !== 'Returned' && (() => {
                                                    const currentStatus = msg.orderData.status;
                                                    let activeStep = 0; // 0 = Placed/Processing, 1 = Shipped, 2 = Delivered

                                                    if (currentStatus === 'Shipped') activeStep = 1;
                                                    else if (currentStatus === 'Delivered') activeStep = 2;

                                                    return (
                                                        <div className="py-2.5 px-2 bg-gray-50/50 rounded-lg border border-gray-100/50 mt-1">
                                                            <div className="flex items-center justify-between relative">
                                                                {/* Background Bar */}
                                                                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-200 z-0"></div>
                                                                
                                                                {/* Active Progress Bar */}
                                                                <div 
                                                                    className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-emerald-500 transition-all duration-700 ease-out z-0"
                                                                    style={{ width: activeStep === 0 ? "0%" : activeStep === 1 ? "50%" : "100%" }}
                                                                ></div>

                                                                {/* Step 1: Placed */}
                                                                <div className="flex flex-col items-center z-10">
                                                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border transition-all duration-300 ${
                                                                        activeStep >= 0 
                                                                            ? "bg-emerald-500 border-emerald-500 text-white shadow-sm" 
                                                                            : "bg-white border-gray-300 text-gray-400"
                                                                    }`}>
                                                                        1
                                                                    </div>
                                                                    <span className="text-[9px] font-bold mt-1 text-gray-700 uppercase tracking-tight">Placed</span>
                                                                </div>

                                                                {/* Step 2: Shipped */}
                                                                <div className="flex flex-col items-center z-10">
                                                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border transition-all duration-300 ${
                                                                        activeStep >= 1 
                                                                            ? "bg-emerald-500 border-emerald-500 text-white shadow-sm" 
                                                                            : "bg-white border-gray-300 text-gray-400"
                                                                    }`}>
                                                                        2
                                                                    </div>
                                                                    <span className="text-[9px] font-bold mt-1 text-gray-700 uppercase tracking-tight">Shipped</span>
                                                                </div>

                                                                {/* Step 3: Delivered */}
                                                                <div className="flex flex-col items-center z-10">
                                                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border transition-all duration-300 ${
                                                                        activeStep >= 2 
                                                                            ? "bg-emerald-500 border-emerald-500 text-white shadow-sm" 
                                                                            : "bg-white border-gray-300 text-gray-400"
                                                                    }`}>
                                                                        3
                                                                    </div>
                                                                    <span className="text-[9px] font-bold mt-1 text-gray-700 uppercase tracking-tight">Delivered</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })()}

                                                <div className="space-y-2">
                                                    {msg.orderData.items.map((it, idx) => (
                                                        <div key={idx} className="flex items-center justify-between text-xs">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-gray-500 font-medium">{it.quantity}x</span>
                                                                <span className="text-gray-700 font-semibold truncate max-w-[130px]">{it.name}</span>
                                                            </div>
                                                            <span className="text-gray-600 font-bold">₹{parseFloat(it.price * it.quantity).toLocaleString('en-IN')}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {msg.orderData.isOwnerOrAdmin && msg.orderData.shippingAddress && (
                                                    <div className="border-t border-gray-50 pt-2 text-[10px] text-gray-500 leading-tight space-y-1">
                                                        <p className="font-bold text-gray-700 uppercase tracking-wider">Delivery Address:</p>
                                                        <p className="normal-case">{msg.orderData.shippingAddress.street}, {msg.orderData.shippingAddress.city}, {msg.orderData.shippingAddress.state} - {msg.orderData.shippingAddress.zipCode}</p>
                                                        <p className="font-semibold text-gray-600">Ph: {msg.orderData.shippingAddress.phone}</p>
                                                    </div>
                                                )}

                                                {msg.orderData.isOwnerOrAdmin && (
                                                    <div className="border-t border-gray-50 pt-2 flex flex-wrap gap-2 justify-end">
                                                        {['Pending', 'Processing'].includes(msg.orderData.status) && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleCancelOrder(msg.orderData.orderId)}
                                                                className="text-[9px] font-bold bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 px-2.5 py-1 rounded-md transition-all active:scale-95 cursor-pointer uppercase tracking-tight animate-fadeIn"
                                                            >
                                                                ❌ Cancel Order
                                                            </button>
                                                        )}
                                                        {msg.orderData.status === 'Delivered' && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleReturnOrder(msg.orderData.orderId)}
                                                                className="text-[9px] font-bold bg-amber-50 hover:bg-amber-100 border border-amber-100 text-amber-600 px-2.5 py-1 rounded-md transition-all active:scale-95 cursor-pointer uppercase tracking-tight animate-fadeIn"
                                                            >
                                                                ↩️ Return Order
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Rich Product Recommendation Cards */}
                                        {isBot && msg.type === "product_list" && msg.products && (
                                            <div className="grid grid-cols-1 gap-3.5 mt-2 animate-fadeIn w-full">
                                                {msg.products.map((prod) => (
                                                    <div key={prod._id} className="bg-white border border-gray-150 rounded-xl overflow-hidden shadow-sm flex hover:shadow-md transition-all duration-300">
                                                        {/* Product Image */}
                                                        <div className="w-20 h-20 shrink-0 bg-gray-50 flex items-center justify-center border-r border-gray-100 p-1.5">
                                                            <img 
                                                                src={prod.images?.[0] || "https://placehold.co/100"} 
                                                                alt={prod.name} 
                                                                className="max-h-full max-w-full object-contain rounded-md"
                                                            />
                                                        </div>
                                                        {/* Product Details */}
                                                        <div className="p-2.5 flex flex-col justify-between flex-grow min-w-0">
                                                            <div className="space-y-0.5">
                                                                <h4 className="text-[11px] font-bold text-gray-800 truncate leading-tight normal-case">{prod.name}</h4>
                                                                <p className="text-[9px] text-gray-500 line-clamp-1 leading-normal normal-case truncate">{prod.description || "Premium quality product at the best price."}</p>
                                                            </div>
                                                            <div className="flex items-center justify-between mt-1 pt-1 border-t border-gray-50">
                                                                <span className="text-[11px] font-extrabold text-indigo-600">₹{parseFloat(prod.price).toLocaleString('en-IN')}</span>
                                                                <a 
                                                                    href={`/product/${prod.id}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-[8px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1 rounded transition-all active:scale-95 text-center uppercase tracking-wide"
                                                                >
                                                                    View Product
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Clickable Quick Option Buttons */}
                                        {isBot && msg.type === "options" && msg.options && msg.options.length > 0 && (
                                            <div className="flex flex-wrap gap-2 pt-1">
                                                {msg.options.map((opt, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleOptionClick(opt)}
                                                        className="text-[11px] font-semibold bg-white hover:bg-indigo-50 border border-indigo-100 text-indigo-600 px-3.5 py-1.5 rounded-full hover:border-indigo-300 transition-all shadow-sm active:scale-95 cursor-pointer uppercase tracking-tight"
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        
                                        {/* Timestamp display */}
                                        <p className={`text-[9px] text-gray-400 font-medium ${!isBot && "text-right"}`}>
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Bot is typing state */}
                        {isTyping && (
                            <div className="flex items-start gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shadow-sm">
                                    <Bot className="w-4 h-4" />
                                </div>
                                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                            </div>
                        )}

                        <div ref={chatEndRef} />
                    </div>

                    {/* Footer Input form */}
                    <form onSubmit={handleSubmit} className="p-3.5 bg-white border-t border-gray-100 flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Type a message or paste Order ID..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4.5 py-2.5 text-xs focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all font-medium text-gray-700"
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim()}
                            className={`w-9.5 h-9.5 rounded-full bg-indigo-600 text-white flex items-center justify-center transition-all cursor-pointer shadow-md focus:outline-none ${
                                inputValue.trim() 
                                    ? "hover:bg-indigo-700 hover:scale-105 active:scale-95" 
                                    : "opacity-40 cursor-not-allowed"
                            }`}
                        >
                            <Send className="w-4 h-4 ml-0.5" />
                        </button>
                    </form>
                </div>
            )}

            {/* Custom Animation Styles Inline */}
            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(12px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.98); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default Chatbot;
