import PropTypes from 'prop-types';
import {useEffect, useRef} from "react";
import Letter from "./Letter";

const ResultString = ({
                          referenceValidity,
                          resultString,
                          styleMap,
                          resultMatches,
                          setUnderScoreDimensions,
                          letterToSpan
                      }) => {

    const resultStringRef = useRef(null);

    useEffect(() => {
        resizeUnderscore()
    }, [resultString, resultMatches, setUnderScoreDimensions]);
    useEffect(() => {
        window.addEventListener("resize", (e) => {
            resizeUnderscore();
        })
    }, []);

    const resizeUnderscore = () => {
        if (resultStringRef.current) {
            let newUnderscoreDimensions = {
                top: `calc(${resultStringRef.current.offsetHeight}px + 1rem)`,
                width: resultStringRef.current.offsetWidth,
                // left: resultStringRef.current.offsetLeft,
            }
            if (resultMatches.lastFour.match && resultStringRef.current.querySelector("div.lastFour")) {
                newUnderscoreDimensions = {
                    ...newUnderscoreDimensions,
                    width: resultStringRef.current.querySelector("div.lastFour").offsetWidth,
                    left: resultStringRef.current.querySelector("div.lastFour").offsetLeft,
                    transform: "none"
                }
            }
            setUnderScoreDimensions(newUnderscoreDimensions)
        }
    }

    const rl = resultString.length;
    return (
        <div className={`resultString d-flex justify-content-center ${styleMap[referenceValidity].colourClass}`}>
            <div ref={resultStringRef}>
                {resultString.substr(0, rl < 12 ? 11 : resultString.length - 4).split("").map((x, i) => {
                    return <Letter key={`${x}-${i}`} character={x}
                                   showCaret={Boolean(resultMatches.individualCharacters[i])}
                                   borderClass={styleMap[referenceValidity].borderClass}/>;
                })}
                {rl === 12 &&
                <div className={"lastFour d-inline-block"}>
                    {resultString.substr(8, 4).split("").map((x, i) => {
                        return <Letter key={`${x}-${i}`} character={x}
                                       showCaret={Boolean(resultMatches.individualCharacters[i + 8])}
                                       borderClass={styleMap[referenceValidity].borderClass}/>;
                    })}
                </div>
                }
            </div>
        </div>
    );
}

ResultString.propTypes =
    {
        refString: PropTypes.string,
        referenceValidity: PropTypes.string
    }

export default ResultString;
