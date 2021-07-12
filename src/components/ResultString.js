import PropTypes from 'prop-types';

const ResultString = ({referenceValidity, resultString, styleMap}) => {

    //do something with the result string

    return (
        <div className={"py-4"}>
            {referenceValidity === "valid" ? <p className={`resultString ${styleMap[referenceValidity].colourClass}`}>{resultString}</p> :
                //split string and identify problem areas
                <p className={`resultString ${styleMap[referenceValidity].colourClass}`}>{resultString}</p>
            }
        </div>
    );
}

ResultString.propTypes = {
    refString: PropTypes.string,
    referenceValidity: PropTypes.string
};

export default ResultString;
