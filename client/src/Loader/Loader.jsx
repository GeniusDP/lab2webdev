import React from "react";
import "./Loader.css";
import { Transition } from "react-transition-group";
const Loader = ({ visible }) => {
    const classArray = ["app"];
    if (visible) classArray.push("visible");
    return (
        <div className={classArray.join(" ")}>
            <div className={"wrap"}>
                <Transition in={visible} timeout={300}>
                    {(state) => <div className={`circle ${state}`} />}
                </Transition>
            </div>
        </div>
    );
};

export default Loader;
