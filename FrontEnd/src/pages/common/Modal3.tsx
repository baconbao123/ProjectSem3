import {useDispatch, useSelector} from "react-redux";
import {setShowModal, setShowModal2, setShowModal3} from "@src/Store/Slinces/appSlice.ts";
import React from "react";
import ErrorPage from "@pages/common/ErrorPage.tsx";
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
interface ModalProps {
    content?: React.FC;
    title?: string;
}

const Modal3 : React.FC<ModalProps> = ({content, title}) => {
    const showModal = useSelector((state: any) => state.app.showModal3);
    const notFound = () => {
        return (<ErrorPage error={"Data not found"}/>)
    }
    const Conntent = content ? content : notFound
    const dispatch = useDispatch();
    return (
        <>
        {showModal ? (
        <div  className='modal-container'>
            <div className='modal-content'>
                <div className='modal-content-header'>
                    <div>{title ? ( <span>{title}</span>) : 'Modal title'}</div>
                    <div onClick={() => dispatch(setShowModal3(false))}> <ClearOutlinedIcon  className='btn-delete'/></div>
                </div>
                <div className='modal-content-body'>
                    {content()}
                </div>
               {/*<div className='modal-content-footer'>*/}
               {/*    modal footer*/}
               {/*</div>*/}
            </div>
        </div>
            )
                : ""
        }
        </>
    )
}

export default Modal3