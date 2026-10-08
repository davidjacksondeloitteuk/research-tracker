import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/useAuth';

const Login = () => {
    const navigate = useNavigate();
    const { loginUser } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage('');

        const trimmedData = {
            username: formData.username.trim(),
            password: formData.password.trim(),
        };

        if (!trimmedData.username || !trimmedData.password) {
            setErrorMessage('Username and password are required.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(trimmedData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const message =
                    typeof errorData?.detail === 'string' && errorData.detail.length > 0
                        ? errorData.detail
                        : 'Unable to log in.';

                setErrorMessage(message);
                return;
            }

            const result = await response.json();
            loginUser(result);

            navigate('/');
        } catch (error) {
            console.error(error);
            setErrorMessage('Unable to connect to the API.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <h1 className="mb-6">Login</h1>

            <form className="form-default" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="text"
                        value={formData.username}
                        onChange={(event) => handleChange('username', event.target.value)}
                        className="input-default"
                        placeholder="jdoe"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(event) => handleChange('password', event.target.value)}
                        className="input-default"
                        placeholder="••••••••"
                    />
                </div>

                {errorMessage && <p className="text-sm font-medium text-red-600">{errorMessage}</p>}

                <div className="flex justify-end items-center">
                    <button type="submit" className="button-primary" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </div>
            </form>
        </>
    );
};

export default Login;
