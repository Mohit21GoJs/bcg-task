export type IdeaBaseFields = {
    id: string;
    createdAt: string;
};

type IdeaContent = {
    title: string;
    body: string;
};

type Idea = IdeaBaseFields & IdeaContent;

// FIXME: to move to config and build bundle changes
const baseApi = 'https://tiles-be.getsandbox.com';

async function getIdeas(): Promise<Idea[]> {
    try {
        const response = await fetch(`${baseApi}/ideas`);
        if (response.ok) {
            const ideas: any[] = await response.json();
            return ideas.map(idea => {
                return {
                    ...idea,
                    createdAt: idea.created_date,
                };
            });
        } else {
            return [];
        }
    } catch (e) {
        console.log('error is', e);
        throw e;
    }
}

async function getNewIdea(): Promise<IdeaBaseFields> {
    try {
        const response = await fetch(`${baseApi}/ideas/new`);
        if (response.ok) {
            const idea = await response.json();
            return {
                id: idea.id,
                createdAt: idea.created_date,
            };
        } else {
            return {
                id: '',
                createdAt: '',
            };
        }
    } catch (e) {
        console.log('error in new idea is', e);
        throw e;
    }
}

async function updateIdea(id: string, body: IdeaContent): Promise<{ id: string }> {
    try {
        const response = await fetch(`${baseApi}/idea/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify(body),
        });
        if (response.ok) {
            return {
                id,
            };
        }
    } catch (e) {
        console.log('error in update is', e);
        throw e;
    }
}

async function deleteIdea(id: string): Promise<{ id: string }> {
    try {
        const response = await fetch(`${baseApi}/idea/${id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            return { id };
        }
    } catch (e) {
        console.log('error in update is', e);
        throw e;
    }
}

export { Idea, getIdeas, getNewIdea, updateIdea, deleteIdea };
