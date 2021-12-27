import "./App.css";
import React, { useState } from "react";
import Header from "../Header/Header.jsx";
import ModalWindow from "../Modal/ModalWindow.jsx";
import Incorrect from "../Incorrect/Incorrect.jsx";
import Loader from "../Loader/Loader.jsx";
import ModalForInfo from "../Modal/ModalForInfo.jsx";

function App() {
    const [yourName, setYourName] = useState("");
    const [yourSurname, setYourSurname] = useState("");
    const [text, setText] = useState("");
    const [confirmIsOpen, setConfirmIsOpen] = useState(false);
    const [submitEvent, setSubmitEvent] = useState({});
    const [buttonsDisabled, setButtonsDisabled] = useState(false); //during waiting for server response
    const [modalForInfoIsOpen, setModalForInfoIsOpen] = useState(false);
    const [infoText, setInfoText] = useState("");

    function textValidator(string) {
        //if not empty => so good:)
        return string.length;
    }

    const inputNameOnChange = (event) => {
        event.preventDefault();
        setYourName(event.target.value);
        setNameValidated(textValidator(event.target.value));
    };

    const inputSurnameOnChange = (event) => {
        event.preventDefault();
        setYourSurname(event.target.value);
        setSurnameValidated(textValidator(event.target.value));
    };

    const textareaOnChange = (event) => {
        event.preventDefault();
        setText(event.target.value);
        setTextValidated(textValidator(event.target.value));
    };

    const buttonSendOnClick = (event) => {
        event.preventDefault();
        if (yourName.length && yourSurname.length && text.length) {
            setSubmitEvent(event);
            setConfirmIsOpen(true);
        } else {
            setInfoText("You have to validate form before sending email");
            setModalForInfoIsOpen(true);
        }
    };

    const buttonResetOnClick = (event) => {
        event.preventDefault();
        setYourSurname("");
        setText("");
        setYourName("");
    };

    function onSubmitHandler(event) {
        event.preventDefault();
        setYourSurname("");
        setText("");
        setYourName("");
        setButtonsDisabled(true);
        setLoaderIsVisible(true);
        fetch("/send_info", {
            method: "POST",
            headers: new Headers({
                "Content-Type": "application/json",
            }),
            body: JSON.stringify({
                name: yourName,
                surname: yourSurname,
                text: text,
            }),
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (body) {
                setButtonsDisabled(false);
                setLoaderIsVisible(false);
                if (body.permission === "no") {
                    setInfoText(
                        "You cannot write a new letter more the 1 time per 30 sec. Try later."
                    );
                    setModalForInfoIsOpen(true);
                    return;
                }
                if (body.sent) {
                    setInfoText("Your letter was sent.");
                    setModalForInfoIsOpen(true);
                    return;
                }
                if (!body.sent) {
                    setInfoText(
                        "You cannot write a new letter more the 1 time per 30 sec. Try later."
                    );
                    setModalForInfoIsOpen(true);
                    return;
                }
            })
            .catch((error) => {
                setInfoText("Something went wrong with server...\n Try later\n" + error);
                setLoaderIsVisible(false);
                setModalForInfoIsOpen(true);
            });
    }

    //validation
    const [nameValidated, setNameValidated] = useState(false);
    const [surnameValidated, setSurnameValidated] = useState(false);
    const [textValidated, setTextValidated] = useState(false);
    const [loaderIsVisible, setLoaderIsVisible] = useState(false);

    return (
        <form onSubmit={onSubmitHandler} className="App" id="myForm">
            <Loader visible={loaderIsVisible} />
            <Header />
            <ModalWindow
                modalIsOpen={confirmIsOpen}
                setModalIsOpen={setConfirmIsOpen}
                submitHandler={onSubmitHandler}
                submitEvent={submitEvent}
            >
                <h1>Do you want to send this e-mail?</h1>
            </ModalWindow>

            <ModalForInfo isOpen={modalForInfoIsOpen} setIsOpen={setModalForInfoIsOpen}>
                <h1>{infoText}</h1>
            </ModalForInfo>
            <input
                type={"text"}
                value={yourName}
                placeholder={"your name"}
                onChange={inputNameOnChange}
            />
            {!nameValidated && <Incorrect type={"name"} />}

            <input
                type={"text"}
                value={yourSurname}
                placeholder={"your surname"}
                onChange={inputSurnameOnChange}
            />
            {!surnameValidated && <Incorrect type={"surname"} />}

            <textarea value={text} maxLength={500} onChange={textareaOnChange} />
            {!textValidated && <Incorrect type={"text"} />}
            <button disabled={buttonsDisabled} type={"submit"} onClick={buttonSendOnClick}>
                Send!
            </button>

            <button disabled={buttonsDisabled} type={"reset"} onClick={buttonResetOnClick}>
                Cancel!
            </button>
        </form>
    );
}

export default App;
