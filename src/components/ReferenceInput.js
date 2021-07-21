import PropTypes from 'prop-types';

const ReferenceInput = props => {
    return (
        <div className="searchContainer w-100 d-flex justify-content-center p-3 position-relative">
            <input type="text"
                   className="form-control w-100"
                   placeholder="Enter the ePCR case reference here"
                   defaultValue={props.refString}
                   maxLength={12}
                   onChange={(e) => {
                       if (e.target.value.length > 0) {
                           props.onChange(e.target.value.toUpperCase());
                           window.history.pushState(null, null, "?ref=" + encodeURIComponent(e.target.value.toUpperCase()));
                       } else {
                           props.onChange("");
                           window.history.replaceState(null, null, window.location.pathname);
                       }
                   }}
            />
        </div>
    );
};

ReferenceInput.propTypes = {
    refString: PropTypes.string,
    onChange: PropTypes.func
};

export default ReferenceInput;
