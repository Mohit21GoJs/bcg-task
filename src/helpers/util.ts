import { Idea } from './api';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

function getDisplayIdeas(ideas: Idea[], sortOption: string): Idea[] {
    const sortedIdeas = [...ideas];
    if (sortOption) {
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
                break;
            default:
            // do nothing
        }
    }
    return sortedIdeas;
}

export { noop, getDisplayIdeas };
