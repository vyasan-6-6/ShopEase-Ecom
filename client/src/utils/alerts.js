import Swal from 'sweetalert2';

// we use this function for delete confirmation dialog for the user 
export const confirmDelete = async (title = "Are you sure?", text = "You won't be able to revert this!") => {
   
    const result = await Swal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4f46e5', // indigo-600
        cancelButtonColor: '#ef4444', // red-500
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
        background: '#ffffff',
        borderRadius: '1rem',
        customClass: {
            popup: 'rounded-2xl',
            confirmButton: 'rounded-xl px-6 py-2.5 font-bold',
            cancelButton: 'rounded-xl px-6 py-2.5 font-bold'
        }
    });

    return result.isConfirmed;
};
