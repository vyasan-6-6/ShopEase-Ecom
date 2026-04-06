import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectUser } from "../../redux/features/auth/authSelectors";
import { addAddress } from "../../redux/features/auth/authSlice";
import Input from "../../components/ui/Input";

const AddressBook = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({ defaultValues: { label: "home" } });

    const onSubmit = (data) => {
        dispatch(addAddress(data));
        reset();
    };
    return (
        <div className="max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/2">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Saved Addressess</h3>
            <div className="grid gap-4">
                    {user?.addresses?.map((addr, index) => (
                        <div
                            key={index}
                            className={`p-5 border-2 rounded-2xl transition-all ${index === 0 ? "border-black bg-gray-50" : "border-gray-100 bg-white hover:border-gray-300"}`}
                        >
                            <div className="flex justify-between items-center mb-3">
                                <span className="font-bold uppercase tracking-wider text-xs px-3 py-1 bg-gray-200 rounded-full text-gray-700">
                                    {index === 0 ? "Home" : "Work"}
                                </span>
                                {index === 0 && (
                                    <span className="text-black font-extrabold text-xs  tracking-wider">★ DEFAULT</span>
                                )}
                            </div>
                            <p className="text-gray-800 font-medium">{addr.country}</p>
                            <p className="text-gray-500 text-sm mt-1">{addr.street} , {addr.zipCode}</p>
                            <p className="text-gray-500 text-sm">{addr.country}</p>
                            {index !== 0 && (
                                <button className="text-sm font-semibold text-gray-600 mt-4 hover:text-black transition">
                                    Set as Default
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>







            <div className="w-full md:w-1/2 p-8 border border-gray-100 rounded-3xl bg-white shadow-sm h-fit">
                <h3 className="text-xl font-bold mb-6 text-gray-800">Add New Address</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1 w-full">
                        <label className="text-sm font-medium text-gray-700">Address Label</label>
                        <select
                            {...register("label")}
                            className="w-full px-4 py-3 rounded-2xl border border-gray-300 text-sm outline-none transition focus:ring-2 focus:ring-black appearance-none bg-white"
                        >
                            <option value={`home`}>Home</option>
                            <option value={`work`}>Work</option>
                            <option value={`other`}>Other</option>
                        </select>
                    </div>

                    <Input
                        label="Street Address"
                        name="street"
                        placeholder="123 Main St, Apt 4B"
                        {...register("street", { required: "Street is required" })}
                        error={errors.street?.message}
                    />

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Input
                                label="City"
                                name="city"
                                placeholder="New York"
                                {...register("city", { required: "City is required" })}
                                error={errors.city?.message}
                            />
                        </div>
                        <div className="flex-1">
                            <Input
                                label="State"
                                name="state"
                                placeholder="NY"
                                {...register("state", { required: "State is required" })}
                                error={errors.state?.message}
                            />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Input
                                label="Zip Code"
                                name="zipCode"
                                placeholder="10001"
                                {...register("zipCode", { required: "Zip Code is required" })}
                                error={errors.zipCode?.message}
                            />
                        </div>
                        <div className="flex-1">
                            <Input
                                label="Country"
                                name="country"
                                placeholder="United States"
                                {...register("country", { required: "Country is required" })}
                                error={errors.country?.message}
                            />
                        </div>
                    </div>
                        <div className="flex items-center gap-3 mt-3 px-1">
                            <input
                            type="checkbox"
                            id="isDefault"
                            className="w-4 h-4 accent-black cursor-pointer rounded"
                            {...register("isDefault")}
                            />
                            <label htmlFor="isDefault" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                                Make this my default shipping address
                            </label>
                        </div>
                        <div className="pt-2"><button type="submit">Save Address</button></div>
                </form>
            </div>
        </div>
    );
};
export default AddressBook;
