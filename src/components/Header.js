const Header = props => {
    return (
        <div className="headerWrap w-100 text-center px-2 px-sm-3 px-md-5 position-relative">
            <div className="header bg"/>
            <div className="headerWrap bg"/>
            <div className="header mx-auto position-relative">
                <h1 className={"mt-5 mb-3"}>ePCR Case Reference Validator</h1>
                <p className={"my-3"}>This is a simple tool for validating ePCR case references</p>
            </div>
        </div>
    );
};

export default Header;
