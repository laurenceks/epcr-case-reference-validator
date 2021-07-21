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
        //resize whenever the matches object is updated
        resizeUnderscore()
    }, [resultMatches]);
    useEffect(() => {
        //resize whenever the window resizes
        window.addEventListener("resize", (e) => {
            resizeUnderscore();
        })
        document.fonts.onloadingdone = () => {
            resizeUnderscore();
        };
    }, []);

    const resizeUnderscore = () => {
        if (resultStringRef.current) {
            let newUnderscoreDimensions = {
                top: `calc(${resultStringRef.current.offsetHeight}px + 1rem)`,
                width: resultStringRef.current.offsetWidth,
                opacity: 1
            }
            if (resultMatches.lastFour.match && resultStringRef.current.querySelector("div.lastFour")) {
                const w = resultStringRef.current.querySelector("div.lastFour").offsetWidth;
                newUnderscoreDimensions = {
                    ...newUnderscoreDimensions,
                    width: w,
                    left: resultStringRef.current.querySelector("div.lastFour").offsetLeft + (w / 2),
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
