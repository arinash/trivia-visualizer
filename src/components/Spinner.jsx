import { ClipLoader } from "react-spinners";

const override = {
    display: "block",
    margin: "100px auto2"
};

/**
 * Loading spinner component displaying that content is being loaded
 * 
 * @param {boolean} loading - shows whether the content is loaded, controls whether the spinner is visible
 */
const Spinner = ({ loading }) => {
  return (
    <div className="flex items-center justify-center">
      <ClipLoader
        color="primary-700"
        loading={loading}
        cssOverride={override}
        size={130}
      />
    </div>
  )
}

export default Spinner;