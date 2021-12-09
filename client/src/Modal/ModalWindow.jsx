import React from 'react';
import './Modal.css';
const ModalWindow = ({ children, modalIsOpen, setModalIsOpen, submitHandler, submitEvent }) => {
    const buttonConfirmOnClick = (event) => {
        event.preventDefault();
        submitHandler(submitEvent);
        setModalIsOpen(false);
    };

    const buttonNotNowOnClick = (event) => {
        event.preventDefault();
        setModalIsOpen(false);
    };

    const classes = ['Modal'];
    if (modalIsOpen) {
        classes.push('modal-active');
    }
    return (
        <div className={classes.join(' ')} onClick={() => setModalIsOpen(false)}>
            <div className={'modal-content'} onClick={(event) => event.stopPropagation()}>
                {children}
                <div className={'button-group'}>
                    <button onClick={buttonConfirmOnClick}>Yes</button>
                    <button onClick={buttonNotNowOnClick}>Not now</button>
                </div>
            </div>
        </div>
    );
};

export default ModalWindow;
