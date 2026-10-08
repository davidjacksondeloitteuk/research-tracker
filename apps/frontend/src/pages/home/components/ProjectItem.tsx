import Slider from '../../../components/Slider';
import UserThumbnail from '../../../components/UserThumbnail';
import type { ProjectType } from '../../../types/types';
import { Link } from 'react-router';

interface ProjectItemProps {
    project: ProjectType;
}

const ProjectItem = ({ project }: ProjectItemProps) => {
    const tasks = project.tasks ?? [];
    const completed = tasks.filter((task) => task.completed).length;

    return (
        <Link to={`/projects/${project.id}`} className="container-default flex items-center">
            <div className="flex-2">
                <h3>{project.name}</h3>
            </div>

            <div className="flex-1 flex items-center -space-x-2">
                {project.assigned_users.map(({ user }) => (
                    <UserThumbnail key={user.id} user={user} />
                ))}
            </div>

            <div className="flex-1 flex justify-end p-4">
                <Slider total={tasks.length} completed={completed} />
            </div>
        </Link>
    );
};

export default ProjectItem;
