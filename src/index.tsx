import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Main from './main';
import ErrorBoundary from './components/ErrorBoundary';
import { IdeaContextProvider } from './contexts/idea';

ReactDOM.render(
    <ErrorBoundary>
        <IdeaContextProvider>
            <Main />
        </IdeaContextProvider>
    </ErrorBoundary>,
    document.getElementById('content'),
);
