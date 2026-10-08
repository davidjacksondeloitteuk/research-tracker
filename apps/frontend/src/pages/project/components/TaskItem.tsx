import type { TaskType } from '../../../types/types';
import { Link } from 'react-router';

interface TaskItemProps {
    task: TaskType;
}

const TaskItem = ({ task }: TaskItemProps) => {
    return (
        <Link
            to={`/tasks/${task.id}`}
            className="button-secondary flex justify-between"
        >
            <h3>{task.title}</h3>

            {task.completed && <p className="text-sm text-green-500">completed</p>}

        </Link>
    );
};

export default TaskItem;
