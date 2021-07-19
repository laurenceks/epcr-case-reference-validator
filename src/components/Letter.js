import PropTypes from 'prop-types';

const Letter = ({character, showCaret, borderClass, colourClass}) => {
        return (
            <div className={`letterWrap ${borderClass}`}>
                {showCaret && <div className={"letterCaret"}/>}
                <div className={`letter d-inline-block${showCaret ? ` letterMatch ${colourClass}` : ""}`}>
                    {character}
                </div>
            </div>);
    }
;

Letter.propTypes = {
    character: PropTypes.string,
    showCaret: PropTypes.bool,
    borderClass: PropTypes.string
};

export default Letter;
