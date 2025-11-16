import { useContext } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from '../../providers/AuthProvider';

const UpdateModel = () => {
    // 1. Get the existing model data passed from the Router loader
    const modelToUpdate = useLoaderData();
    const { _id, modelName, description, price, category, } = modelToUpdate;
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // 2. Handle the PATCH (Update) form submission
    const handleUpdateModel = (e) => {
        e.preventDefault();
        const form = e.target;
        
        // Collect updated form data
        const updatedModelName = form.modelName.value;
        const updatedDescription = form.description.value;
        const updatedPrice = parseFloat(form.price.value);
        const updatedCategory = form.category.value;
        
        const updatedModel = {
            modelName: updatedModelName,
            description: updatedDescription,
            price: updatedPrice,
            category: updatedCategory,
        };

        // Send data to the server using PATCH method
        fetch(`http://localhost:5001/models/${_id}`, {
            method: 'PATCH', // Use PATCH for partial update
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedModel),
        })
        .then(res => res.json())
        .then(data => {
            if (data.modifiedCount > 0) {
                Swal.fire({
                    icon: 'success',
                    title: 'Model Updated!',
                    text: `${updatedModelName} details have been successfully modified.`,
                    confirmButtonText: 'OK'
                });
                navigate('/'); // Redirect to home page after update
            } else {
                 Swal.fire({
                    icon: 'info',
                    title: 'No Changes',
                    text: 'No modifications were made to the model data.',
                });
            }
        })
        .catch(error => {
            console.error('Fetch Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: 'Could not connect to the server or update failed.',
            });
        });
    };

    return (
        <div className="max-w-4xl mx-auto my-10 p-6 shadow-2xl bg-base-100 rounded-xl">
            <h1 className="text-4xl font-extrabold text-center mb-8 text-secondary">Edit AI Model: {modelName}</h1>
            
            <form onSubmit={handleUpdateModel} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Model Name and Price (with existing values) */}
                <div className="form-control">
                    <label className="label"><span className="label-text font-semibold">Model Name</span></label>
                    <input type="text" name="modelName" defaultValue={modelName} className="input input-bordered" required />
                </div>
                <div className="form-control">
                    <label className="label"><span className="label-text font-semibold">Price (USD)</span></label>
                    <input type="number" step="0.01" name="price" defaultValue={price} className="input input-bordered" required />
                </div>

                {/* Category and Developer Email (Read-only) */}
                <div className="form-control">
                    <label className="label"><span className="label-text font-semibold">Category</span></label>
                    <select name="category" className="select select-bordered" defaultValue={category} required>
                        <option value="LLM">Large Language Model (LLM)</option>
                        <option value="Image Gen">Image Generation</option>
                        <option value="Audio/Speech">Audio/Speech</option>
                        <option value="Data Analysis">Data Analysis</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="form-control">
                    <label className="label"><span className="label-text font-semibold">Developer Email</span></label>
                    <input type="email" name="developerEmail" defaultValue={user?.email || ''} readOnly className="input input-bordered bg-gray-200" />
                </div>

                {/* Description (Full Width) */}
                <div className="form-control md:col-span-2">
                    <label className="label"><span className="label-text font-semibold">Model Description</span></label>
                    <textarea name="description" defaultValue={description} className="textarea textarea-bordered h-32" required></textarea>
                </div>

                {/* Submit Button (Full Width) */}
                <div className="form-control mt-6 md:col-span-2">
                    <button type="submit" className="btn btn-secondary w-full">
                        Save Model Updates
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateModel;