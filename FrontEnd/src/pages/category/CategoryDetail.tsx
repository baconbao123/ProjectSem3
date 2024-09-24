import React, {useEffect, useState} from "react";
import {setLoading, setShowModal, setToast} from "@src/Store/Slinces/appSlice.ts";
import {useDispatch} from "react-redux";
import $axios, {authorization} from "@src/axios.ts";
import Cookies from "js-cookie";
interface CategoryAdd {

    id: any,

}
const CategoryAdd : React.FC<CategoryAdd> = ({id}) => {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState(false)
    const [createdBy, setCreatedBy] = useState('')

    const token = Cookies.get("token")
    useEffect(() => {
        loadData()

    }, [])
    const loadData = ()  => {
        dispatch(setLoading(true))

        $axios.get(`Resource/${id}`).then(res => {

            if (res.data.data && res.data.data.Resource.Name) {
                  setName( res.data.data.Resource.Name)
            }
            if (res.data.data && res.data.data.Resource.Description) {
                setDescription(res.data.data.Resource.Description)
            }
            if (res.data.data && res.data.data.Resource.Status) {
                setStatus(res.data.data.Resource.Status)
            }
            if (res.data.data && res.data.data.User.Username) {
                setCreatedBy(res.data.data.User.Username)
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
                        <span> {name ? name : '-'}</span>
                    </div>


                </div>
                <div className='col-6'>
                    <div>
                        <span className='label-form me-3'>
                            Description:
                        </span>
                        <span> {description ? description : '-'}</span>
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

export default CategoryAdd