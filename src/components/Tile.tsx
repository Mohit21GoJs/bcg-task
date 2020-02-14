import * as React from 'react';
import styled from 'styled-components';
import { string, bool, func } from 'prop-types';
import dayjs from 'dayjs';
import { useFocus } from '../helpers/hooks';

const CardWrapper = styled.div`
    overflow: hidden;
    padding: 10px;
    margin: 10px;
    width: 150px;
    height: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 10px 10px 20px #aaaaaa;
    border-radius: 5px;
    textarea:focus,
    &:hover {
        transform: translate(5px, 5px);
    }
    input:focus {
        outline: none;
    }
`;

const CardTitle = styled.div`
    font-size: 24px;
    font-weight: bold;
    max-width: 100%;
    input {
        text-align: center;
        border: hidden;
        width: 90%;
        font-size: 1em;
        &:focus {
            border-style: solid;
            border-color: #d3d3d3;
        }
    }
    .delete {
        cursor: pointer;
    }
`;

const CardBody = styled.div`
    width: 100%;
    min-height: 50px;
    textarea {
        border: hidden;
        width: 90%;
        height: 50px;
        resize: none;
        &:focus {
            border-style: solid;
            border-color: #d3d3d3;
        }
    }
`;

const CardFooter = styled.div`
    color: grey;
    font-size: 10px;
    margin-top: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
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
    const [formStates, setFormStates] = React.useState({
        title: 'read',
        body: 'read',
    });
    const [cardTitle, setCardTitle] = React.useState(title);
    const [cardBody, setCardBody] = React.useState(body);
    const remainingBodyChars = MAXBODYLEN - cardBody.length;
    React.useEffect(() => {
        if (isNew) {
            setTitleFocus();
            resetAddNew();
        }
    }, [isNew]);
    // Sync value coming from parent
    React.useEffect(() => {
        setCardTitle(title);
    }, [title]);
    React.useEffect(() => {
        setCardBody(body);
    }, [body]);
    return (
        <CardWrapper onMouseEnter={() => setIsDeleteShown(true)} onMouseLeave={() => setIsDeleteShown(false)}>
            <CardTitle>
                <input
                    className="title"
                    value={cardTitle}
                    ref={titleRef}
                    onFocus={() =>
                        setFormStates(modes => ({
                            ...modes,
                            title: 'edit',
                        }))
                    }
                    onChange={e => setCardTitle(e.target.value)}
                    onBlur={(): void => {
                        setFormStates(modes => ({
                            ...modes,
                            title: 'read',
                        }));
                        if (title !== cardTitle) {
                            handleUpdateIdea(id, {
                                title: cardTitle,
                            });
                        }
                    }}
                />
            </CardTitle>
            <CardBody>
                <textarea
                    value={cardBody}
                    maxLength={MAXBODYLEN}
                    onFocus={() =>
                        setFormStates(modes => ({
                            ...modes,
                            body: 'edit',
                        }))
                    }
                    onChange={e => setCardBody(e.target.value)}
                    onBlur={() => {
                        setFormStates(modes => ({
                            ...modes,
                            body: 'read',
                        }));
                        if (body !== cardBody) {
                            handleUpdateIdea(id, {
                                body: cardBody,
                            });
                        }
                    }}
                />
                {formStates.body === 'edit' && remainingBodyChars < LIMITFORCOUNTER && (
                    <div>Remaining: {remainingBodyChars}</div>
                )}
            </CardBody>
            <CardFooter>
                <div>
                    {isDeleteShown && <i className="delete fa fa-times-circle fa-3x" onClick={() => deleteIdea(id)} />}
                </div>
                <div>{dayjs(createdAt).format('DD/MM/YYYY HH:mm:ss SSS')}</div>
            </CardFooter>
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
