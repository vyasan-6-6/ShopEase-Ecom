import Button from "../common/Button";

const AddressCard = ({ address }) => {
    return (
        <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition">
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
                    <Button variant="outline" size="sm">
                        Make Default
                    </Button>
                )}
                <Button variant="danger" size="sm">
                    Delete
                </Button>
            </div>
        </div>
    );
};

export default AddressCard;
