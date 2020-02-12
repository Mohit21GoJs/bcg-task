import * as React from 'react';
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
    const [activeIdea, setActiveIdea] = React.useState('');
    const [isAddNew, setIsAddNew] = React.useState(false);
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
        payload => async () => {
            await updateIdea(activeIdea, payload);
            fetchAndSetIdeas();
        },
        [activeIdea],
    );

    const handleDeleteIdea = React.useCallback(async () => {
        await deleteIdea(activeIdea);
        fetchAndSetIdeas();
    }, [activeIdea]);

    React.useEffect(() => {
        fetchAndSetIdeas();
    }, []);
    return (
        <Layout>
            <IdeaContainer>
                {ideas.map(idea => (
                    <div
                        key={idea.id}
                        onMouseEnter={() => {
                            setIsAddNew(false);
                            setActiveIdea(idea.id);
                        }}
                        onMouseLeave={() => {
                            setActiveIdea('');
                        }}
                    >
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
