import PropTypes from 'prop-types';
import {useEffect, useRef, useState} from "react";
import {logDOM} from "@testing-library/react";

const ResultString = ({referenceValidity, resultString, styleMap, resultMatches, setUnderScoreDimensions}) => {

    const resultStringRef = useRef();

    useEffect(() => {
        let newUnderscoreDimensions = {
            top: `calc(${resultStringRef.current.offsetHeight}px + 1rem)`,
            width: resultStringRef.current.offsetWidth,
            left: resultStringRef.current.offsetLeft
        }
        if (resultMatches.lastFour.match && resultStringRef.current.querySelector("span.lastFour")) {
            newUnderscoreDimensions.width = resultStringRef.current.querySelector("span.lastFour").offsetWidth;
            newUnderscoreDimensions.left = resultStringRef.current.querySelector("span.lastFour").offsetLeft;
        }

        setUnderScoreDimensions(newUnderscoreDimensions)

    }, [resultString, resultMatches, setUnderScoreDimensions]);

    const rl = resultString.length;

    const letterToSpan = (x, i) => {
        return <span className={`letter${resultMatches.individualCharacters[i] ? ` letterMatch  ${styleMap[referenceValidity].borderClass}` : ""}`}
                     key={i}>{x} {resultMatches.individualCharacters[i] && <span className={`letterCaret`}/>} </span>;
    }

    return (
        <p className={`resultString ${styleMap[referenceValidity].colourClass}`}>
                <span ref={resultStringRef}>
                {rl < 12 ? resultString.substr(0, 11).split("").map(letterToSpan) : resultString.substr(0, resultString.length - 4).split("").map(letterToSpan)}
                    {rl === 12 &&
                    <span className={"lastFour"}>
                            {resultString.substr(8, 4).split("").map((x, i) => letterToSpan(x, i + 8))}
                        </span>
                    }
                </span>
        </p>
    );
}

ResultString.propTypes =
    {
        refString: PropTypes.string,
        referenceValidity: PropTypes.string
    }

export default ResultString;
