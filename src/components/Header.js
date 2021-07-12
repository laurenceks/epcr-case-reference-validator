import React from 'react';
import PropTypes from 'prop-types';

const Header = props => {
    return (
        <div className="headerWrap w-100 text-center p-5">
            <div className="header mx-auto">
                <h1 className={"my-3"}>ePCR Case Reference Validator</h1>
                <p className={"my-3"}>This is a simple tool for validating ePCR case references</p>
            </div>
            <div className="header bg"/>
        </div>
    );
};

Header.propTypes = {};

export default Header;
