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
            if (query.length <= 12) {
                setRefString(query);
            } else {
                setRefString(query.substr(0, 12))
                window.history.replaceState(null, null, "?ref=" + query.substr(0, 12));
            }
        } else {
            window.history.replaceState(null, null, "/");
        }
        window.addEventListener("popstate", (e) => {
            const popstateQuery = new URLSearchParams(window.location.search).get("ref");
            if (popstateQuery.length > 0) {
                if (popstateQuery.length <= 12) {
                    setRefString(popstateQuery);
                } else {
                    setRefString(popstateQuery.substr(0, 12))
                    window.history.replaceState(null, null, "?ref=" + popstateQuery.substr(0, 12));
                }
            } else {
                setRefString("");
            }
        });
    }, []);

    useEffect(() => {
        if (hasBeenEnteredOnce || (!hasBeenEnteredOnce && refString.length === 12)) {
            if(!hasBeenEnteredOnce){
                //String has been entered at least once, so set to true if still false
                setHasBeenEnteredOnce(true);
            }
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
            const validRegEx = /^[A-Z][A-Z0-9]{7}\d{4}$/;
            const letterLikeRegEx = /[015OIS]/;
            const illegalCharacterTest = /[\W\s_]/;
            //Is it not blank?
            if (refString.length >= 1) {
                const lastFourCharacters = refString.substr(8, 4)
                //Is it valid?
                if (validRegEx.test(refString)) {
                    //Is it ambiguous?
                    if (letterLikeRegEx.test(refString.substr(0, 8))) {
                        finalValidity = "warning"
                        refString.substr(0, 8).split("").forEach((x, i) => {
                            if (letterLikeRegEx.test(x)) {
                                finalResultMatches.individualCharacters[i] = {match: x, i: i}
                            }
                        })
                        //Create recommendations
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
                    } else if (lastFourCharacters === "0000") {
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
                    } else if (illegalCharacterTest.test(refString)) {
                        refString.split("").forEach((x, i) => {
                            if (illegalCharacterTest.test(x)) {
                                finalResultMatches.individualCharacters[i] = {match: x, i: i}
                            }
                        })
                        finalSubtext = "Case references can only contain letters and numbers"
                    } else if (!/^[A-Z]/.test(refString)) {
                        finalSubtext = "Case references must start with a letter"
                        finalResultMatches.individualCharacters[0] = {i: 0, type: "firstLetter"}
                    } else if (!/^\d{4}$/.test(lastFourCharacters)) {
                        finalSubtext = "Case references must end in four digits"
                        finalResultMatches.lastFour = {match: true, text: `Ends in ${lastFourCharacters}`}
                        // Show caret above end four characters
                        lastFourCharacters.split("").forEach((x, i) => {
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
    }, [refString, hasBeenEnteredOnce]);

    return (
        <div className={"pageWrap p-3 d-grid justify-content-center"}>
            <Header/>
            <div
                className="mainWrap container-fluid d-flex flex-column justify-content-center px-2 px-sm-3 px-md-5 position-relative">
                <div className={"mainWrapBg bg"}/>
                <div className="row justify-content-center">
                    <ReferenceInput refString={refString} onChange={setRefString}
                                    hasBeenEnteredOnce={hasBeenEnteredOnce}/></div>
                <div className="row justify-content-center mb-5">
                    {referenceValidity && <Results refString={refString} referenceValidity={referenceValidity}
                                                   validitySubtext={validitySubtext} resultMatches={resultMatches}/>}
                </div>
                <div className="row justify-content-center">
                    <p className="text-muted small text-center">Photo by <a
                        href="https://unsplash.com/@samsommer?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">samsommer</a> on <a
                        href="https://unsplash.com/s/photos/mountains?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
                    </p>
                    <p className="text-muted small text-center">© Laurence Summers 2021. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}

export default App;
