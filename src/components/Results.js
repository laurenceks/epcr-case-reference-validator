import PropTypes from 'prop-types';
import {FaCheckCircle, FaTimesCircle, FaExclamationCircle} from "react-icons/fa"
import ResultString from "./ResultString";

const Results = props => {
    const styleMap = {
        "valid": {
            colourClass: "text-success",
            icon: FaCheckCircle,
            text: "Valid case reference",
            subtext: "Still having trouble? Contact epcr@secamb.nhs.uk for help"
        },
        "warning": {
            colourClass: "text-warning",
            icon: FaExclamationCircle,
            text: "Ambiguous case reference",
            subtext: "The case reference is valid but may contain mistakes"
        },
        "invalid": {
            colourClass: "text-danger",
            icon: FaTimesCircle,
            text: "Invalid case reference",
            subtext: "The case reference isn't valid, try fixing the below issues"
        }
    }

    const ResultIcon = styleMap[props.referenceValidity].icon

    return (
        <div className="Results d-flex flex-column justify-content-center">
            <ResultString resultString={props.refString} referenceValidity={props.referenceValidity}
                          styleMap={styleMap}/>
            <div className={`resultIcon ${styleMap[props.referenceValidity].colourClass}`}>
                <ResultIcon/>
            </div>
            <p className={`iconText text-center ${styleMap[props.referenceValidity].colourClass}`}>{styleMap[props.referenceValidity].text}</p>
            <p className="text-center">{props.validitySubtext || [props.referenceValidity].subtext}</p>
        </div>
    );
};

Results.propTypes = {
    refString: PropTypes.string,
    referenceValidity: PropTypes.string
};

export default Results;
