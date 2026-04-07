import { selectUser } from "../../redux/features/auth/authSelectors";
import { useState } from "react";
import AddressCard from "../../components/user/AddressCard";
import { useAppSelector } from "../../redux/hooks";
import AddressForm from "../../components/user/AddressForm";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";

const AddressBook = () => {
    const user = useAppSelector(selectUser);
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div  className="p-8"> 
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">My Addresses</h1>
                <Button onClick={() => setIsModalOpen(true)}>+ Add New Address</Button>
            </div>
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                    {user?.addresses?.length>0 ? (user.addresses.map((addr, index) => (
                        <AddressCard key={index} address={addr}/>
                    ))):   <p className="text-gray-500">You don't have any saved addresses yet.</p>}
                </div>
              

            {/* <div className="w-full md:w-1/2 p-8 border border-gray-100 rounded-3xl bg-white shadow-sm h-fit">
                <h3 className="text-xl font-bold mb-6 text-gray-800">Add New Address</h3> */}
            <Modal isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)} title="Add New Address"><AddressForm onCloseModal={()=>setIsModalOpen(false)}/></Modal>
            {/* </div> */}
        </div>
    );
};
export default AddressBook;
