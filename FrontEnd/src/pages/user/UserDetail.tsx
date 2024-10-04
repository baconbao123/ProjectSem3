
import React, {useEffect, useRef, useState} from "react";
import {setLoading, setShowModal, setToast} from "@src/Store/Slinces/appSlice.ts";
import {useDispatch} from "react-redux";
import $axios, {authorization} from "@src/axios.ts";
import Cookies from "js-cookie";
import {MultiSelect} from "primereact/multiselect";
import { InputText } from 'primereact/inputtext';
import {Image} from "primereact/image";
import defaultImage from "@src/images/default.png";
import {Tag} from "primereact/tag";
interface ResourceAdd {
    id?: any,
}
const ResourceAdd : React.FC<ResourceAdd> = ({id}) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [cpassword, setCpassword] = useState('')
    const [role, setRole] = useState([])
    const [status, setStatus] = useState([])
    const [error, setError] = useState({})
    const [version, setVersion] = useState(0)
    const [avatar, setAvatar] = useState('')
    const [imageSrc, setImageSrc] = useState(null);
    const [createdAt, setCreatedAt] = useState(null);
    const [updatedAt, setUpdated] = useState(null);
    const [createdBy, setCreatedBy] = useState(null);
    const [createdByName, setCreatedByName] = useState(null);
    const [updatedBy, setUpdatedBy] = useState(null);
    const [updatedByName, setUpdatedByName] = useState(null);
    const inputFileRef = useRef('');
    useEffect(() => {
        loadDataInit()

    }, [])
    const loadDataInit = () => {
        $axios.get(`User/${id}`).then(res => {
            console.log('Check data ', res.data.data)
            if (res.data.data && res.data.data.name) {
                setName(res.data.data.name)
            }
            if (res.data.data && res.data.data.email) {
                setEmail(res.data.data.email)
            }
            if (res.data.data && res.data.data.status) {
                setStatus(res.data.data.status)
            }
            if (res.data.data && res.data.data.phone) {
                setPhone(res.data.data.phone)
            }
            if (res.data.data && res.data.data.role) {
                setRole(res.data.data.role)
            }
            if (res.data.data && res.data.data.UU) {
                setUpdatedByName(res.data.data.UU)
            }
            if ((res.data.data && res.data.data.UpdatedBy) ||   res.data.data.UpdatedBy === 0) {
                setUpdatedBy(res.data.data.UpdatedBy)
            }
            if (res.data.data && res.data.data.CU) {
                setCreatedByName(res.data.data.CU)
            }
            if ((res.data.data && res.data.data.UpdatedBy) ||   res.data.data.CreatedBy === 0) {
                setCreatedBy(res.data.data.CreatedBy)
            }
            if (res.data.data && res.data.data.CreatedAt) {
                setCreatedAt(res.data.data.CreatedAt)
            }
            if (res.data.data && res.data.data.UpdatedAt) {
                setUpdated(res.data.data.UpdatedAt)
            }

            if (res.data.data && (res.data.data.Version || res.data.data.Version === 0)) {
                setVersion(res.data.data.Version)
            }
            if (res.data.data && res.data.data.Avatar) {
                setAvatar(res.data.data.Avatar)
                setImageSrc((import.meta.env.VITE_BASE_URL_LOCALHOST + 'images/' + res.data.data.Avatar))
            }

            dispatch(setLoading(false))

        })
            .catch((err) => {
                console.log(err)
                dispatch(setLoading(false))

            })
            .finally( () => {
            })
    }
    const dispatch = useDispatch();

    return (
        <div className='container-fluid'>
            <div className='row  '>
                <div className='col-6 mb-3'>
                    <div><span className='label-form me-3'>User name: </span> <span> {name ? name : '-'}</span></div>
                </div>
                <div className='col-6 mb-3'>
                    <div className=''><span className='label-form me-3 '>Avatar: </span>
                        <Image src={imageSrc || defaultImage} alt="Image" width="50" className='image-avatar' preview
                               onError={(e) => {
                                   e.target.onerror = null;
                                   e.target.src = defaultImage;
                               }}/>
                    </div>
                </div>
                <div className='col-6 mb-3'>
                    <div><span className='label-form me-3 '>Email: </span> <span> {email ? email : '-'}</span></div>
                </div>
                <div className='col-6 mb-3'>
                    <div><span className='label-form me-3 '>Phone: </span> <span> {phone ? phone : '-'}</span></div>
                </div>

                <div className='col-6 mb-3'>
                    <div><span className='label-form me-3 '>Status: </span>
                        {status ? (
                                <span className='status-success '>
                                    Active
                                </span>
                            ) :
                            (
                                <span className='status-disable'>
                                    Disable
                                </span>
                            )
                        }
                    </div>
                </div>
                <div className='col-6 mb-3'>
                    <div><span className='label-form me-3 '>Create by: </span>
                        <span> {createdBy !== 0 ? (createdByName ? createdByName : '-') : 'System'}</span></div>
                </div>

                <div className='col-6 mb-3'>
                    <div><span className='label-form me-3 '>Updated by: </span>
                        <span> {updatedBy !== 0 ? (updatedByName ? updatedByName : '-') : 'System'}</span></div>
                </div>

                <div className='col-6 mb-3'>
                    <div><span className='label-form me-3 '>Created At: </span>
                        <span> {createdAt ? createdAt : '-'}</span></div>
                </div>

                <div className='col-6 mb-3'>
                    <div><span className='label-form me-3 '>Updated At: </span>
                        <span> {updatedAt ? updatedAt : '-'}</span></div>
                </div>
                <div className='col-6 mb-3'>
                    <div><span className='label-form me-3 '>Role: </span> {role.map(item  => (  <Tag key={crypto.randomUUID()} className='me-2' severity="info" value={item.label}></Tag>))}</div>
                </div>


            </div>


            <div className=' group-btn'>
                <button onClick={() => dispatch(setShowModal(false))} type="button"
                        className="btn btn-outline-secondary">Close
                </button>
            </div>

        </div>
    )
}

export default ResourceAdd