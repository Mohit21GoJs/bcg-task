import * as React from 'react';

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

export { useFocus };

export default { useFocus };
