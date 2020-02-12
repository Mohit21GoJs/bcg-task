import * as React from 'react';
import styled from '@emotion/styled';
import { getIdeas, getNewIdea } from './helpers/api';
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
`;
const Main: React.FC = () => {
    const [ideas, setIdeas] = React.useState([]);
    const [activeIdea, setActiveIdea] = React.useState('');
    async function fetchAndSetIdeas(): Promise<void> {
        const ideas = await getIdeas();
        setIdeas(ideas);
    }

    const handleAddNewIdea = React.useCallback(async () => {
        const idea = await getNewIdea();
        setActiveIdea(idea.id);
        setIdeas(ideas => [...ideas, ...[idea]]);
    }, []);

    React.useEffect(() => {
        fetchAndSetIdeas();
    }, []);
    return (
        <Layout>
            <IdeaContainer>
                {ideas.map(idea => (
                    <Tile key={idea.id} {...idea} />
                ))}
            </IdeaContainer>
            <Button className="add-new" onClick={handleAddNewIdea}>
                Add New
            </Button>
        </Layout>
    );
};

export default Main;
