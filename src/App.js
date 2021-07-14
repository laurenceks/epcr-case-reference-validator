import ReferenceInput from "./components/ReferenceInput";
import Header from "./components/Header";
import Results from "./components/Results";
import React, {useEffect, useState} from "react";

function App() {
    const [refString, setRefString] = useState("");
    const [referenceValidity, setReferenceValidity] = useState(null);
    const [validitySubtext, setValiditySubtext] = useState(null);
    const [resultMatches, setResultMatches] = useState(null);
    const [hasBeenEnteredOnce, setHasBeenEnteredOnce] = useState(false);

    useEffect(() => {
        const query = new URLSearchParams(window.location.search).get("ref");
        if (query) {
            setHasBeenEnteredOnce(true)
            setRefString(query.length > 12 ? query.substr(0, 12) : query);
        } else {
            window.history.replaceState(null, null, "/");
        }
    }, []);

    useEffect(() => {
        if (hasBeenEnteredOnce || (!hasBeenEnteredOnce && refString.length === 12)) {
            //a full string has been entered at least once, so show results
            let finalValidity = null;
            let finalSubtext = null;
            let finalResultMatches = {
                length: {
                    match: false,
                    text: "",
                },
                lastFour: {
                    match: false,
                    text: ""
                },
                individualCharacters: {},
                replacements: [],
                showUnderscore: false
            }
            //tests
            //first - is it valid?
            const validRegEx = /^[A-Z][A-Z0-9]{7}\d{4}$/
            const letterLikeRegEx = /[015OIS]/;
            const findLetterLike = (x, i) => {
                if (letterLikeRegEx.test(x)) {
                    finalResultMatches.individualCharacters[i] = {match: x, i: i}
                }
            }
            if (refString.length >= 1) {
                if (validRegEx.test(refString)) {
                    //valid reference!
                    //check if ambiguous
                    if (letterLikeRegEx.test(refString.substr(0, 8))) {
                        finalValidity = "warning"
                        refString.substr(0, 8).split("").forEach(findLetterLike)
                        //create recommendations
                        const substitutionMap = {
                            0: [0, "O"],
                            1: [1, "I"],
                            5: [5, "S"],
                            O: ["O", 0],
                            I: ["I", 1],
                            S: ["S", 5]
                        }
                        const cartesianArray = refString.substr(0, 8).split("").map((x) => {
                            return substitutionMap[x] ? substitutionMap[x] : [x]
                        })
                        const cartesian = (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));
                        finalResultMatches.replacements = cartesian(...cartesianArray).map((x) => {
                            return x.join("")
                        });
                    } else if (refString.substr(8, 4) === "0000") {
                        finalValidity = "warning"
                        finalSubtext = "This case reference ends in 0000 which means it was created offline - contact epcr@secamb.nhs.uk to confirm it was merged"
                        finalResultMatches.lastFour = {match: true, text: "Ends in 0000"}
                        finalResultMatches.showUnderscore = true
                    } else {
                        finalValidity = "valid";
                    }
                } else {
                    finalValidity = "invalid";
                    if (refString.length < 12) {
                        finalSubtext = "Case references must be 12 digits long"
                        finalResultMatches.length = {
                            match: true,
                            text: `Only ${refString.length} character${refString.length > 1 ? "s" : ""}`
                        }
                        finalResultMatches.showUnderscore = true
                    } else if (!/^[A-Z]/.test(refString)) {
                        finalSubtext = "Case references must start with a letter"
                        finalResultMatches.individualCharacters[0] = {i: 0, type: "firstLetter"}
                    } else if (!/^\d{4}$/.test(refString.substr(8, 4))) {
                        finalSubtext = "Case references must end in four digits"
                        finalResultMatches.lastFour = {match: true, text: `Ends in ${refString.substr(8, 4)}`}
                        refString.substr(8, 4).split("").forEach((x, i) => {
                            if (/[A-Z]/.test(x)) {
                                finalResultMatches.individualCharacters[i + 8] = {match: x, i: (i + 8)}
                            }
                        })
                        finalResultMatches.showUnderscore = true
                    }
                }
            }
            setReferenceValidity(finalValidity);
            setValiditySubtext(finalSubtext);
            setResultMatches(finalResultMatches);
        } else if (!hasBeenEnteredOnce && refString.length === 12) {
            setHasBeenEnteredOnce(true);
        }

    }, [refString]);

    return (
        <div className={"pageWrap"}>
            <div className={"pageWrapBg"}/>
            <Header/>
            <div className="mainWrap container-fluid d-flex flex-column justify-content-center px-5">
                <div className="row justify-content-center">
                    <ReferenceInput refString={refString} onChange={setRefString}/></div>
                <div className="row justify-content-center mb-5">
                    {referenceValidity && <Results refString={refString} referenceValidity={referenceValidity}
                                                   validitySubtext={validitySubtext} resultMatches={resultMatches}/>}
                </div>
            </div>
        </div>
    );
}

export default App;
