import UpdateItem from '../../../components/UpdateItem/UpdateItem';
import type { ProjectType } from '../../../types/types';

interface ProjectFeedProps {
    projectData: ProjectType;
    setProjectData: (projectData: ProjectType) => void;
}

const ProjectFeed = ({ projectData, setProjectData }: ProjectFeedProps) => {
    
    async function handleDeleteUpdate(update_id: number) {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/updates/${update_id}`,
                {
                    method: 'DELETE',
                },
            );
            if (!response.ok) {
                throw new Error('Failed to delete update');
            }

            setProjectData({
                ...projectData,
                tasks: projectData.tasks.map((task) => ({
                    ...task,
                    updates: task.updates.filter((u) => u.id !== update_id),
                })),
            });
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div id="feed-container" className="flex min-h-0 flex-1 flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2>Feed</h2>
            </div>
            <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
                {projectData.tasks
                    .flatMap((task) => task.updates)
                    .sort(
                        (a, b) =>
                            new Date(b.date_created).getTime() - new Date(a.date_created).getTime(),
                    )
                    .map((update) => (
                        <UpdateItem
                            key={update.id}
                            update={update}
                            handleDeleteUpdate={handleDeleteUpdate}
                            is_link={true}
                        />
                    ))}
            </div>
        </div>
    );
};

export default ProjectFeed;
