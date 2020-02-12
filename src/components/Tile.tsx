import * as React from 'react';
import styled from '@emotion/styled';
import Button from './Button';

const CardWrapper = styled.div`
    overflow: hidden;
    padding: 0 0 32px;
    margin: 10px;
    width: 150px;
    height: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: Quicksand, arial, sans-serif;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.05), 0 0px 40px rgba(0, 0, 0, 0.08);
    border-radius: 5px;
`;

const CardTitle = styled.input`
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    max-width: 100%;
    &:focus {
        background: red;
    }
`;

const CardBody = styled.textarea`
    width: 100%;
    min-height: 50px;
`;

const CardFooter = styled.div`
    color: grey;
    font-size: 10px;
    margin-top: auto;
`;

interface CardProps {
    title: string;
    body: string;
    createdAt: string;
    isActive: boolean;
    isNew: boolean;
    handleUpdateIdea: ({}) => any;
    deleteIdea: ({}) => any;
}

const useFocus = () => {
    const htmlElRef = React.useRef(null);
    const setFocus = () => {
        htmlElRef.current && htmlElRef.current.focus();
    };
    return {
        htmlElRef,
        setFocus,
    };
};

const Tile: React.FC<CardProps> = ({ title, body, isActive, createdAt, handleUpdateIdea, isNew, deleteIdea }) => {
    const { htmlElRef: titleRef, setFocus: setTitleFocus } = useFocus();
    const [cardTitle, setCardTitle] = React.useState(title);
    const [cardBody, setCardBody] = React.useState(body);
    React.useEffect(() => {
        if (isNew) {
            setTitleFocus();
        }
    }, [isNew]);
    return (
        <CardWrapper>
            <CardTitle
                value={cardTitle}
                ref={titleRef}
                onChange={e => setCardTitle(e.target.value)}
                onBlur={handleUpdateIdea({
                    title: cardTitle,
                })}
            />
            <CardBody
                value={cardBody}
                onChange={e => setCardBody(e.target.value)}
                onBlur={handleUpdateIdea({
                    body: cardBody,
                })}
            />
            <CardFooter>{createdAt}</CardFooter>
            {isActive && <Button onClick={deleteIdea}>Reset</Button>}
        </CardWrapper>
    );
};

export default Tile;
