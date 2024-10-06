import React, {useEffect, useState} from "react";
import {setLoading, setShowModal, setToast} from "@src/Store/Slinces/appSlice.ts";
import {useDispatch} from "react-redux";
import $axios, {authorization} from "@src/axios.ts";
import Cookies from "js-cookie";
import dayjs from "dayjs";
interface AuthorAdd {

    id: any,

}
const AuthorAdd : React.FC<AuthorAdd> = ({id}) => {
    const [name, setName] = useState('')
    const [biography, setBiography] = useState('')
    const [birth, setBirth] = useState('')
    const [status, setStatus] = useState(false)
    const [createdBy, setCreatedBy] = useState('')
    const [updatedBy, setUpdatedBy] = useState('')
    const [createdAt, setCreatedAt] = useState('')
    const [updatedAt, setUpdateAt] = useState('')

    const token = Cookies.get("token")
    useEffect(() => {
        loadData()

    }, [])
    const loadData = ()  => {
        dispatch(setLoading(true))

        $axios.get(`Author/${id}`).then(res => {

            if (res.data.data && res.data.data.Author.Name) {
                  setName( res.data.data.Author.Name)
            }
            if (res.data.data && res.data.data.Author.Biography) {
                setBiography(res.data.data.Author.Biography)
            }
            if (res.data.data && res.data.data.Author.Birth) {
                setBirth(dayjs(res.data.data.Author.Birth).format('YYYY-MM-DD')) 
            }
            if (res.data.data && res.data.data.Author.Status) {
                setStatus(res.data.data.Author.Status)
            }
            if (res.data.data && res.data.data.Author.UpdateAt) {
                setUpdateAt( dayjs(res.data.data.Author.UpdateAt).format('YYYY-MM-DD HH:mm:ss'))
            }
            if (res.data.data && res.data.data.Author.CreatedAt) {
                setCreatedAt(dayjs(res.data.data.Author.CreatedAt).format('YYYY-MM-DD HH:mm:ss'))
            }
           
            if (res.data.data && res.data.data.UserCreate) {
                setCreatedBy(res.data.data.UserCreate)
            }
            if (res.data.data && res.data.data.UserUpdate) {
                setUpdatedBy(res.data.data.UserUpdate)
            }

        })
            .catch((err) => {
                console.log(err)
            })
            .finally( () => {
                dispatch(setLoading(false))
            })
    }
    const dispatch = useDispatch();

    return (
        <div className='container-fluid'>
            <div className='row  '>
                <div className='col-6'>

                    <div>
                        <span className='label-form me-3'>
                            Name:
                        </span>
                        <span className="fs-5 text-success"> {name ? name : '-'}</span>
                    </div>
                    <div>
                        <span className='label-form me-3 fs-6'>
                            Date of birth:
                        </span>
                        <span className="fs-5 text-success"> {birth ? dayjs(birth).format("DD-MM-YYYY") : '-'}</span>
                    </div>


                </div>
                <div className='col-6'>
                    <div>
                        <span className='label-form me-3'>
                            Biography:
                        </span>
                        <span> {biography? biography : '-'}</span>
                    </div>
                </div>
                <div className='mt-3 col-6'>
                    <div>
                        <span className='label-form me-3'>Status:</span>
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
                <div className='col-6 mt-3'>
                    <div>
                        <span className='label-form me-3'>
                            Created by:
                        </span>
                        <span> {createdBy ? createdBy : '-'}</span>
                    </div>
                    <div>
                        <span className='label-form me-3'>
                            Created At:
                        </span>
                        <span> {createdAt ? dayjs(createdAt).format("DD-MM-YYYY | HH:mm:ss")  : '-'}</span>
                    </div>
                    <div>
                        <span className='label-form me-3'>
                            Update by:
                        </span>
                        <span> {updatedBy ? updatedBy : '-'}</span>
                    </div>
               
                    <div>
                        <span className='label-form me-3'>
                            Update At:
                        </span>
                        <span> {updatedAt ? dayjs(updatedAt).format("DD-MM-YYYY | HH:mm:ss")  : '-'}</span>
                    </div>
                </div>
                <div className=' group-btn'>
                    <button onClick={() => dispatch(setShowModal(false))} type="button"
                            className="btn btn-outline-secondary">Close
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AuthorAdd