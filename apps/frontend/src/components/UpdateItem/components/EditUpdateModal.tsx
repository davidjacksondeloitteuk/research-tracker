import { useEffect, useRef, useState } from 'react';
import type { UpdateType } from '../../../types/types';

interface EditUpdateModalProps {
    isOpen: boolean;
    update: UpdateType;
    onClose: () => void;
}

const EditUpdateModal = ({ isOpen, update, onClose }: EditUpdateModalProps) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [updateTitle, setUpdateTitle] = useState(update.title);
    const [updateContent, setUpdateContent] = useState(update.content);
    const [isSaving, setIsSaving] = useState(false);

    async function handleSaveUpdate() {
        setIsSaving(true);
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/updates/${update.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: updateTitle,
                        content: updateContent,
                    }),
                },
            );

            if (!response.ok) {
                throw new Error('Failed to update');
            }

            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    }

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
            aria-labelledby="edit-update-title"
            onClose={onClose}
            onClick={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
            className="modal-default"
        >
            <div className="mb-4 flex items-center justify-between gap-4">
                <h2 id="edit-update-title">Edit Task Update</h2>
                <button
                    type="button"
                    className="button-secondary"
                    onClick={onClose}
                    disabled={isSaving}
                >
                    Cancel
                </button>
            </div>
            <form onSubmit={handleSaveUpdate} className="flex flex-col gap-4">
                <input
                    className="input-default"
                    placeholder="Update title"
                    aria-label="Update title"
                    autoFocus
                    required
                    maxLength={255}
                    value={updateTitle}
                    onChange={(event) => setUpdateTitle(event.target.value)}
                />
                <textarea
                    rows={2}
                    className="input-default resize-none"
                    placeholder="Description"
                    aria-label="Task description"
                    maxLength={255}
                    value={updateContent}
                    onChange={(event) => setUpdateContent(event.target.value)}
                />
                <button type="submit" className="button-primary" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save changes'}
                </button>
            </form>
        </dialog>
    );
};

export default EditUpdateModal;
