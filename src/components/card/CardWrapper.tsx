import styled from 'styled-components';

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

export default CardWrapper;
