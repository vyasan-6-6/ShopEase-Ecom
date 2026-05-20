import { useState } from "react";
import adminApi from "../../services/AdminService";
import { toast } from "react-toastify";
import { Printer, Download, Calendar, BarChart3, Package, DollarSign } from "lucide-react";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

const AdminReports = () => {
    const [startDate, setStartDate] = useState(() => {
        const d = new Date();
        d.setMonth(d.getMonth() - 1);
        return d.toISOString().split("T")[0];
    });
    const [endDate, setEndDate] = useState(() => {
        return new Date().toISOString().split("T")[0];
    });
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGenerateReport = async () => {
        if (!startDate || !endDate) {
            toast.error("Please select both start and end dates");
            return;
        }
        if (new Date(startDate) > new Date(endDate)) {
            toast.error("Start date cannot be after end date");
            return;
        }

        try {
            setLoading(true);
            const res = await adminApi.getSalesReport(startDate, endDate);
            setReportData(res.data);
            toast.success("Report generated successfully");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to generate report");
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = async () => {
        // Dynamically load html2pdf if not already present
        if (!window.html2pdf) {
            toast.info("Preparing PDF engine...");
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
            script.async = true;
            document.body.appendChild(script);
            
            await new Promise((resolve, reject) => {
                script.onload = resolve;
                script.onerror = reject;
            });
        }

        const element = document.getElementById("report-content");
        const opt = {
            margin:       0.5,
            filename:     `sales_report_${startDate}_to_${endDate}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        window.html2pdf().set(opt).from(element).save().then(() => {
            toast.success("PDF Downloaded successfully!");
        }).catch(err => {
            console.error("PDF generation failed", err);
            toast.error("Failed to generate PDF");
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header - Not printed */}
            <div className="print:hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <BarChart3 className="w-8 h-8 text-indigo-600" />
                        Business Insights
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium">
                        Generate and export sales reports.
                    </p>
                </div>
            </div>

            {/* Controls - Not printed */}
            <div className="print:hidden bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Start Date</label>
                    <Input 
                        type="date" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)} 
                        leftIcon={Calendar}
                    />
                </div>
                <div className="flex-1 w-full">
                    <label className="block text-sm font-bold text-gray-700 mb-2">End Date</label>
                    <Input 
                        type="date" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)}
                        leftIcon={Calendar} 
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button onClick={handleGenerateReport} loading={loading} className="flex-1 md:flex-none">
                        Generate
                    </Button>
                </div>
            </div>

            {/* Actions - Not printed */}
            {reportData && (
                <div className="print:hidden flex justify-end gap-3">
                    <Button variant="outline" onClick={handlePrint} className="gap-2">
                        <Printer className="w-4 h-4" /> Print
                    </Button>
                    <Button onClick={handleDownloadPDF} className="gap-2">
                        <Download className="w-4 h-4" /> Download PDF
                    </Button>
                </div>
            )}

            {/* Report Content */}
            {reportData ? (
                <div id="report-content" className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="text-center mb-8 pb-8 border-b border-gray-100">
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-widest">Sales Report</h2>
                        <p className="text-gray-500 mt-2 font-medium">
                            {new Date(startDate).toLocaleDateString()} — {new Date(endDate).toLocaleDateString()}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100/50">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                                    <DollarSign className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-1">Total Revenue</p>
                                    <p className="text-4xl font-black text-gray-900">${reportData.totalRevenue?.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100/50">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                                    <Package className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-1">Total Orders</p>
                                    <p className="text-4xl font-black text-gray-900">{reportData.totalOrders}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-gray-400" />
                            Most Sold Products
                        </h3>
                        {reportData.mostSoldProducts?.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/80">
                                            <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider rounded-l-xl">Product</th>
                                            <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Units Sold</th>
                                            <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-wider text-right rounded-r-xl">Revenue</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {reportData.mostSoldProducts.map((item, idx) => (
                                            <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                                            {item.images?.[0] ? (
                                                                <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <Package className="w-5 h-5 m-auto mt-2.5 text-gray-400" />
                                                            )}
                                                        </div>
                                                        <span className="font-bold text-gray-900">{item.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-medium text-gray-600">
                                                    {item.totalQuantitySold}
                                                </td>
                                                <td className="px-6 py-4 text-right font-black text-gray-900">
                                                    ${item.revenueGenerated?.toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                                <p className="text-gray-500 font-medium">No product sales found in this date range.</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="print:hidden bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
                    <BarChart3 className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Report Generated</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                        Select a date range and click generate to view business insights and export options.
                    </p>
                </div>
            )}
        </div>
    );
};

export default AdminReports;
