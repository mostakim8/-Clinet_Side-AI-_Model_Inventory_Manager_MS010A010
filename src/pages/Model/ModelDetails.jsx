import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const SERVER_BASE_URL = 'http://localhost:5001';

const ModelDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [model, setModel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        fetch(`${SERVER_BASE_URL}/models/${id}`)
            .then(res => {
                if (!res.ok) {
                    if (res.status === 404) {
                        throw new Error("404: Can't Find the Model");
                    }
                    // Failed to fetch model data from server.
                    throw new Error('Failed to fetch model data from server.');
                }
                return res.json();
            })
            .then(data => {
                setModel(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch Error:", err);
                setError(err.message || "Unknown Error");
                setLoading(false);
            });
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[70vh]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (error && !model) {
        return (
            <div className="text-center my-10 max-w-lg mx-auto p-6 bg-red-100 border border-red-400 rounded-lg shadow-lg">
                <p className="text-red-600 text-xl font-bold mb-4">Error: Model Can't Load</p>
                <p className="text-gray-700 mb-6">{error}</p>
                <Link to="/" className="btn btn-primary text-white">
                    Back To Home
                </Link>
            </div>
        );
    }

    if (!model) {
        return <div className="text-center my-10 text-xl text-gray-500">Model data is not available.</div>;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="bg-white shadow-2xl rounded-xl overflow-hidden">
                <div className="lg:flex">
                    {/* Model Image Section */}
                    <div className="lg:w-1/2 p-6 bg-gray-50 flex items-center justify-center">
                        <img 
                            src={model.imageUrl} 
                            alt={model.modelName} 
                            className="w-full max-h-96 object-contain rounded-lg shadow-lg"
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/800x600/1e293b/ffffff?text=Image+Not+Available"; }}
                        />
                    </div>
                    
                    {/* Model Details Section */}
                    <div className="lg:w-1/2 p-10">
                        <h1 className="text-4xl font-extrabold text-primary mb-3 leading-tight">{model.modelName}</h1>
                        <p className="badge badge-lg badge-accent text-white font-semibold mb-6 py-3 px-4">{model.category}</p>

                        <div className="text-5xl font-bold text-success mb-6">
                            ${model.price.toFixed(2)}
                        </div>

                        <p className="text-gray-700 mb-8 leading-relaxed text-lg">
                            {model.description}
                        </p>

                        <div className="border-t pt-6">
                            <h3 className="text-xl font-bold text-secondary mb-3">Developer Information</h3>
                            <p className="text-gray-600">
                                **Name:** <span className="font-medium">{model.developerName || "N/A"}</span>
                            </p>
                            <p className="text-gray-600">
                                **Email:** <span className="font-medium">{model.developerEmail}</span>
                            </p>
                        </div>
                        
                        <div className="mt-8">
                            <button className="btn btn-primary btn-lg w-full text-white font-bold hover:bg-primary-focus transition duration-300">
                                Buy Model (Demo)
                            </button>
                            <Link to="/" className="btn btn-ghost btn-sm mt-3 w-full">
                                View All Models
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModelDetails;
