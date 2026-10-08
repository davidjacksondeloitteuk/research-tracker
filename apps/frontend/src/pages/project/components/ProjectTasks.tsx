interface ProjectTasksProps {
    projectData: ProjectType;
    setIsAddTaskOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
import type { ProjectType } from '../../../types/types';
import TaskItem from './TaskItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const ProjectTasks = ({ projectData, setIsAddTaskOpen }: ProjectTasksProps) => {
    return (
        <div id="tasks-container" className="flex min-h-0 flex-1 flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2>Tasks</h2>
                <button
                    type="button"
                    className="cursor-pointer"
                    onClick={() => setIsAddTaskOpen(true)}
                >
                    <FontAwesomeIcon icon={faPlus} />
                </button>
            </div>
            <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
                {projectData.tasks.map((task) => (
                    <TaskItem key={task.id} task={task} />
                ))}
            </div>
        </div>
    );
};

export default ProjectTasks;
