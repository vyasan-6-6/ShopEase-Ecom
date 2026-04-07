import { addAddress } from "../../redux/features/auth/authSlice";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "../../redux/hooks";
import Input from "../../components/common/Input";
import Button from "../common/Button";

const AddressForm = ({ onCloseModal }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({ defaultValues: { label: "home" } });
    const dispatch = useAppDispatch();
    const onSubmit = async (data) => {
        await dispatch(addAddress(data)); // We use await here to make sure the API call finishes before we close the modal!
        reset();
        onCloseModal();
    };
    return (
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
            <div className="pt-2">
                <Button type="submit">Save Address</Button>
            </div>
        </form>
    );
};

export default AddressForm;
