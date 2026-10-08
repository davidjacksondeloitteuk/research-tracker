export type ProjectType = {
    id: number;
    name: string;
    description: string | null;
    date_created: string;
    user_created: UserType | null;
    tasks: TaskType[];
    assigned_users: ProjectMemberType[]; 
};

export type ProjectTaskInput = {
    title: string;
    description: string;
};

export type TaskType = {
    id: number;
    project_id: number;
    title: string;
    description: string | null;
    date_created: string;
    user_created: UserType | null;
    updates: UpdateType[];

    in_review: boolean;
    completed: boolean;
};

export type UpdateType = {
    id: number;
    task_id: number;
    user_created: UserType;
    title: string;
    content: string;
    date_created: string;
};

export type ProjectMemberType = {
    user_id: number;
    project_id: number;
    is_lead: boolean;
    user: UserType;
};


export type UserType = {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    profile_picture: string | null;
    date_created: string;
};