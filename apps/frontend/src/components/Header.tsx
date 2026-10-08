import { NavLink, useNavigate } from 'react-router';

import { useAuth } from '../context/useAuth';

const Header = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <div className="sticky top-0 left-0 z-50 w-full bg-white p-4 center">
            {isAuthenticated ? (
                <div className="w-full max-w-4xl mx-auto flex justify-between">
                    <div className="left-section flex justify-start gap-4">
                        <NavLink
                            className={({ isActive }) =>
                                isActive ? 'nav-link-active' : 'nav-link'
                            }
                            to="/"
                        >
                            Projects
                        </NavLink>
                    </div>

                    <div className="right-section flex items-center justify-end gap-4">
                        <NavLink
                            className={({ isActive }) =>
                                isActive ? 'nav-link-active' : 'nav-link'
                            }
                            to="/account"
                        >
                            {user?.username || 'Account'}
                        </NavLink>
                        <button
                            type="button"
                            onClick={() => {
                                logout();
                                navigate('/');
                            }}
                            className="nav-link cursor-pointer"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            ) : (
                <div className="w-full max-w-4xl mx-auto flex justify-end gap-4">
                    <NavLink
                        className={({ isActive }) => (isActive ? 'nav-link-active' : 'nav-link')}
                        to="/register"
                    >
                        Register
                    </NavLink>
                    <NavLink
                        className={({ isActive }) => (isActive ? 'nav-link-active' : 'nav-link')}
                        to="/login"
                    >
                        Login
                    </NavLink>
                </div>
            )}
        </div>
    );
};

export default Header;
