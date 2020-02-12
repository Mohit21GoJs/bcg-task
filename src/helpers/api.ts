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

function updateIdea(id: string, body: IdeaContent): Idea {
    return {
        title: '',
        body: '',
        createdAt: '',
        id: '',
    };
}

function deleteIdea(id: string): void {
    // delete idea
}

export { getIdeas, getNewIdea, updateIdea, deleteIdea };
