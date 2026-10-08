import { Navigate } from 'react-router';

import { useAuth } from '../../context/useAuth';

const AccountPage = () => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const createdAt = new Date(user.date_created).toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

    return (
        <>
            <h1 className="mb-6">Account</h1>

            <div className="form-default">
                <div className="container-sub">
                    <p className="text-sm font-medium text-slate-500">Username</p>
                    <p className="text-lg font-semibold text-slate-900">{user.username}</p>
                </div>

                <div className="container-sub">
                    <p className="text-sm font-medium text-slate-500">First name</p>
                    <p className="text-lg font-semibold text-slate-900">{user.first_name}</p>
                </div>

                <div className="container-sub">
                    <p className="text-sm font-medium text-slate-500">Last name</p>
                    <p className="text-lg font-semibold text-slate-900">{user.last_name}</p>
                </div>

                <div className="container-sub">
                    <p className="text-sm font-medium text-slate-500">Account created</p>
                    <p className="text-lg font-semibold text-slate-900">{createdAt}</p>
                </div>

                <div className="flex justify-between">
                  <button className="button-secondary">
                    Edit Account
                  </button>
                  <button className="button-danger">
                    Delete Account
                  </button>
                </div>
            </div>
        </>
    );
};

export default AccountPage;
