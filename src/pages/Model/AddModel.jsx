import { useContext } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import Swal from 'sweetalert2'; // For notifications

const SERVER_BASE_URL = 'http://localhost:5001'; 

const AddModel = () => {
    const { user } = useContext(AuthContext);

    // Function to handle form submission and POST request
    const handleAddModel = (e) => {
        e.preventDefault();
        const form = e.target;
        
        // 1. Collect form data
        const modelName = form.modelName.value;
        const description = form.description.value;
        const price = parseFloat(form.price.value);
        const category = form.category.value;
        const imageUrl = form.imageUrl.value; // Get value from the new input field
        const developerEmail = user?.email; // Use the logged-in user's email

        // Server-side required fields: modelName, category, price, description, imageUrl, developerEmail
        const newModel = {
            modelName,
            description,
            price,
            category,
            developerEmail,
            imageUrl,
            developerName: user?.displayName || 'Unknown Developer',
        };

        console.log('Model Data to Send:', newModel);

        // 2. Send data to the server (POST API)
        fetch(`${SERVER_BASE_URL}/models`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newModel),
        })
        .then(res => {
            // Check for non-200 responses (e.g., 400, 500)
            if (!res.ok) {
                // Try to read the error message from the server response body
                return res.json().then(err => { throw new Error(err.message || `Server responded with status ${res.status}.`) });
            }
            return res.json();
        })
        .then(data => {
            console.log('Server Response:', data);
            
            // Server returns the inserted document with _id upon successful insertion
            if (data._id) { 
                Swal.fire({
                    icon: 'success',
                    title: 'Model Added!',
                    text: `${modelName} has been added to the inventory.`,
                    confirmButtonText: 'Great!'
                });
                form.reset(); // Clear the form on success
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to Add',
                    text: 'Insertion failed. Check server logs.',
                });
            }
        })
        .catch(error => {
            console.error('Fetch Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Network Error',
                text: `Could not connect to the server or request failed. Details: ${error.message}`,
            });
        });
    };

    return (
        <div className="max-w-4xl mx-auto my-10 p-6 shadow-2xl bg-base-100 rounded-xl">
            <h1 className="text-4xl font-extrabold text-center mb-8 text-primary">Add New AI Model</h1>
            
            <form onSubmit={handleAddModel} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Row 1: Model Name and Price */}
                <div className="form-control">
                    <label className="label"><span className="label-text font-semibold">Model Name</span></label>
                    <input type="text" name="modelName" placeholder="e.g., GPT-5, Imagen 3" className="input input-bordered" required />
                </div>
                <div className="form-control">
                    <label className="label"><span className="label-text font-semibold">Price (USD)</span></label>
                    <input type="number" step="0.01" name="price" placeholder="e.g., 29.99" className="input input-bordered" required />
                </div>

                {/* Row 2: Category and Developer Email (Read-only) */}
                <div className="form-control">
                    <label className="label"><span className="label-text font-semibold">Category</span></label>
                    <select name="category" className="select select-bordered" required>
                        <option value="" disabled>Select a Category</option>
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

                {/* Row 3: Description (Full Width) */}
                <div className="form-control md:col-span-2">
                    <label className="label"><span className="label-text font-semibold">Model Description</span></label>
                    <textarea name="description" placeholder="Provide a detailed description of the model's features and capabilities." className="textarea textarea-bordered h-32" required></textarea>
                </div>
                
                {/* Row 4: Image URL (Full Width) - Added missing required field */}
                <div className="form-control md:col-span-2">
                    <label className="label"><span className="label-text font-semibold">Image URL</span></label>
                    {/* Placeholder image for testing: https://placehold.co/400x200 */}
                    <input type="url" name="imageUrl" placeholder="e.g., https://placehold.co/400x200" className="input input-bordered" required />
                </div>

                {/* Submit Button (Full Width) */}
                <div className="form-control mt-6 md:col-span-2">
                    <button type="submit" className="btn btn-primary w-full">
                        Add Model to Inventory
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddModel;