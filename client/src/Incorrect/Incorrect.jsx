import React from "react";
import "./Incorrect.css";
const Incorrect = ({ type }) => {
	return (
		<div className={"incorrect"}>
			{type === "name" ? (
				<h1>Empty name!</h1>
			) : type === "surname" ? (
				<h1>Empty surname!</h1>
			) : type == "email" ? (
				<h1>Email should be validated!</h1>
			) : (
				<h1>Message cannot be empty!</h1>
			)}
		</div>
	);
};

export default Incorrect;
