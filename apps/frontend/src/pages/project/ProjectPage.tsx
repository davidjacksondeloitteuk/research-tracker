import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import type { ProjectType } from '../../types/types';
import { useAuth } from '../../context/useAuth';
import ProjectDetails from './components/ProjectDetails';
import ProjectTasks from './components/ProjectTasks';
import ProjectFeed from './components/ProjectFeed';
import AddTaskModal from '../../components/AddTaskModal';

const ProjectPage = () => {
    const { projectId } = useParams();
    const { user } = useAuth();
    const [projectData, setProjectData] = useState<ProjectType | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

    useEffect(() => {
        async function fetchProjectData() {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/api/projects/${projectId}`,
                );

                if (!response.ok) {
                    throw new Error('Unable to fetch projects.');
                }

                const data = (await response.json()) as ProjectType;

                setProjectData(data);
            } catch (error) {
                console.error('Unexpected error fetching project data:', error);
                setErrorMessage('Unable to load projects from the API.');
            }
        }
        fetchProjectData();
    }, [projectId]);

    async function handleAddTask(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSaving(true);
        setErrorMessage(null);

        if (!user) {
            setErrorMessage('Please log in before adding a task.');
            setIsSaving(false);
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    project_id: Number(projectId),
                    user_created_id: user.id,
                    title: taskTitle,
                    description: taskDescription,
                }),
            });

            if (!response.ok) {
                throw new Error('Unable to create task.');
            }

            const task = (await response.json()) as ProjectType['tasks'][number];
            setProjectData((current) => current && { ...current, tasks: [...current.tasks, task] });
            setTaskTitle('');
            setTaskDescription('');
            setIsAddTaskOpen(false);
        } catch {
            setErrorMessage('Unable to create task.');
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <>
            {errorMessage && <p className="text-red-600">{errorMessage}</p>}
            {projectData ? (
                <>
                    <ProjectDetails projectData={projectData} />

                    <div className="flex">
                        <Link to="/" className="button-secondary">
                            {'<< Homepage'}
                        </Link>
                    </div>

                    <div className="page-section flex gap-4">
                        <ProjectFeed projectData={projectData} setProjectData={setProjectData} />
                        <ProjectTasks
                            projectData={projectData}
                            setIsAddTaskOpen={setIsAddTaskOpen}
                        />
                    </div>

                    <AddTaskModal
                        isOpen={isAddTaskOpen}
                        isSaving={isSaving}
                        taskTitle={taskTitle}
                        taskDescription={taskDescription}
                        onTaskTitleChange={setTaskTitle}
                        onTaskDescriptionChange={setTaskDescription}
                        onClose={() => setIsAddTaskOpen(false)}
                        onSubmit={handleAddTask}
                    />
                </>
            ) : errorMessage ? null : (
                <p>Loading...</p>
            )}
        </>
    );
};

export default ProjectPage;
