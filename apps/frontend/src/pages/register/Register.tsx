import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/useAuth';

const Register = () => {
    const navigate = useNavigate();
      const { loginUser } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        first_name: '',
        last_name: '',
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

    const handleClear = () => {
        setFormData({ username: '', first_name: '', last_name: '', password: '' });
        setErrorMessage('');
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage('');

        const trimmedData = {
            username: formData.username.trim(),
            first_name: formData.first_name.trim(),
            last_name: formData.last_name.trim(),
            password: formData.password.trim(),
        };

        if (
            !trimmedData.username ||
            !trimmedData.first_name ||
            !trimmedData.last_name ||
            !trimmedData.password
        ) {
            setErrorMessage('All fields are required.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/users/register`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(trimmedData),
                },
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const message =
                    typeof errorData?.detail === 'string' && errorData.detail.length > 0
                        ? errorData.detail
                        : 'Unable to create user.';

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
        <div className="page-body">
            <div className="container-default-narrow">
                <h1>Register</h1>

                <form className="space-y-4" onSubmit={handleSubmit}>
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
                        <label
                            htmlFor="first_name"
                            className="block text-sm font-medium text-slate-700"
                        >
                            First name
                        </label>
                        <input
                            id="first_name"
                            type="text"
                            value={formData.first_name}
                            onChange={(event) => handleChange('first_name', event.target.value)}
                            className="input-default"
                            placeholder="John"
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="last_name"
                            className="block text-sm font-medium text-slate-700"
                        >
                            Last name
                        </label>
                        <input
                            id="last_name"
                            type="text"
                            value={formData.last_name}
                            onChange={(event) => handleChange('last_name', event.target.value)}
                            className="input-default"
                            placeholder="Doe"
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-slate-700"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(event) => handleChange('password', event.target.value)}
                            className="input-default"
                            placeholder="••••••••"
                        />
                    </div>

                    {errorMessage && (
                        <p className="text-sm font-medium text-red-600">{errorMessage}</p>
                    )}

                    <div className="flex justify-between">
                        <button type="button" className="button-secondary" onClick={handleClear} disabled={isLoading}>
                            Clear
                        </button>
                        <button type="submit" className="button-primary" disabled={isLoading}>
                            {isLoading ? 'Creating...' : 'Create account'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
