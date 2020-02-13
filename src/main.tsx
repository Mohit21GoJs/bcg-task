import * as React from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import Tile from './components/Tile';
import Button from './components/Button';
import { useIdeaContext } from './contexts/idea';

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
    const { ideas, addNewIdea, updateIdeaById, deleteIdeaById } = useIdeaContext();
    const [displayIdeas, setDisplayIdeas] = React.useState(ideas);
    const [activeIdea, setActiveIdea] = React.useState('');
    const [isAddNew, setIsAddNew] = React.useState(false);
    const [sortOption, setSortOption] = React.useState('');

    const handleAddNewIdea = React.useCallback(async () => {
        try {
            const idea = await addNewIdea();
            setActiveIdea(idea.id);
            setIsAddNew(true);
        } catch (e) {
            toast.error('Some Error Occured while adding new card');
        }
    }, [addNewIdea, setActiveIdea, setIsAddNew]);

    const handleUpdateIdea = React.useCallback(
        async (id, payload) => {
            try {
                await updateIdeaById(id, payload);
                setActiveIdea(id);
                toast.success('Idea Updated');
            } catch (e) {
                toast.error('Some Error Occured while updating');
            }
        },
        [setActiveIdea, updateIdeaById],
    );

    const handleDeleteIdea = React.useCallback(
        async id => {
            try {
                await deleteIdeaById(id);
                setActiveIdea(id);
                toast.success('Idea Deleted');
            } catch (e) {
                toast.error('Some Error Occured while deleting');
            }
        },
        [deleteIdeaById, setActiveIdea],
    );

    React.useEffect(() => {
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

    return (
        <Layout>
            <Select
                className="sort-select"
                options={selectOptions}
                onChange={selectedOption => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                    // @ts-ignore
                    setSortOption(selectedOption.value);
                }}
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
        </Layout>
    );
};

export default Main;
