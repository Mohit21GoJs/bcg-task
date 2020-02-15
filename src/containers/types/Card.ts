export interface CardProps {
    id: string;
    title?: string;
    body?: string;
    createdAt?: string;
    isActive?: boolean;
    isNew?: boolean;
    handleUpdateIdea: (id: string, payload: {}) => void;
    deleteIdea: (id: string) => void;
    resetAddNew: () => void;
}

export type FormStates = 'read' | 'edit';
