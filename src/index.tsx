import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createGlobalStyle } from 'styled-components';
import ErrorBoundary from './components/ErrorBoundary';
import { IdeaContextProvider } from './contexts/idea';

const Main = React.lazy(() => import('./main'));

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: Arial,Helvetica Neue,Helvetica,sans-serif; 
  }
`;
ReactDOM.render(
    <React.Suspense fallback={<h1>Loading data...</h1>}>
        <GlobalStyle />
        <ErrorBoundary>
            <IdeaContextProvider>
                <Main />
            </IdeaContextProvider>
        </ErrorBoundary>
    </React.Suspense>,
    document.getElementById('content'),
);
