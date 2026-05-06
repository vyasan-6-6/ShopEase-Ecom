 
import Button from "../common/Button";
import { setDefaultAddress, deleteAddress } from "../../redux/features/auth/authSlice";
import { useAppDispatch } from "../../redux/hooks";
import { confirmDelete } from "../../utils/alerts";

const AddressCard = ({ address, onEdit }) => {
const dispatch = useAppDispatch();
const handleSetDefault = () => {
    dispatch(setDefaultAddress(address.id));
};
const handleDelete = async () => {
    const confirmed = await confirmDelete("Delete Address?", "Are you sure you want to remove this address?");
    if(!confirmed) return;
    dispatch(deleteAddress(address.id)); 
};
    return (
        <div className="border border-gray-200 rounded-xl   p-5 bg-white shadow-sm hover:shadow-md transition">
            {/* Display the Label (Home, Work) and a "Default" badge if true */}
            <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-gray-800 uppercase text-sm">{address?.label}</span>
                {address?.isDefault && (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">DEFAULT</span>
                )}
            </div>
            <div className="text-gray-600 text-sm mb-4">
                <p>{address?.street}</p>
                <p>
                    {address?.city}, {address?.state} {address?.zipCode}
                </p>
                <p>{address?.country}</p>
            </div>
            {/* Action Buttons */}
            <div className="flex gap-2">
                {!address?.isDefault && (
                    <Button onClick={handleSetDefault} variant="outline" size="sm">
                        Make Default
                    </Button>
                )}
                <Button onClick={onEdit} variant="outline" size="sm">
                    Edit
                </Button>
                <Button onClick={handleDelete} variant="danger" size="sm">
                    Delete
                </Button>
            </div>
        </div>
    );
};

export default AddressCard;
