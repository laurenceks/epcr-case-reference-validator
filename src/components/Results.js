import PropTypes from 'prop-types';
import {FaCheckCircle, FaTimesCircle, FaExclamationCircle} from "react-icons/fa"
import ResultString from "./ResultString";
import {useState} from "react";
import Letter from "./Letter";

const Results = props => {
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
        width: 0,
        opacity: 0
    });

    return (
        <div className="d-flex flex-column justify-content-center">
            <div className={`resultsWrap py-4 ${props.resultMatches.showUnderscore && "mb-5"} position-relative`}>
                <ResultString resultString={props.refString} referenceValidity={props.referenceValidity}
                              styleMap={styleMap} setUnderScoreDimensions={setUnderScoreDimensions}
                              resultMatches={props.resultMatches}/>
                {props.resultMatches.showUnderscore &&
                <div className={`stringUnderscore ${styleMap[props.referenceValidity].borderClass}`}
                     style={underScoreDimensions}>
                    <div
                        className={`stringUnderscoreText ${styleMap[props.referenceValidity].colourClass}`}>{props.resultMatches.length.match ? props.resultMatches.length.text : props.resultMatches.lastFour.match ? props.resultMatches.lastFour.text : ""}</div>
                </div>}
            </div>
            <div className={`resultIcon mt-3 ${styleMap[props.referenceValidity].colourClass}`}>
                <ResultIcon/>
            </div>
            <p className={`iconText text-center ${styleMap[props.referenceValidity].colourClass}`}>{styleMap[props.referenceValidity].text}</p>
            <p className="text-center">{props.validitySubtext || styleMap[props.referenceValidity].subtext}</p>
            {props.resultMatches.replacements.length > 0 && <h2 className={"mt-5 mb-3 text-center"}>Try these alternatives</h2>}
            {props.resultMatches.replacements.map((x) => {
                const fullString = `${x}${props.refString.substr(8, 4)}`;
                if (fullString !== props.refString) {
                    return <div key={x} className={"resultString my-2"}>
                        {fullString.split("").map((y, i, a) => {
                            return <Letter key={`${x}-${y}-${i}`} showCaret={props.refString.charAt(i) !== y}
                                           borderClass={styleMap[props.referenceValidity].borderClass} character={y}
                                           colourClass={styleMap[props.referenceValidity].colourClass}
                            />
                        })}
                    </div>
                }
            })}
        </div>
    );
};

Results.propTypes =
    {
        refString: PropTypes.string,
        referenceValidity: PropTypes.string
    }

export default Results;
