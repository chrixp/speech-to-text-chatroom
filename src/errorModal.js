import React from 'react'
import styled from 'styled-components'
const Modal = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 10;
    top: 0;
    left: 0;
    background-color: rgba(0,0,0,0.5);
`

const ErrorContainer = styled.div`
    width: 500px;
    height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: white;
    padding: 1em;
    
`

const CloseButton = styled.button`
    width: 80px;
    height: 30px;
    border-radius: 10px;
    margin-top: 1em;
    border: 0;
    color: white;
    background-color: #ED4337;
    &:hover {
        cursor: pointer;
    }
`

const Error = styled.span`
    font-size: 1.5em;
    color: black;
`

const ModalError = (props) => (
    props.error &&
    <Modal>
        <ErrorContainer>
            <Error>{props.error}</Error>
            <CloseButton onClick={props.close}>Retry</CloseButton>
        </ErrorContainer>
    </Modal>
)

export default ModalError