import React from 'react';
import './Button.scss';
import { Link } from "react-router-dom";

const Button = {};

Button.button = function(props) {
    return (
        <div className="action-button" x-name={props.name} id={props.id} onClick={props.action}
        style={props.style}
        >
            <div className="button-text" x-name={props.name}>
                {props.name}
            </div>
        </div>
    );
};

Button.submit = function(props) {
    return (
        <button className="submit-button" type={"submit"}>
            {props.name}
        </button>
    );
};

Button.location = function(props) {
    return (
        <div className="location-button">
            <Link to={props.url}>
                <div className="button-text">
                    {props.name}
                </div>
            </Link>
        </div>
    );
};

export default Button;
