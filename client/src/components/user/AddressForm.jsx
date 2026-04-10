import { addAddress, editAddress } from "../../redux/features/auth/authSlice";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { addressSchema } from "../../utils/authSchema";
import { useAppDispatch } from "../../redux/hooks";
import Input from "../../components/common/Input";
import Button from "../common/Button";
import { Home, Briefcase, Tag, MapPin, Building2, Map, Hash, Globe, Check } from "lucide-react";
import clsx from "clsx";

const labelOptions = [
    { value: "home", label: "Home", icon: Home },
    { value: "work", label: "Work", icon: Briefcase },
    { value: "other", label: "Other", icon: Tag },
];

const AddressForm = ({ onCloseModal, addressToEdit = null }) => {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({ 
        defaultValues: addressToEdit || { label: "home", isDefault: false },
        resolver: yupResolver(addressSchema) 
    });
    
    // Safety sync: if addressToEdit changes remotely while modal is open, force a reset
    useEffect(() => {
        if (addressToEdit) {
            reset(addressToEdit);//this is used to reset the form with the new values of the address to edit
        } else {
            reset({ label: "home", isDefault: false });
        }
    }, [addressToEdit, reset]);

    const dispatch = useAppDispatch();
    const selectedLabel = watch("label");
    const isDefaultChecked = watch("isDefault");

    const onSubmit = async (data) => {
        if (addressToEdit) {
            await dispatch(editAddress({ addressId: addressToEdit.id, data }));
        } else {
            await dispatch(addAddress(data));
        }
        reset();
        onCloseModal();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Address Type Selector — Segmented Control */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gray-400" />
                    Address Type
                </label>
                <input type="hidden" {...register("label")} />
                <div className="flex gap-3">
                    {labelOptions.map((opt) => {
                        const isActive = selectedLabel === opt.value;
                        return (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => setValue("label", opt.value)}
                                className={clsx(
                                    "flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all border",
                                    isActive
                                        ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100"
                                        : "bg-white text-gray-500 border-gray-100 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <opt.icon className="w-4 h-4" />
                                {opt.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Street Address — Full Width */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    Street Address
                </label>
                <Input
                    name="street"
                    placeholder="123 Main St, Apt 4B"
                    {...register("street", { required: "Street is required" })}
                    error={errors.street?.message}
                />
            </div>

            {/* City + State Row */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        City
                    </label>
                    <Input
                        name="city"
                        placeholder="New York"
                        {...register("city", { required: "City is required" })}
                        error={errors.city?.message}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
                        <Map className="w-4 h-4 text-gray-400" />
                        State
                    </label>
                    <Input
                        name="state"
                        placeholder="NY"
                        {...register("state", { required: "State is required" })}
                        error={errors.state?.message}
                    />
                </div>
            </div>

            {/* Zip + Country Row */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
                        <Hash className="w-4 h-4 text-gray-400" />
                        Zip Code
                    </label>
                    <Input
                        name="zipCode"
                        placeholder="10001"
                        {...register("zipCode", { required: "Zip Code is required" })}
                        error={errors.zipCode?.message}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        Country
                    </label>
                    <Input
                        name="country"
                        placeholder="United States"
                        {...register("country", { required: "Country is required" })}
                        error={errors.country?.message}
                    />
                </div>
            </div>

            {/* Default Address Checkbox */}
            <label htmlFor="isDefault" className={clsx(
                "flex items-center gap-3 px-4 py-4 rounded-2xl cursor-pointer select-none group transition-all border",
                isDefaultChecked 
                    ? "bg-indigo-50/50 border-indigo-200" 
                    : "bg-gray-50/80 border-gray-100 hover:bg-indigo-50/30"
            )}>
                <input
                    type="checkbox"
                    id="isDefault"
                    className="hidden"
                    {...register("isDefault")}
                />
                <div className={clsx(
                    "w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center shrink-0",
                    isDefaultChecked 
                        ? "border-indigo-600 bg-indigo-600" 
                        : "border-gray-200 bg-white"
                )}>
                    <Check className={clsx(
                        "w-4 h-4 text-white transition-all",
                        isDefaultChecked ? "opacity-100 scale-100" : "opacity-0 scale-75"
                    )} />
                </div>
                <div>
                    <p className="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors">Default shipping address</p>
                    <p className="text-xs text-gray-400">This address will be pre-selected at checkout</p>
                </div>
            </label>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCloseModal}
                    className="flex-1 py-3.5 rounded-2xl font-bold text-sm"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    loading={isSubmitting}
                    className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100 active:scale-95 transition-all"
                >
                    Save Address
                </Button>
            </div>
        </form>
    );
};

export default AddressForm;
