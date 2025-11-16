import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'; 

const SERVER_BASE_URL = 'http://localhost:5001';

const MyModels = () => {
    const { user } = useContext(AuthContext);
    const [myModels, setMyModels] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- Core function to fetch data for the logged-in user ---
    const fetchMyModels = () => {
         if (!user?.email) {
            setLoading(false);
            return;
        }
        
        // Query by developer email
        fetch(`${SERVER_BASE_URL}/models?email=${user.email}`) 
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to fetch user models.');
                }
                return res.json();
            })
            .then(data => {
                setMyModels(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching user models:", error);
                setLoading(false);
                Swal.fire('Error', 'Could not fetch your models. Please ensure the server is running on port 5001.', 'error');
            });
    };
    
    // --- Initial Fetch ---
    useEffect(() => {
        if (user?.email) {
            fetchMyModels();
        } else {
            setLoading(false);
        }
    }, [user?.email]);

    // --- Delete Handler ---
    const handleDelete = (id, name) => {
        Swal.fire({
            title: `Are you sure you want to delete ${name}?`,
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                // Send DELETE request to the server
                fetch(`${SERVER_BASE_URL}/models/${id}`, {
                    method: 'DELETE'
                })
                .then(res => {
                    //  when error msg from server then json msg
                    if (!res.ok) {
                        return res.json().then(err => { throw new Error(err.message || 'Server responded with error.') });
                    }
                    return res.json();
                })
                .then(data => {
                    if (data.deletedCount > 0) {
                        Swal.fire(
                            'Deleted!',
                            `${name} has been removed from the inventory.`,
                            'success'
                        );
                        // out delete model
                        setMyModels(prevModels => prevModels.filter(model => model._id !== id));
                    } else {
                        // যদি সার্ভার 200OK দেয় কিন্তু deletedCount 0 হয়
                        Swal.fire('Error', 'Model was not deleted, possibly not found.', 'error');
                    }
                })
                .catch(error => {
                    console.error("Delete Error:", error);
                    Swal.fire('Error', `Model could not be deleted. Details: ${error.message}`, 'error');
                });
            }
        });
    };


    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="py-10">
            <h1 className="text-4xl font-bold text-center mb-10 text-secondary">
                My Uploaded AI Models ({myModels.length})
            </h1>
            <p className="text-center text-sm text-gray-500 mb-6">
                Showing models created by: <span className='font-semibold text-primary'>{user?.email || 'N/A'}</span>
            </p>
            
            {myModels.length === 0 ? (
                <p className="text-center text-xl text-gray-500">
                    You have not added any models to the inventory yet. <Link to="/add-model" className='link link-primary'>Add one now</Link>.
                </p>
            ) : (
                <div className="overflow-x-auto max-w-5xl mx-auto">
                    <table className="table w-full">
                        {/* Table Head */}
                        <thead>
                            <tr className='text-lg'>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        {/* Table Body */}
                        <tbody>
                            {myModels.map(model => (
                                <tr key={model._id}>
                                    <td>{model.modelName}</td>
                                    <td>{model.category}</td>
                                    <td>${model.price}</td>
                                    <td className="flex gap-2">
                                        {/* Edit Button */}
                                        <Link 
                                            to={`/update-model/${model._id}`} 
                                            className="btn btn-info btn-sm hover:bg-info-content text-white transition duration-300"
                                        >
                                            Edit
                                        </Link>
                                        {/* Delete button */}
                                        <button 
                                            onClick={() => handleDelete(model._id, model.modelName)}
                                            className="btn btn-error btn-sm text-white hover:bg-red-700 transition duration-300"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyModels;
