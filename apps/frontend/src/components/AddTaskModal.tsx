import React, { useEffect, useRef } from 'react';

type AddTaskModalProps = {
    isOpen: boolean;
    isSaving?: boolean;
    taskTitle: string;
    taskDescription: string;
    onTaskTitleChange: (value: string) => void;
    onTaskDescriptionChange: (value: string) => void;
    onClose: () => void;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

const AddTaskModal = ({
    isOpen,
    isSaving,
    taskTitle,
    taskDescription,
    onTaskTitleChange,
    onTaskDescriptionChange,
    onClose,
    onSubmit,
}: AddTaskModalProps) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isOpen && !dialog.open) {
            dialog.showModal();
        } else if (!isOpen && dialog.open) {
            dialog.close();
        }
    }, [isOpen]);

    return (
        <dialog
            ref={dialogRef}
            aria-labelledby="add-task-title"
            onClose={onClose}
            onClick={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
            className="modal-default"
        >
            <div className="mb-4 flex items-center justify-between gap-4">
                <h2 id="add-task-title">Add Task</h2>
                <button
                    type="button"
                    className="button-secondary"
                    onClick={onClose}
                    disabled={isSaving}
                >
                    Cancel
                </button>
            </div>
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <input
                    className="input-default"
                    placeholder="Task name"
                    aria-label="Task name"
                    autoFocus
                    required
                    maxLength={255}
                    value={taskTitle}
                    onChange={(event) => onTaskTitleChange(event.target.value)}
                />
                <textarea
                    rows={2}
                    className="input-default resize-none"
                    placeholder="Description"
                    aria-label="Task description"
                    maxLength={255}
                    value={taskDescription}
                    onChange={(event) => onTaskDescriptionChange(event.target.value)}
                />
                <button type="submit" className="button-primary" disabled={isSaving}>
                    {isSaving ? 'Adding...' : 'Add task'}
                </button>
            </form>
        </dialog>
    );
};

export default AddTaskModal;