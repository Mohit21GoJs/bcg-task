import * as React from 'react';
import * as orderBy from 'lodash/orderBy';
import styled from '@emotion/styled';
import { getIdeas, getNewIdea, resetIdeas, updateIdea, deleteIdea } from './helpers/api';
import Tile from './components/Tile';
import Button from './components/Button';

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
`;
const Main: React.FC = () => {
    const [ideas, setIdeas] = React.useState([]);
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
        setIdeas(ideas => [...ideas, ...[idea]]);
    }, []);

    const handleResetIdeas = React.useCallback(async () => {
        await resetIdeas();
        fetchAndSetIdeas();
    }, []);

    const handleUpdateIdea = React.useCallback(
        async (id, payload) => {
            setActiveIdea(id);
            await updateIdea(id, payload);
            fetchAndSetIdeas();
        },
        [setActiveIdea, updateIdea, fetchAndSetIdeas],
    );

    const handleDeleteIdea = React.useCallback(
        async id => {
            setActiveIdea(id);
            await deleteIdea(id);
            fetchAndSetIdeas();
        },
        [activeIdea, deleteIdea, fetchAndSetIdeas],
    );

    React.useEffect(() => {
        if (sortOption) {
            const newIdeas = orderBy(ideas, [sortOption]);
            debugger;
            setDisplayIdeas(newIdeas);
        } else {
            setDisplayIdeas(ideas);
        }
    }, [ideas, sortOption]);

    React.useEffect(() => {
        fetchAndSetIdeas();
    }, []);
    return (
        <Layout>
            <IdeaContainer>
                {displayIdeas.map(idea => (
                    <div key={idea.id}>
                        <Tile
                            deleteIdea={handleDeleteIdea}
                            handleUpdateIdea={handleUpdateIdea}
                            isNew={isAddNew && idea.id === activeIdea}
                            isActive={idea.id === activeIdea}
                            {...idea}
                        />
                    </div>
                ))}
            </IdeaContainer>
            <select onChange={e => setSortOption(e.target.value)}>
                <option value="">Unsorted</option>
                <option value="title">Title</option>
                <option value="createdAt">Created Date</option>
            </select>
            <Button className="add-new" onClick={handleAddNewIdea}>
                Add New
            </Button>
            <Button className="reset" onClick={handleResetIdeas}>
                Reset
            </Button>
        </Layout>
    );
};

export default Main;
