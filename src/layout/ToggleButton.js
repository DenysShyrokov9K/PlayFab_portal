import React from 'react';
import './Main.css'

const  ToggleButton = ({check}) => {
    return (
        <label className="switch">
            <input type="checkbox" onChange={() => check()}/>
            <span className="slider round"></span>
        </label>
    );
}

export default ToggleButton;