import Modal from "@pages/common/Modal.tsx";
import {useDispatch} from "react-redux";

import {setShowModal} from "@src/Store/Slinces/appSlice.ts";

const About : React.FC = () => {
    const dispatch = useDispatch();
    const showModal = () => {
        dispatch(setShowModal(true));
    }
    return (
        <div  style={{marginTop: '30px'}}>
            <Modal
            />
            <button className='btn btn-general' onClick={showModal}>Show modal</button>
            <h1>This is  about page</h1>
        </div>
    )
}

export default About