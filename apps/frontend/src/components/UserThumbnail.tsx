import type { UserType } from '../types/types';

interface UserThumbnailProps {
    user: UserType;
}

const UserThumbnail = ({ user }: UserThumbnailProps) => {
    return (
        <img
            key={user.id}
            src={user.profile_picture ?? '/default_user_icon.png'}
            alt={`${user.username}-thumbnail`}
            title={`${user.username}-thumbnail`}
            className="w-8 h-8 rounded-full object-cover border border-white"
        />
    );
};

export default UserThumbnail;
