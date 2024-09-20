import {useDispatch, useSelector} from "react-redux";
import {setShowModal} from "@src/Store/Slinces/appSlice.ts";
import React from "react";
import ErrorPage from "@pages/common/ErrorPage.tsx";
interface ModalProps {
    content?: React.FC;
    title?: string;
}

const Modal : React.FC<ModalProps> = ({content, title}) => {
    const showModal = useSelector((state: any) => state.app.showModal);
    const notFound = () => {
        return (<ErrorPage error={"Data not found"}/>)
    }
    const Content = content ? content : notFound

    const dispatch = useDispatch();
    return (
        <div  className={!showModal ? 'd-none' : 'modal-container'}>
            <div className='modal-content'>
                <div className='modal-content-header'>
                    <div>{title ? title : 'Modal title'}</div>
                    <div onClick={() => dispatch(setShowModal(false))}>X</div>
                </div>
                <div className='modal-content-body'>
                    <Content />
                </div>
               <div className='modal-content-footer'>
                   modal footer
               </div>
            </div>
        </div>
    )
}

export default Modal