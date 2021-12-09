import React from "react";
import "./Modal.css";

const ModalForInfo = ({ children, isOpen, setIsOpen }) => {
	const buttonOkOnClick = (event) => {
		event.preventDefault();
		setIsOpen(false);
	};

	const classes = ["Modal"];
	if (isOpen) {
		classes.push("modal-active");
	}
	return (
		<div className={classes.join(" ")} onClick={() => setIsOpen(false)}>
			<div className={"modal-content"} onClick={(event) => event.stopPropagation()}>
				{children}
				<button onClick={buttonOkOnClick}>Ok</button>
			</div>
		</div>
	);
};

export default ModalForInfo;
