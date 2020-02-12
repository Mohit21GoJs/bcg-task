import * as React from 'react';
import styled from 'styled-components';
import { string, bool, func } from 'prop-types';
import Button from './Button';
import { useFocus } from '../helpers/hooks';

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

const CardTitle = styled.div`
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    max-width: 100%;
    & input:focus {
        background: red;
    }
`;

const CardBody = styled.div`
    width: 100%;
    min-height: 50px;
`;

const CardFooter = styled.div`
    color: grey;
    font-size: 10px;
    margin-top: auto;
`;
interface CardProps {
    id: string;
    title?: string;
    body?: string;
    createdAt?: string;
    isActive?: boolean;
    isNew?: boolean;
    handleUpdateIdea: (id: string, payload: {}) => void;
    deleteIdea: (id: string) => void;
    resetAddNew: () => void;
}

const MAXBODYLEN = 140;
const LIMITFORCOUNTER = 15;
const Tile: React.FC<CardProps> = ({
    title,
    body,
    createdAt,
    handleUpdateIdea,
    isNew,
    deleteIdea,
    id,
    resetAddNew,
}) => {
    const { htmlElRef: titleRef, setFocus: setTitleFocus } = useFocus();
    const [isDeleteShown, setIsDeleteShown] = React.useState(false);
    const [cardTitle, setCardTitle] = React.useState(title);
    const [cardBody, setCardBody] = React.useState(body);
    const remainingBodyChars = MAXBODYLEN - cardBody.length;
    React.useEffect(() => {
        if (isNew) {
            setTitleFocus();
            resetAddNew();
        }
    }, [isNew]);
    return (
        <CardWrapper onMouseEnter={() => setIsDeleteShown(true)} onMouseLeave={() => setIsDeleteShown(false)}>
            <CardTitle>
                <input
                    value={cardTitle}
                    ref={titleRef}
                    onChange={e => setCardTitle(e.target.value)}
                    onBlur={(): void =>
                        handleUpdateIdea(id, {
                            title: cardTitle,
                        })
                    }
                />
            </CardTitle>
            <CardBody>
                <textarea
                    value={cardBody}
                    maxLength={MAXBODYLEN}
                    onChange={e => setCardBody(e.target.value)}
                    onBlur={() =>
                        handleUpdateIdea(id, {
                            body: cardBody,
                        })
                    }
                />
                {remainingBodyChars < LIMITFORCOUNTER && <div>Remaining: {remainingBodyChars}</div>}
            </CardBody>
            <CardFooter>{createdAt}</CardFooter>
            {isDeleteShown && <Button onClick={() => deleteIdea(id)}>x</Button>}
        </CardWrapper>
    );
};

Tile.propTypes = {
    id: string.isRequired,
    title: string,
    body: string,
    createdAt: string,
    isActive: bool,
    isNew: bool,
    handleUpdateIdea: func.isRequired,
    deleteIdea: func.isRequired,
    resetAddNew: func.isRequired,
};

Tile.defaultProps = {
    title: '',
    body: '',
    createdAt: '',
    isActive: false,
    isNew: false,
};

export default Tile;