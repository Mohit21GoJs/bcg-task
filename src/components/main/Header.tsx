import styled from 'styled-components';

const Header = styled.header`
    display: flex;
    justify-content: space-between;
    min-height: 70px;
    align-items: center;
    background-color: whitesmoke;
    margin-bottom: 20px;
    margin-right: 10px;
    padding-left: 20px;
    & .heading {
        font-style: italic;
        flex-grow: 1;
    }
    & .add-new {
        background-color: green;
        flex-grow: 1;
        width: 50px;
    }
    & .sort {
        & .select {
            width: 60%;
        }
        flex-grow: 2;
    }
`;

export default Header;
