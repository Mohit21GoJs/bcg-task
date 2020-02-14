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
    .title-edit,
    .body-edit {
        border-style: solid;
        border-width: 5px;
        border-color: #d3d3d3;
        outline: none;
    }
    .body-read,
    .title-read {
        border: hidden;
    }
    .title-read {
        text-align: center;
        font-size: 1em;
        text-overflow: ellipsis;
    }
    &:hover {
        transform: translate(5px, 5px);
    }
`;

const CardTitle = styled.div`
    font-size: 24px;
    font-weight: bold;
    width: 100%;
    .title {
        width: 90%;
        resize: none;
    }
    .delete {
        cursor: pointer;
    }
`;

const CardBody = styled.div`
    width: 100%;
    min-height: 50px;
    .body {
        width: 90%;
        height: 50px;
        resize: none;
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
        <CardWrapper onMouseOver={() => setIsDeleteShown(true)} onMouseLeave={() => setIsDeleteShown(false)}>
            <CardTitle>
                <input
                    className={`${formStates.title === 'edit' ? 'title title-edit' : 'title title-read'}`}
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
                    className={`${formStates.body === 'edit' ? 'body body-edit' : 'body body-read'}`}
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
                <div>{dayjs(createdAt).format('DD/MM/YYYY HH:mm:ss')}</div>
                <div>{isDeleteShown && <i className="delete fa fa-trash fa-2x" onClick={() => deleteIdea(id)} />}</div>
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
