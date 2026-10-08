import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router';
import type { TaskType } from '../../types/types';
import { useAuth } from '../../context/useAuth';
import UpdateItem from '../../components/UpdateItem/UpdateItem';

const TaskPage = () => {
    const { taskId } = useParams();
    const { user } = useAuth();
    const [taskData, setTaskData] = React.useState<TaskType | null>(null);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    const [isSaving, setIsSaving] = React.useState(false);
    const [updateTitle, setUpdateTitle] = React.useState('');
    const [updateContent, setUpdateContent] = React.useState('');

    async function handleToggleTaskComplete(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/tasks/${taskId}/toggle-complete`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                },
            );

            if (!response.ok) {
                throw new Error('Unable to toggle task completion.');
            }

            const updatedTask = (await response.json()) as TaskType;
            setTaskData(updatedTask);
        } catch {
            setErrorMessage('Unable to toggle task completion.');
        }
    }

    async function handlePostUpdate(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        // Implement the logic to post an update here

        if (!user) {
            setErrorMessage('Please log in before adding a task.');
            setIsSaving(false);
            return;
        }

        if (!taskData) {
            setErrorMessage('Task data is not available.');
            setIsSaving(false);
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/updates`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: updateTitle,
                    content: updateContent,
                    user_created_id: user.id,
                    task_id: taskData.id,
                }),
            });

            if (!response.ok) {
                throw new Error('Unable to create task.');
            }

            const update = (await response.json()) as TaskType['updates'][number];
            setTaskData(
                (current) => current && { ...current, updates: [...current.updates, update] },
            );
            setUpdateTitle('');
            setUpdateContent('');
        } catch {
            setErrorMessage('Unable to create task.');
        } finally {
            setIsSaving(false);
        }
    }

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

            setTaskData(
                (current) =>
                    current && {
                        ...current,
                        updates: current.updates.filter((u) => u.id !== update_id),
                    },
            );
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        async function fetchTaskData() {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/api/tasks/${taskId}`,
                );

                if (!response.ok) {
                    throw new Error('Unable to fetch tasks.');
                }

                const data = (await response.json()) as TaskType;
                console.log(data);
                setTaskData(data);
            } catch (error) {
                console.error('Unexpected error fetching task data:', error);
                setErrorMessage('Unable to load tasks from the API.');
            }
        }
        fetchTaskData();
    }, [taskId]);

    return (
        <>
            {errorMessage && <p className="text-red-600">{errorMessage}</p>}
            {taskData ? (
                <div className="flex min-h-0 flex-1 flex-col gap-4">
                    {/* Task Details */}
                    <div className="container-default">
                        <div className="flex justify-between items-center">
                            <h1>{taskData.title}</h1>

                            <button
                                className={
                                    taskData.completed ? 'button-primary' : 'button-secondary'
                                }
                                disabled={isSaving}
                                onClick={handleToggleTaskComplete}
                            >
                                {taskData.completed ? 'Completed' : 'Mark Complete'}
                            </button>
                        </div>
                        <h4>Description:</h4>
                        <div className="container-sub">
                            <p>{taskData.description}</p>
                        </div>
                    </div>

                    <div>
                        <Link to={`/projects/${taskData.project_id}`} className="button-secondary">
                            {'<< Back to Project'}
                        </Link>
                    </div>

                    {/* Task Feed */}
                    <div className="page-section flex flex-col gap-4">
                        <div className="flex-2">
                            <h2>Feed</h2>
                            <div className="flex flex-col gap-2">
                                {taskData.updates.map((update) => (
                                    <UpdateItem
                                        key={update.id}
                                        update={update}
                                        handleDeleteUpdate={handleDeleteUpdate}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Add Update */}
                        <div className="flex-1 container-sub">
                            <form
                                onSubmit={handlePostUpdate}
                                className="flex flex-col gap-2 justify-end"
                            >
                                <input
                                    type="text"
                                    value={updateTitle}
                                    onChange={(e) => setUpdateTitle(e.target.value)}
                                    className="input-default"
                                    placeholder="Title"
                                />
                                <textarea
                                    value={updateContent}
                                    onChange={(e) => setUpdateContent(e.target.value)}
                                    rows={4}
                                    className="input-default flex-1"
                                />
                                <button
                                    disabled={isSaving}
                                    type="submit"
                                    className="button-primary"
                                >
                                    Add Update
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            ) : errorMessage ? null : (
                <p>Loading...</p>
            )}
        </>
    );
};

export default TaskPage;
