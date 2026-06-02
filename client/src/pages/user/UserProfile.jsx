import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../redux/hooks";
import { selectUser } from "../../redux/features/auth/authSelectors";
import { selectWalletBalance } from "../../redux/features/wallet/walletSelectors";
import { fetchWallet } from "../../redux/features/wallet/walletSlice";
import { useForm } from "react-hook-form";
import { updateProfile, uploadAvatar } from "../../redux/features/auth/authSlice";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { Camera, User, Mail, Phone, Wallet } from "lucide-react";
import clsx from "clsx";
import { toast } from "react-toastify"; 
import { yupResolver } from "@hookform/resolvers/yup";
import { profileSchema } from "../../utils/authSchema";

const UserProfile = () => {
    const dispatch = useAppDispatch();
    const user = useSelector(selectUser);
    const walletBalance = useSelector(selectWalletBalance);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        dispatch(fetchWallet());
    }, [dispatch]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty, isSubmitting },
    } = useForm({ 
        resolver: yupResolver(profileSchema),
        defaultValues: { 
            email: user?.email, 
            name: user?.name,
            phone: user?.phone || ""
        } 
    });

    const onSubmit = async (data,e) => {
       if(e) e.preventDefault();
        const result = await dispatch(updateProfile({name:data.name,phone:data.phone}));
        console.log("result",result);
        console.log("result.payload",result.payload);
        if (updateProfile.fulfilled.match(result)) {
            toast.success("Profile updated successfully!");
            // Reset the form with the newly saved values so it is no longer 'dirty'
            reset(data);
            setIsEditing(false); // Turn off edit mode
        } else {
            toast.error(result.payload || "Failed to update profile");
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size > 2 * 1024 * 1024) {
            alert("File too large. Maximum size is 2MB.");
            return;
        }
        if (file && file.type.startsWith("image/")) {
            const formData = new FormData();
            formData.append("avatar", file);
            dispatch(uploadAvatar(formData));
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-[2.5rem] p-6 md:p-12 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row items-center gap-8 mb-12 pb-10 border-b border-gray-50">
                    <div className="relative group">
                        <div className="w-32 h-32 bg-indigo-50 text-indigo-600 rounded-[2.5rem] flex items-center justify-center text-4xl font-black overflow-hidden ring-4 ring-white shadow-xl transition-transform duration-500 group-hover:scale-105">
                            {user?.avatar ? (
                                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                user?.name?.charAt(0).toUpperCase() || <User className="w-12 h-12" />
                            )}
                        </div>
                        <label className="absolute bottom-1 right-1 bg-black text-white p-2.5 rounded-2xl cursor-pointer shadow-lg hover:scale-110 active:scale-90 transition-all border-2 border-white">
                            <Camera className="w-5 h-5" />
                            <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                        </label>
                    </div>
                    
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Personal Details</h2>
                        <p className="text-gray-500 font-medium mt-1">Manage your account information and avatar</p>
                    </div>

                    <div className="ml-auto bg-green-50 px-6 py-4 rounded-2xl border border-green-100 flex flex-col items-end shadow-sm">
                        <div className="flex items-center gap-2 text-green-700 font-bold text-sm mb-1">
                            <Wallet className="w-4 h-4" />
                            Wallet Balance
                        </div>
                        <div className="text-2xl font-black text-green-900">₹{walletBalance.toFixed(2)}</div>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-400" />
                                Email Address
                            </label>
                            <Input
                                name="email"
                                disabled={true}
                                value={user?.email}
                                className="w-full px-5 py-4 rounded-2xl border border-gray-100 text-sm text-gray-400 bg-gray-50/50 cursor-not-allowed font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-400" />
                                Full Name
                            </label>
                            <Input
                                name="name"
                                {...register("name")}
                                disabled={!isEditing}
                                placeholder="Your full name"
                                error={errors.name?.message}
                                className={clsx(
                                    "w-full px-5 py-4 rounded-2xl transition-colors font-medium",
                                    isEditing ? "bg-white border-gray-100 hover:border-indigo-200" : "bg-gray-50/50 border-transparent text-gray-500 cursor-not-allowed"
                                )}
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-400" />
                                Phone Number
                            </label>
                            <Input
                                name="phone"
                                disabled={!isEditing}
                                {...register("phone")}
                                placeholder="Your phone number"
                                error={errors?.phone?.message}
                                className={clsx(
                                    "w-full px-5 py-4 rounded-2xl transition-colors font-medium",
                                    isEditing ? "bg-white border-gray-100 hover:border-indigo-200" : "bg-gray-50/50 border-transparent text-gray-500 cursor-not-allowed"
                                )}
                            />
                        </div>
                    </div>

                    <div className="pt-8 flex justify-end gap-4">
                        {isEditing && (
                            <Button 
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    reset();
                                    setIsEditing(false);
                                }}
                                className="px-8 py-4 rounded-2xl font-bold"
                            >
                                Cancel
                            </Button>
                        )}
                        <Button 
                            type={isEditing ? "submit" : "button"}
                            onClick={!isEditing ? (e) => { e.preventDefault(); setIsEditing(true); } : undefined}
                            disabled={isSubmitting || (isEditing && !isDirty)} // If editing and not dirty, disable button
                            loading={isSubmitting}
                            className={clsx(
                                "px-10 py-4 rounded-2xl font-bold transition-all shadow-xl active:scale-95",
                                isEditing 
                                    ? (isDirty ? "bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700" : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none")
                                    : "bg-gray-900 text-white shadow-gray-200 hover:bg-black"
                            )}
                        >
                            {isEditing ? "Save Profile" : "Edit Profile"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserProfile;
