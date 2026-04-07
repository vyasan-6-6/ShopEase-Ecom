import { useSelector } from "react-redux";
import { useAppDispatch } from "../../redux/hooks";
import { selectUser } from "../../redux/features/auth/authSelectors";
import { useForm } from "react-hook-form";
import { updateProfile } from "../../redux/features/auth/authSlice";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const UserProfile = () => {
    const dispatch = useAppDispatch();
    const user = useSelector(selectUser);

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
    } = useForm({ defaultValues: { email: user?.email, name: user?.name } });

    const onSubmit = (data) => {
        dispatch(updateProfile(data));
    };
    return ( 

        <div className="max-w-2xl mx-auto p-8 border border-gray-100 rounded-3xl bg-white shadow-sm mt-10">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold ">
                    J
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
                    <p className="text-gray-500 text-sm">Update your personal information</p>
                </div>
            </div>
             <form onSubmit={handleSubmit(onSubmit)}>
                <Input label="Email Address" name="email" disabled={true} value={user?.email}  className={`w-full px-4 py-2 rounded-2xl border text-sm textgray400] bg-gray-50 cursor-not-allowed`} />
                <Input
                    label="Full Name"
                    name="name"
                    {...register("name", {
                        required: "Name is required",
                        minLength: { value: 2, message: "Name must be at least 2 characters" },
                    })} 
                    error={errors.name?.message}
                   
                />
                <Input
                    label="Phone Number"
                    name="phone"
                    {...register("phone", {
                         pattern: {
                            value: /^\+?[\d\s\-\(\)]+$/,
                            message: "Please enter a valid phone number"
                        }
                    })} 
                    error={errors?.phone?.message}
                />
                <div className="pt-4 flex justify-end">
                    <Button disabled={!isDirty} >Save Changes</Button>
                </div>
            </form>
        </div>
    );
};

export default UserProfile;
