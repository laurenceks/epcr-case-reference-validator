import PropTypes from 'prop-types';
import {FaCheckCircle, FaTimesCircle, FaExclamationCircle} from "react-icons/fa"
import ResultString from "./ResultString";
import {useRef, useState} from "react";

const Results = props => {
    const letterToSpan = (x, i, a, match = props.resultMatches.individualCharacters[i], key = null) => {
        return <span
            className={`letter${match ? ` letterMatch  ${styleMap[props.referenceValidity].borderClass}` : ""}`}
            key={key || i}>{x} {match && <span className={`letterCaret`}/>} </span>;
    }
    const styleMap = {
        "valid": {
            colourClass: "text-success",
            borderClass: "border-success",
            icon: FaCheckCircle,
            text: "Valid case reference",
            subtext: "Still having trouble? Contact epcr@secamb.nhs.uk for help"
        },
        "warning": {
            colourClass: "text-warning",
            borderClass: "border-warning",
            icon: FaExclamationCircle,
            text: "Ambiguous case reference",
            subtext: "The case reference is valid but may contain mistakes"
        },
        "invalid": {
            colourClass: "text-danger",
            borderClass: "border-danger",
            icon: FaTimesCircle,
            text: "Invalid case reference",
            subtext: "The case reference isn't valid, try fixing the below issues"
        }
    }

    const ResultIcon = styleMap[props.referenceValidity].icon;
    const [underScoreDimensions, setUnderScoreDimensions] = useState({
        top: 0,
        width: 0,
        left: 0
    });


    return (
        <div className="Results d-flex flex-column justify-content-center">
            <div className={`py-4 ${props.resultMatches.showUnderscore && "mb-5"} position-relative`}>
                <ResultString resultString={props.refString} referenceValidity={props.referenceValidity}
                              styleMap={styleMap} setUnderScoreDimensions={setUnderScoreDimensions}
                              letterToSpan={letterToSpan}
                              resultMatches={props.resultMatches}/>
                {props.resultMatches.showUnderscore &&
                <div className={`stringUnderscore ${styleMap[props.referenceValidity].borderClass}`}
                     style={underScoreDimensions}>
                    <div
                        className={`stringUnderscoreText ${styleMap[props.referenceValidity].colourClass}`}>{props.resultMatches.length.match ? props.resultMatches.length.text : props.resultMatches.lastFour.match ? props.resultMatches.lastFour.text : ""}</div>
                </div>}

            </div>
            <div className={`resultIcon ${styleMap[props.referenceValidity].colourClass}`}>
                <ResultIcon/>
            </div>
            <p className={`iconText text-center ${styleMap[props.referenceValidity].colourClass}`}>{styleMap[props.referenceValidity].text}</p>
            <p className="text-center">{props.validitySubtext || styleMap[props.referenceValidity].subtext}</p>
            <ul>
                {props.resultMatches.replacements.map((x) => {
                    return <li> {x.split("").map((y, i, a) => {
                        return letterToSpan(y, i, a, props.refString.charAt(i) !== y, `${x}-${y}-${i}`)
                    })}
                    </li>
                })}
            </ul>
        </div>
    );
};

Results.propTypes =
    {
        refString: PropTypes.string,
        referenceValidity
:
PropTypes.string
}
;

export default Results;
