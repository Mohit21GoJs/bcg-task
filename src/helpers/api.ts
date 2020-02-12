type IdeaBaseFields = {
    id: string;
    createdAt: string;
};

type IdeaContent = {
    title: string;
    body: string;
};

type Idea = IdeaBaseFields & IdeaContent;

async function getIdeas(): Promise<Idea[]> {
    const response = await fetch('https://tiles-be.getsandbox.com/ideas');
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
}

async function getNewIdea(): Promise<IdeaBaseFields> {
    const response = await fetch('https://tiles-be.getsandbox.com/ideas/new');
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
}

async function resetIdeas(): Promise<void> {
    await fetch('https://tiles-be.getsandbox.com/ideas/reset');
}

async function updateIdea(id: string, body: IdeaContent): Promise<Idea> {
    const response = await fetch(`https://tiles-be.getsandbox.com/idea/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(body),
    });
    if (response.ok) {
        const idea = await response.json();
        return {
            title: idea.title,
            body: idea.body,
            createdAt: idea.created_date,
            id: idea.id,
        };
    } else {
        return {
            title: '',
            body: '',
            createdAt: '',
            id: '',
        };
    }
}

async function deleteIdea(id: string): Promise<void> {
    await fetch(`https://tiles-be.getsandbox.com/idea/${id}`, {
        method: 'DELETE',
    });
}

export { getIdeas, getNewIdea, updateIdea, deleteIdea, resetIdeas };
