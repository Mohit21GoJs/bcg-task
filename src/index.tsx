import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface HelloProps {
    compiler: string;
    framework: string;
}

const Hello = (props: HelloProps) => (
    <h1>
        Hello from inside{props.compiler} and {props.framework}!
    </h1>
);

ReactDOM.render(<Hello compiler="TypeScript" framework="React" />, document.getElementById('content'));
