import { ClipLoader } from "react-spinners";

const override = {
    display: "block",
    margin: "100px auto2"
};

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