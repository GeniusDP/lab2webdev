import React from "react";
import "./Loader.css";
import { Transition } from "react-transition-group";
const Loader = ({ visible }) => {
	return (
		<div className={visible ? "app visible" : "app"}>
			<div className={"wrap"}>
				<Transition in={visible} timeout={300}>
					{(state) => <div className={`circle ${state}`} />}
				</Transition>
			</div>
		</div>
	);
};

export default Loader;
