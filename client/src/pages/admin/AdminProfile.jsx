import { useForm } from "react-hook-form"; 
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { selectUser, selectAuthLoading } from "../../redux/features/auth/authSelectors";
import { updateAdminProfile } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

const AdminProfile = () => {
    const dispatch = useAppDispatch();
    const admin = useAppSelector(selectUser);
    const isLoading = useAppSelector(selectAuthLoading);

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
    } = useForm({
        defaultValues: {
            name: admin?.name || "",
            email: admin?.email || "",
        },
    });

    const onSubmit = async (data) => {
        try {
            await dispatch(updateAdminProfile({ name: data.name })).unwrap();
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error(error || "Failed to update profile");
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-8 bg-white border border-gray-100 rounded-3xl shadow-sm animate-in fade-in duration-500">
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
                <div className="w-20 h-20 bg-black text-white rounded-2xl flex items-center justify-center text-4xl shadow-inner group">
                    <span className="group-hover:scale-110 transition-transform cursor-default">🛡️</span>
                </div>
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight italic">
                        {admin?.name || "Admin"} <span className="text-gray-400 font-normal">Details</span>
                    </h2>
                    <p className="text-gray-500 font-medium tracking-wide">Manage your security credentials</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Admin Display Name"
                        name="name"
                        {...register("name", { 
                            required: "Name is required",
                            minLength: { value: 3, message: "Name must be at least 3 characters" }
                        })}
                        error={errors.name?.message}
                        className="font-bold text-gray-800"
                        placeholder="Enter your name"
                    />
                    
                    <Input
                        label="Security Email (Read-Only)"
                        name="email"
                        disabled={true}
                        {...register("email")}
                        className="bg-gray-50 text-gray-400 cursor-not-allowed opacity-75 font-medium"
                    />
                </div>

                <div className="p-5 mt-2 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex items-start gap-4">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-indigo-900 font-black text-xs uppercase tracking-widest mb-1">Privileged Access</h3>
                        <p className="text-indigo-700/80 text-sm leading-relaxed">
                            You are logged in with <strong className="text-indigo-900">Full Administrative</strong> control. 
                            Settings like email and roles are managed via secure system configs.
                        </p>
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <Button 
                        type="submit" 
                        disabled={!isDirty || isLoading}
                        loading={isLoading}
                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100 disabled:bg-gray-200"
                    >
                        {isLoading ? "Saving Changes..." : "Update Display Name"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AdminProfile;
