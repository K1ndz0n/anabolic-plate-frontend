import { ClipLoader } from "react-spinners";

function LoaderComponent() {
    return(
        <div className="loaderContainer">
                <div style={{ display: 'flex', justifyContent: 'center', padding: '10px', marginTop: "10px"}}>
                    <ClipLoader color="white" size={50} />
                </div>
                <p className="noContentInfo">Ładowanie...</p>
        </div>
    )
}

export default LoaderComponent;