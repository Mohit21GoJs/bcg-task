import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ErrorBoundary from './components/ErrorBoundary';
import { IdeaContextProvider } from './contexts/idea';

const Main = React.lazy(() => import('./main'));
ReactDOM.render(
    <React.Suspense fallback={<h1>Loading data...</h1>}>
        <ErrorBoundary>
            <IdeaContextProvider>
                <Main />
            </IdeaContextProvider>
        </ErrorBoundary>
    </React.Suspense>,
    document.getElementById('content'),
);
