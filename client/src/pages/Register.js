import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:4000/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'An error occurred');
            } else {

                navigate("/login");
            }
        } catch (err) {
            console.log(err);
            setError('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white min-h-screen flex flex-col">
            <header className="bg-white p-4 shadow-md">
                <div className="flex items-center w-full mx-auto">
                    <div className="flex items-center">
                        <img
                            src="/logoadv.jpg"
                            alt="Company Logo"
                            className="h-16"
                        />
                        <h1 className="text-gray-600 text-[1.8rem] font-bold ml-10">
                            LEARNING MANAGEMENT SYSTEM
                        </h1>
                    </div>
                </div>
            </header>

            <div className="flex items-center justify-center flex-grow">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">Register</h1>
                    {error && <div className="text-red-500 text-center mb-4">{error}</div>}
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-gray-600 mb-2">Name</label>
                            <input
                                type="text"
                                id="name"
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-gray-600 mb-2">Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-gray-600 mb-2">Password</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {loading ? "Registering..." : "Register"}
                        </button>
                    </form>

                    <div className="text-center mt-4">
                        <a href="/login" className="text-blue-500 hover:text-blue-700">Already have an account? Login</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
