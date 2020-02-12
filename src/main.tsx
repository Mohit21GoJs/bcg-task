import * as React from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import { Idea, getIdeas, getNewIdea, resetIdeas, updateIdea, deleteIdea } from './helpers/api';
import Tile from './components/Tile';
import Button from './components/Button';
import ErrorBoundary from './components/ErrorBoundary';

// Configure toasts
toast.configure({
    autoClose: 3000,
    draggable: false,
});

const IdeaContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

const Layout = styled.div`
    & .add-new {
        position: absolute;
        top: 10px;
        right: 0;
        background-color: green;
        max-width: 10vw;
    }
    & .reset {
        position: absolute;
        bottom: 10px;
        right: 0;
        background-color: blue;
        max-width: 10vw;
    }
    & .sort-select {
        width: 20%;
    }
`;

// @FIXME: check compatibility of react-select with ts to fix the value issues
const Main: React.FC = () => {
    const selectOptions = [
        { value: '', label: 'Default' },
        { value: 'title', label: 'Title' },
        { value: 'createdAt', label: 'Created Date' },
    ];
    const [ideas, setIdeas] = React.useState<Idea[]>([]);
    const [displayIdeas, setDisplayIdeas] = React.useState(ideas);
    const [activeIdea, setActiveIdea] = React.useState('');
    const [isAddNew, setIsAddNew] = React.useState(false);
    const [sortOption, setSortOption] = React.useState('');
    async function fetchAndSetIdeas(): Promise<void> {
        const ideas = await getIdeas();
        setIdeas(ideas);
    }

    const handleAddNewIdea = React.useCallback(async () => {
        const idea = await getNewIdea();
        setActiveIdea(idea.id);
        setIsAddNew(true);
        const newIdeas = [...ideas, ...[idea]];
        setIdeas(newIdeas as Idea[]);
    }, [ideas, getNewIdea, setActiveIdea, setIsAddNew]);

    const handleResetIdeas = React.useCallback(async () => {
        await resetIdeas();
        toast.success('Ideas Resetted');
        fetchAndSetIdeas();
    }, []);

    const handleUpdateIdea = React.useCallback(
        async (id, payload) => {
            setActiveIdea(id);
            const ideaIndex = ideas.findIndex(idea => idea.id === id);
            const idea = await updateIdea(id, payload);
            toast.success('Idea Updated');
            const newIdeas = [...ideas];
            newIdeas.splice(ideaIndex, 1, idea);
            setIdeas(newIdeas);
        },
        [ideas, setActiveIdea, updateIdea, fetchAndSetIdeas],
    );

    const handleDeleteIdea = React.useCallback(
        async id => {
            setActiveIdea(id);
            await deleteIdea(id);
            toast.success('Idea Deleted');
            setIdeas(ideas => ideas.filter(idea => idea.id !== id));
        },
        [activeIdea, deleteIdea, fetchAndSetIdeas],
    );

    React.useEffect(() => {
        console.log(sortOption);
        if (sortOption) {
            const sortedIdeas = [...ideas];
            switch (sortOption) {
                case 'title':
                    sortedIdeas.sort((a, b) => {
                        const aTitle = a.title || '';
                        const bTitle = b.title || '';
                        return aTitle.localeCompare(bTitle);
                    });
                    break;
                case 'createdAt':
                    // Calculate after comparing to milliseconds
                    sortedIdeas.sort((a, b) => {
                        const aDate = new Date(a.createdAt);
                        const bDate = new Date(b.createdAt);
                        const createdAtForA = aDate.getTime();
                        const createdAtForB = bDate.getTime();
                        if (createdAtForA < createdAtForB) {
                            return -1;
                        }
                        if (createdAtForA > createdAtForB) {
                            return 1;
                        }
                        return 0;
                    });
            }
            setDisplayIdeas(sortedIdeas);
        } else {
            setDisplayIdeas(ideas);
        }
    }, [ideas, sortOption]);

    React.useEffect(() => {
        fetchAndSetIdeas();
    }, []);

    return (
        <ErrorBoundary>
            <Layout>
                <Select
                    className="sort-select"
                    options={selectOptions}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                    // @ts-ignore
                    value={sortOption}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                    // @ts-ignore
                    onChange={selectedOption => setSortOption(selectedOption.value)}
                />

                <IdeaContainer>
                    {displayIdeas.map(idea => (
                        <Tile
                            key={idea.id}
                            resetAddNew={() => setIsAddNew(false)}
                            deleteIdea={handleDeleteIdea}
                            handleUpdateIdea={handleUpdateIdea}
                            isNew={isAddNew && idea.id === activeIdea}
                            isActive={idea.id === activeIdea}
                            {...idea}
                        />
                    ))}
                </IdeaContainer>
                <Button className="add-new" onClick={handleAddNewIdea}>
                    Add New
                </Button>
                <Button className="reset" onClick={handleResetIdeas}>
                    Reset
                </Button>
            </Layout>
        </ErrorBoundary>
    );
};

export default Main;
