import { useEffect, useRef } from 'react';

interface AddNewTaskModalProps {
    isAddTaskOpen: boolean;
    currentTaskTitle: string;
    currentTaskDescription: string;
    editingIndex: number | null;
    handleAddTask: (e: React.FormEvent) => void;
    setIsAddTaskOpen: (isOpen: boolean) => void;
    setCurrentTaskTitle: (title: string) => void;
    setCurrentTaskDescription: (description: string) => void;
}

const AddNewTaskModal = ({
    isAddTaskOpen,
    currentTaskTitle,
    currentTaskDescription,
    editingIndex,
    handleAddTask,
    setIsAddTaskOpen,
    setCurrentTaskTitle,
    setCurrentTaskDescription,
}: AddNewTaskModalProps) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isAddTaskOpen && !dialog.open) {
            dialog.showModal();
        } else if (!isAddTaskOpen && dialog.open) {
            dialog.close();
        }
    }, [isAddTaskOpen]);

    return (
        <dialog
            ref={dialogRef}
            aria-labelledby="add-task-title"
            onClose={() => setIsAddTaskOpen(false)}
            onClick={(event) => {
                if (event.target === event.currentTarget) {
                    setIsAddTaskOpen(false);
                }
            }}
            className="modal-default"
        >
            <div className="mb-4 flex items-center justify-between gap-4">
                <h2 id="add-task-title">Add Task</h2>
                <button
                    type="button"
                    className="button-secondary"
                    onClick={() => setIsAddTaskOpen(false)}
                >
                    Cancel
                </button>
            </div>
            <form onSubmit={handleAddTask} className="flex flex-col gap-4">
                <input
                    className="input-default"
                    placeholder="Task name"
                    aria-label="Task name"
                    autoFocus
                    required
                    maxLength={255}
                    value={currentTaskTitle}
                    onChange={(event) => setCurrentTaskTitle(event.target.value)}
                />
                <textarea
                    rows={2}
                    className="input-default resize-none"
                    placeholder="Description"
                    aria-label="Task description"
                    maxLength={255}
                    value={currentTaskDescription}
                    onChange={(event) => setCurrentTaskDescription(event.target.value)}
                />
                <button type="submit" className="button-primary">
                    {editingIndex !== null ? 'Update' : 'Add task'}
                </button>
            </form>
        </dialog>
    );
};

export default AddNewTaskModal;
