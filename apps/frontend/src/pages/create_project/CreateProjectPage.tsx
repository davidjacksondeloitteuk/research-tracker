import { useState } from 'react';
import type { ProjectTaskInput } from '../../types/types';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../context/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashCan, faEdit } from '@fortawesome/free-solid-svg-icons';
import AddNewTaskModal from './components/AddNewTaskModal';

const CreateProjectPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [projectTasks, setProjectTasks] = useState<ProjectTaskInput[]>([]);

    const [isAddTaskOpen, setIsAddTaskOpen] = useState<boolean>(false);
    const [currentTaskTitle, setCurrentTaskTitle] = useState<string>('');
    const [currentTaskDescription, setCurrentTaskDescription] = useState<string>('');
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    async function handleCreateProject(e: React.FormEvent) {
        e.preventDefault();

        // Check if project name and description are provided
        if (!projectName || !projectDescription) {
            setErrorMessage('Please provide both project name and description.');
            return;
        }

        // Check if tasks empty
        if (projectTasks.length === 0) {
            setErrorMessage('Please add at least one task.');
            return;
        }

        if (!user) {
            setErrorMessage('Please log in before creating a project.');
            return;
        }

        // Add logic to handle project creation here
        console.log('Creating project:', { projectName, projectDescription });
        setIsLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/projects`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: projectName,
                    description: projectDescription,
                    user_created_id: user.id,
                    // Update assigned users with list of select
                    assigned_users: [{ user_id: user.id, project_id: null, is_lead: true }],
                    tasks: projectTasks.map(({ title, description }) => ({ title, description })),
                }),
            });

            if (!response.ok) {
                throw new Error(`Unable to create project (HTTP ${response.status}).`);
            } else {
                navigate('/');
            }
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Error creating project');
            console.error('Error creating project:', error);
        } finally {
            setIsLoading(false);
        }
    }

    function handleAddTask(e: React.FormEvent) {
        e.preventDefault();
        if (!currentTaskTitle || !currentTaskDescription) return;

        if (editingIndex !== null) {
            const newTasks = [...projectTasks];
            newTasks[editingIndex] = {
                title: currentTaskTitle,
                description: currentTaskDescription,
            };
            setProjectTasks(newTasks);
        } else {
            setProjectTasks([
                ...projectTasks,
                { title: currentTaskTitle, description: currentTaskDescription },
            ]);
        }

        setCurrentTaskTitle('');
        setCurrentTaskDescription('');
        setEditingIndex(null);
        setIsAddTaskOpen(false);
    }

    function handleOpenUpdateTask(index: number) {
        const task = projectTasks[index];
        setEditingIndex(index);
        setCurrentTaskTitle(task.title);
        setCurrentTaskDescription(task.description);
        setIsAddTaskOpen(true);
    }

    function handleRemoveTask(index: number) {
        const newTasks = [...projectTasks];
        newTasks.splice(index, 1);
        setProjectTasks(newTasks);
    }

    return (
        <>
            <h1>New Project</h1>

            {isLoading && <p>Loading...</p>}

            {errorMessage && <p className="text-red-600">{errorMessage}</p>}

            <form onSubmit={handleCreateProject} className="form-default">
                <label htmlFor="project-name">Project Name</label>
                <input
                    id="project-name"
                    className="input-default"
                    type="text"
                    placeholder="Project Name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                />
                <label htmlFor="project-description" className="label-default">
                    Project Description
                </label>
                <textarea
                    id="project-description"
                    rows={4}
                    className="input-default resize-none"
                    placeholder="Project Description"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                />

                <hr />

                <div className="flex justify-between items-center mb-4">
                    <h2>Tasks</h2>
                    <button
                        type="button"
                        className="cursor-pointer"
                        onClick={() => {
                            setEditingIndex(null);
                            setCurrentTaskTitle('');
                            setCurrentTaskDescription('');
                            setIsAddTaskOpen(true);
                        }}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                    </button>
                </div>

                <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
                    {projectTasks.map((task, index) => (
                        <div className="container-default flex flex-col gap-4" key={index}>
                            <h4>{task.title}</h4>

                            <div className="container-sub">
                                <p>{task.description}</p>
                            </div>

                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    onClick={() => handleRemoveTask(index)}
                                    className="text-red-800 cursor-pointer"
                                >
                                    <FontAwesomeIcon icon={faTrashCan} />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleOpenUpdateTask(index)}
                                    className="cursor-pointer"
                                >
                                    <FontAwesomeIcon icon={faEdit} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-between">
                    <Link to="/" className="button-secondary">
                        Cancel
                    </Link>

                    <button type="submit" className="button-primary">
                        Create Project
                    </button>
                </div>
            </form>

            <AddNewTaskModal
                isAddTaskOpen={isAddTaskOpen}
                currentTaskTitle={currentTaskTitle}
                currentTaskDescription={currentTaskDescription}
                editingIndex={editingIndex}
                handleAddTask={handleAddTask}
                setIsAddTaskOpen={setIsAddTaskOpen}
                setCurrentTaskTitle={setCurrentTaskTitle}
                setCurrentTaskDescription={setCurrentTaskDescription}
            />
        </>
    );
};

export default CreateProjectPage;
