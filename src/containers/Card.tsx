import * as React from 'react';
import { string, bool, func } from 'prop-types';
import dayjs from 'dayjs';
import { useFocus } from '../helpers/hooks';
import CardWrapper from '../components/card/CardWrapper';
import CardBody from '../components/card/CardBody';
import CardTitle from '../components/card/CardTitle';
import CardFooter from '../components/card/CardFooter';
import { CardProps, FormStates } from './types/Card';

const MAXBODYLEN = 140;
const LIMITFORCOUNTER = 15;
const Card: React.FC<CardProps> = ({
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
    const [formStates, setFormStates] = React.useState<{ title?: FormStates; body?: FormStates }>({
        title: 'read',
        body: 'read',
    });
    const [formData, setFormData] = React.useState<{ title?: string; body?: string }>({
        title,
        body,
    });
    const handleInputChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(data => ({ ...data, [name]: value }));
    }, []);
    // derived params to lookup once per render
    const { body: cardBody, title: cardTitle } = formData;
    const remainingBodyChars = MAXBODYLEN - cardBody.length;
    React.useEffect(() => {
        if (isNew) {
            setTitleFocus();
            resetAddNew();
        }
    }, [isNew]);
    // Sync value coming from parent
    React.useEffect(() => {
        setFormData(data => ({
            ...data,
            title,
        }));
    }, [title]);
    React.useEffect(() => {
        setFormData(data => ({
            ...data,
            body,
        }));
    }, [body]);
    return (
        <CardWrapper
            onMouseOver={(): void => setIsDeleteShown(true)}
            onMouseLeave={(): void => setIsDeleteShown(false)}
        >
            <CardTitle>
                <input
                    name="title"
                    className={`${formStates.title === 'edit' ? 'title title-edit' : 'title title-read'}`}
                    value={cardTitle}
                    ref={titleRef}
                    onFocus={({ target: { name } }): void => setFormStates(data => ({ ...data, [name]: 'edit' }))}
                    onChange={handleInputChange}
                    onBlur={({ target: { name } }): void => {
                        setFormStates(data => ({ ...data, [name]: 'read' }));
                        if (title !== cardTitle) {
                            handleUpdateIdea(id, {
                                [name]: cardTitle,
                            });
                        }
                    }}
                />
            </CardTitle>
            <CardBody>
                <textarea
                    name="body"
                    value={cardBody}
                    className={`${formStates.body === 'edit' ? 'body body-edit' : 'body body-read'}`}
                    maxLength={MAXBODYLEN}
                    onFocus={({ target: { name } }): void => setFormStates(data => ({ ...data, [name]: 'edit' }))}
                    onChange={handleInputChange}
                    onBlur={({ target: { name } }): void => {
                        setFormStates(data => ({ ...data, [name]: 'read' }));
                        if (body !== cardBody) {
                            handleUpdateIdea(id, {
                                [name]: cardBody,
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
                <div>
                    {isDeleteShown && <i className="delete fa fa-trash fa-2x" onClick={(): void => deleteIdea(id)} />}
                </div>
            </CardFooter>
        </CardWrapper>
    );
};

Card.propTypes = {
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

Card.defaultProps = {
    title: '',
    body: '',
    createdAt: '',
    isActive: false,
    isNew: false,
};

export default Card;
