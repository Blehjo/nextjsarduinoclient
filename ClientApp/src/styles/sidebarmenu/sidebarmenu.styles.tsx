import styled from 'styled-components';

export const SidebarMenuContainer = styled.div`
    display: flex;
    font-size: 15px;
    width: 16rem;
    color: white; 
    height: 100%;
    overflow-y: auto;
    padding-top: 4rem; 
    overflow-x: hidden;
    border: 3px solid white;
    border-radius: 5px;
    padding-bottom: 8rem;
    .ms-4:hover {
        color: gray;
    }
    .icons:hover {
        color: gray;
    }
`;