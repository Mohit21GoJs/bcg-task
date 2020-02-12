import * as React from 'react';
import styled from '@emotion/styled';

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

const CardTitle = styled.h1`
    font-size: 24px;
    font-weight: bold;
    text-align: center;
`;

const CardBody = styled.div`
    padding-right: 32px;
    padding-left: 32px;
`;

const CardFooter = styled.div`
    color: grey;
    font-size: 10px;
    margin-top: auto;
`;

interface CardProps {
    title: string;
    body: string;
    createdAt: string;
}
const Tile: React.FC<CardProps> = ({ title, body, createdAt }) => {
    return (
        <CardWrapper>
            <CardTitle>{title}</CardTitle>
            <CardBody>{body}</CardBody>
            <CardFooter>{createdAt}</CardFooter>
        </CardWrapper>
    );
};

export default Tile;
