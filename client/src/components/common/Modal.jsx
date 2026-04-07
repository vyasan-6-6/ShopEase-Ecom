import { useEffect } from "react";

const Modal = ({ isOpen, onClose, title = " ", children }) => {
    if(!isOpen) return null;// If it's closed, render nothing!
    useEffect(()=>{
        if(isOpen){
            document.body.style.overflow = "hidden";//stops scrolling
        }else{
              document.body.style.overflow = "unset";//restore scrolling
        }
        return ()=>document.body.style.overflow ='unset';
    },[isOpen]);
    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-lg w-full max-w-md  p-6"
                onClick={
                    (e) => e.stopPropagation() // Stops the modal from closing when clicking inside!
                }
            >
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h3 className="text-xl font-bold">{title}</h3>
                    <button className="text-gray-500 hover:text-red-500 text-2xl" onClick={onClose}>
                        &times;
                    </button>
                </div>
                <div>{children}</div>  {/* injected content */}
            </div>
        </div>
    );
};

export default Modal;
