import * as React from 'react';
import { getIdeas, Idea, IdeaBaseFields, getNewIdea, updateIdea, deleteIdea } from '../helpers/api';

const getInitData = (): Idea[] | null => {
    const data = localStorage.getItem('ideas');
    if (!data) {
        return null;
    }
    const parsedData = JSON.parse(data);
    return parsedData as Idea[];
};

const updateStore = (datum: Idea[]): void => localStorage.setItem('ideas', JSON.stringify(datum));
const IdeaContext = React.createContext<{
    ideas: Idea[];
    addNewIdea?: () => Promise<IdeaBaseFields>;
    deleteIdeaById?: (id: string) => Promise<string>;
    updateIdeaById?: (id: string, payload: Idea) => Promise<Idea>;
}>({
    ideas: [],
});

const IdeaContextProvider: React.FC = props => {
    const [ideas, setIdeas] = React.useState<Idea[]>([]);
    async function fetchAndSetIdeas(): Promise<void> {
        const ideas = await getIdeas();
        setIdeas(ideas);
    }
    React.useEffect(() => {
        const ideasFromStore = getInitData();
        if (!ideasFromStore) {
            fetchAndSetIdeas();
        } else {
            setIdeas(ideasFromStore);
        }
    }, []);
    const addNewIdea = React.useCallback(() => {
        return new Promise<IdeaBaseFields>(async (resolve, reject) => {
            try {
                const idea = await getNewIdea();
                const newIdeas = [...ideas, ...[idea]];
                setIdeas(newIdeas as Idea[]);
                resolve(idea);
            } catch (e) {
                reject(new Error(e));
            }
        });
    }, [ideas]);

    const updateIdeaById = React.useCallback(
        (id: string, payload: Idea) => {
            return new Promise<Idea>(async (resolve, reject) => {
                try {
                    const ideaIndex = ideas.findIndex(idea => idea.id === id);
                    await updateIdea(id, payload);
                    const newIdeas = [...ideas];
                    const { title, body } = payload;
                    // Partial update on UI side
                    const newIdea = { ...ideas[ideaIndex], ...(title && { title }), ...(body && { body }) };
                    newIdeas.splice(ideaIndex, 1, newIdea);
                    setIdeas(newIdeas);
                    resolve(newIdea);
                } catch (e) {
                    reject(new Error(e));
                }
            });
        },
        [ideas],
    );

    const deleteIdeaById = React.useCallback(
        id =>
            new Promise<string>(async (resolve, reject) => {
                try {
                    await deleteIdea(id);
                    setIdeas(ideas => ideas.filter(idea => idea.id !== id));
                    resolve(id);
                } catch (e) {
                    reject(new Error(e));
                }
            }),
        [deleteIdea, setIdeas],
    );

    // Update localstore when ideas changes
    React.useEffect(() => {
        updateStore(ideas);
    }, [ideas]);
    return (
        <IdeaContext.Provider
            value={{
                ideas,
                addNewIdea,
                deleteIdeaById,
                updateIdeaById,
            }}
            {...props}
        />
    );
};

const useIdeaContext = () => React.useContext(IdeaContext);

export { IdeaContextProvider, useIdeaContext, IdeaContext };
