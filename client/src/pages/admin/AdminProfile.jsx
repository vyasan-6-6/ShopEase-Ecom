import { useForm } from "react-hook-form";
import { selectAdminUser } from "../../redux/features/admin/adminSelector";
import { useAppSelector } from "../../redux/hooks";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const AdminProfile = () => {
    const admin = useAppSelector(selectAdminUser);

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
    } = useForm({
        defaultValues: {
            name: admin?.name,
            email: admin?.email,
        },
    });

    const onSubmit = (data) => {
        // You can dispatch an updateThunk here later if you want Admins to be able to change their names
        console.log("Saving Admin Profile:", data);
    };

    return (
        <div className="max-w-3xl mx-auto p-8 bg-white border border-gray-100 rounded-3xl shadow-sm">
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
                {/* admin avatar  */}
                <div className="w-20 h-20 bg-black text-white rounded-2xl flex items-center justify-center text-4xl shadow-inner">
                    🛡️
                </div>
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Admin Profile</h2>
                    <p className="text-gray-500 font-medium tracking-wide">Manage your security credentials</p>
                </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Admin Display Name"
                        name="name"
                        {...register("name", { required: "Name is required" })}
                        error={errors.name?.message}
                        className="font-bold"
                    />{" "}
                    {/* Email is disabled because changing an admin email is a huge security risk! */}
                    <Input
                        label="Security Email (Unchangeable)"
                        name="email"
                        disabled={true}
                        {...register("email")}
                        className="bg-gray-50 text-gray-400 cursor-not-allowed"
                    />
                </div>
                <div className="p-4 mt-2 bg-purple-50 border border-purple-100 rounded-2xl">
                    <h3 className="text-purple-900 font-medium mb-1">Access Level</h3>
                    <p className="text-purple-700 text-sm">You are currently logged in with 
                    <strong> Administrator </strong> privileges. You have full access to manage products and users.</p>
                </div>

                <div className="pt-4 flex justify-end ">
                    <Button type='submit' disabled={!isDirty}>Update Credentials</Button>
                </div>
            </form>
        </div>
    );
};

export default AdminProfile;
