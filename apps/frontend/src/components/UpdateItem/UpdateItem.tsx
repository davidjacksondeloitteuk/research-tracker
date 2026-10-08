import { useAuth } from '../../context/useAuth';
import { useState } from 'react';
import { Link } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import UserThumbnail from '../UserThumbnail';
import EditUpdateModal from './components/EditUpdateModal';
import formatDate from '../../helpers/formatDate';
import type { UpdateType } from '../../types/types';

interface UpdateItemProps {
    update: UpdateType;
    handleDeleteUpdate: (update_id: number) => Promise<void>;
    is_link?: boolean;
}

const UpdateItem = ({ update, handleDeleteUpdate, is_link = false }: UpdateItemProps) => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState<boolean>(false);

    return (
        <div className="container-default flex flex-col gap-2">
            <div className="flex justify-between items-start">
                <Link
                    to={`/tasks/${update.task_id}`}
                    className={`${!is_link ? 'pointer-events-none' : ''}`}
                >
                    {update.title}
                </Link>

                <UserThumbnail user={update.user_created} />
            </div>

            <div className="container-sub">
                <p>{update.content}</p>
                <div className="flex items-end justify-end mt-2">
                    <small>{formatDate(update.date_created)}</small>
                </div>
            </div>

            {update.user_created.id === user?.id && (
                <div className="flex justify-between">
                    <button onClick={() => handleDeleteUpdate(update.id)} className="text-red-800 cursor-pointer">
                        <FontAwesomeIcon icon={faTrashCan} />
                    </button>

                    <button onClick={() => setIsEditing(true)} className="cursor-pointer">
                        <FontAwesomeIcon icon={faEdit} />
                    </button>
                </div>
            )}

            <EditUpdateModal 
                isOpen={isEditing}
                update={update}
                onClose={() => setIsEditing(false)}
            />
        </div>
    );
};

export default UpdateItem;
