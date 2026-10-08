import Slider from '../../../components/Slider';
import UserThumbnail from '../../../components/UserThumbnail';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import type { ProjectType } from '../../../types/types';

interface ProjectDetailsProps {
    projectData: ProjectType;
}

const ProjectDetails = ({ projectData }: ProjectDetailsProps) => {
    return (
        <div className="container-default flex flex-col gap-2">
            <div className="flex justify-between items-start">
                <h1 className="flex-4">{projectData.name}</h1>
                <div className="flex-1">
                    <Slider
                        total={projectData.tasks.length}
                        completed={projectData.tasks.filter((task) => task.completed).length}
                    />
                </div>
            </div>

            <div className="flex justify-between items-start">
                <div className="flex-1 flex flex-col gap-2">
                    <h4 className="flex-4">Project Lead</h4>
                    {projectData.user_created ? (
                        <UserThumbnail user={projectData.user_created} />
                    ) : (
                        <h3>N/A</h3>
                    )}
                </div>

                <div className="flex-1 flex flex-col gap-2 items-end">
                    <h4 className="flex-4">Team</h4>

                    {projectData.assigned_users.length > 0 ? (
                        projectData.assigned_users.map((user) => (
                            <UserThumbnail key={user.user_id} user={user.user} />
                        ))
                    ) : (
                        <h3>N/A</h3>
                    )}
                </div>
            </div>

            <div>
                <h4>Description:</h4>
                <div className="container-sub">
                    <p>{projectData.description}</p>
                </div>
            </div>

            <div className="flex justify-between items-end">
                <small>Created: {new Date(projectData.date_created).toLocaleString()}</small>
                <button>
                    <FontAwesomeIcon icon={faCog} size="lg" />
                </button>
            </div>
        </div>
    );
};

export default ProjectDetails;
