import { ColorRing } from 'react-loader-spinner'
import "./style.css";

export function Loader() {
    return (
        <div className="modal-main">
            <ColorRing
                visible={true}
                height="80"
                width="80"
                ariaLabel="blocks-loading"
                wrapperStyle={{}}
                wrapperClass="blocks-wrapper"
                colors={['#ff6900',]}
            />
        </div>
    );
}