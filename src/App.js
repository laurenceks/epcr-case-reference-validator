import ReferenceInput from "./components/ReferenceInput";
import Header from "./components/Header";
import Results from "./components/Results";
import {useEffect, useState} from "react";

function App() {
    const [refString, setRefString] = useState("");
    const [referenceValidity, setReferenceValidity] = useState(null);
    const [validitySubtext, setValiditySubtext] = useState(null);

    useEffect(() => {
        const query = new URLSearchParams(window.location.search).get("ref");
        if (query) {
            setRefString(query.length > 12 ? query.substr(0, 12) : query);
        } else {
            window.history.replaceState(null, null, "/");
        }
        return () => {
        };
    }, []);

    useEffect(() => {
        let finalValidity = null;
        let finalSubtext = null;
        //tests
        //first - is it valid?
        const validRegEx = /^[A-Z][A-Z0-9]{7}\d{4}$/
        if (refString.length <= 8) {
            finalValidity = null;
        } else if (validRegEx.test(refString)) {
            //valid reference!
            //check if ambiguous
            const letterLikeRegEx = /[015OIS]/g;
            if (refString.substr(8, 4) === "0000") {
                finalValidity = "warning"
                finalSubtext = "This case reference ends in 0000 which means it was created offline - contact epcr@secamb.nhs.uk to confirm it was merged"
            } else if (letterLikeRegEx.test(refString.substr(0, 8))) {
                finalValidity = "warning"
                //create reccomendations
            } else {
                finalValidity = "valid";
            }
        } else {
            finalValidity = "invalid";
            if (refString.length < 12) {
                finalSubtext = "Case references must be 12 digits long"
            } else if (!/^[A-Z]/.test(refString)){
                finalSubtext = "Case references must start with a letter"
            }else if (!/^\d{4}$/.test(refString.substr(9,4))){
                finalSubtext = "Case references must end in four digits"
            }
        }
        setReferenceValidity(finalValidity);
        setValiditySubtext(finalSubtext);
    }, [refString]);


    return (
        <div>
            <Header/>
            <div className="mainWrap container-fluid d-flex flex-column justify-content-center px-5">
                <div className="row justify-content-center">
                    <ReferenceInput refString={refString} onChange={setRefString}/></div>
                <div className="row justify-content-center">
                    {referenceValidity && <Results refString={refString} referenceValidity={referenceValidity}
                                                   validitySubtext={validitySubtext}/>}
                </div>
            </div>
        </div>
    );
}

export default App;
