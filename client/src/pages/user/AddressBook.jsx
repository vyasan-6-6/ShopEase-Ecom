import { selectUser } from "../../redux/features/auth/authSelectors";
import { useState } from "react";
import AddressCard from "../../components/user/AddressCard";
import { useAppSelector } from "../../redux/hooks";
import AddressForm from "../../components/user/AddressForm";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import { Plus, MapPin } from "lucide-react";

const AddressBook = () => {
    const user = useAppSelector(selectUser);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null); 
    

    const openNewAddressModal = () => {
        setEditingAddress(null);
        setIsModalOpen(true);
    };

    const openEditModal = (address) => {
        setEditingAddress(address);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500"> 
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <MapPin className="w-8 h-8 text-indigo-600" />
                        Address Book
                    </h1>
                    <p className="text-gray-500 font-medium mt-1">Manage your shipping and billing addresses</p>
                </div>
                <Button 
                    onClick={openNewAddressModal}
                    className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-black transition-all shadow-lg active:scale-95 text-sm"
                >
                    <Plus className="w-5 h-5" />
                    New Address
                </Button>
            </div>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                {user?.addresses?.length > 0 ? (
                    user.addresses.map((addr, index) => (
                        <AddressCard key={index} address={addr} onEdit={() => openEditModal(addr)} />
                    ))
                ) : (
                    <div className="md:col-span-2 text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MapPin className="w-8 h-8" />
                        </div>
                        <p className="text-gray-500 font-bold">You haven't saved any addresses yet.</p>
                        <p className="text-gray-400 text-sm mt-1">Add your shipping details for a faster checkout.</p>
                    </div>
                )}
            </div>
            
            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title={editingAddress ? "Edit Address" : "Add New Address"}
            >
                <AddressForm onCloseModal={() => setIsModalOpen(false)} addressToEdit={editingAddress} />
            </Modal>
        </div>
    );
};

export default AddressBook;
