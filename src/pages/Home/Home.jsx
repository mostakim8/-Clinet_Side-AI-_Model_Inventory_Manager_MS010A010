import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const SERVER_BASE_URL = 'http://localhost:5001';

const Home = () => {
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        fetch(`${SERVER_BASE_URL}/models`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to fetch models from server.');
                }
                return res.json();
            })
            .then(data => {
                setModels(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch Error:", err);
                // Error message in English
                setError(`Failed to load models. Please ensure the server is running on port 5001.`);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[70vh]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (error) {
        return <div className="text-center my-10 text-red-600 text-xl font-medium p-4 bg-red-100 rounded-lg max-w-lg mx-auto">{error}</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-5xl font-extrabold text-center mb-12 text-secondary">
               All Model Collection
            </h2>
            
            {models.length === 0 ? (
                // Message in English
                <p className="text-center text-2xl text-gray-500">
                    No models are currently available in the inventory.
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {models.map(model => (
                        <div key={model._id} className="card bg-base-100 shadow-xl border border-gray-200 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
                            <figure className="h-60 overflow-hidden bg-gray-50">
                                <img 
                                    src={model.imageUrl} 
                                    alt={model.modelName} 
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/1e293b/ffffff?text=Image+Not+Found"; }}
                                />
                            </figure>
                            <div className="card-body p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h2 className="card-title text-2xl text-primary leading-tight">{model.modelName}</h2>
                                    <div className="badge badge-lg badge-success text-white font-bold py-3 px-4">${model.price.toFixed(2)}</div>
                                </div>
                                
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{model.description}</p>

                                <div className="flex justify-between text-sm text-gray-500 mb-4">
                                    <span>Category: {model.category}</span>
                                    <span>Developer: {model.developerName || model.developerEmail.split('@')[0]}</span>
                                </div>
                                
                                <div className="card-actions justify-end">
                                    <Link to={`/model/${model._id}`} className="btn btn-secondary text-white btn-block hover:bg-secondary-focus transition duration-300">
                                      Show Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
