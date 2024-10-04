import {FormControl, Switch, TextField} from "@mui/material";
import React, {useEffect, useState} from "react";
import {setLoading, setShowModal, setToast} from "@src/Store/Slinces/appSlice.ts";
import {useDispatch} from "react-redux";
import $axios, {authorization} from "@src/axios.ts";
import Cookies from "js-cookie";
interface ResourceAdd {
    loadDataTable: any,
    id?: any,
    form: string
}
const ResourceAdd : React.FC<ResourceAdd> = ({loadDataTable, form, id}) => {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState(true)
    const [error, setError] = useState({})
    const [item, setItem] = useState({})
    const token = Cookies.get("token")
    useEffect(() => {
        if (form === 'edit') {
            loadData()
        }
        console.log("check", name, status, description, item )

    }, [])
    const loadData = ()  => {
        dispatch(setLoading(true))

        $axios.get(`Role/${id}`).then(res => {

            if (res.data.data && res.data.data.Resource.Name) {
                setName( res.data.data.Resource.Name)
            }
            if (res.data.data && res.data.data.Resource.Description) {
                setDescription(res.data.data.Resource.Description)
            }
            if (res.data.data && res.data.data.Resource.Status) {
                setStatus(res.data.data.Resource.Status)
            }
            if (res.data.data.Resource) {
                setItem(res.data.data.Resource)
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
    const addNew = () => {
        setError({})
        const dataForm = {
            Name: name,
            Description: description,
            Status: status? 1: 0,
        }
        dispatch(setLoading(true))
        $axios.post('Role',dataForm).then(res => {
            console.log("check res", res)
            loadDataTable()
            dispatch(setToast({status: 'success', message: 'Success', data: 'Add new resource successful'}))
            dispatch(setShowModal(false))
        })
            .catch(err => {
                console.log(err)
                console.log("check err", err.response.data.Errors)
                if (err.response.data.Errors) {
                    setError(err.response.data.Errors)
                }
                dispatch(setToast({status: 'error', message: 'Error', data: 'Some thing went wrong'}))
            })
            .finally( () => {
                dispatch(setLoading(false))
            })
    }
    const save = () => {
        setError({})
        const dataForm = {
            Name: name,
            Description: description,
            Status: status? 1: 0,
            Version: item.Version
        }
        dispatch(setLoading(true))
        $axios.put(`Role/${id}`,dataForm).then(res => {
            console.log("check res", res)
            loadDataTable()
            dispatch(setToast({status: 'success', message: 'Success', data: 'Edit resource successful'}))
            dispatch(setShowModal(false))
        })
        .catch(err => {
            console.log(err)
            console.log("check err")
            if (err.response.data.Errors) {
                setError(err.response.data.Errors)
            }
            if (err.response.data.type === 'reload') (
                dispatch(setToast({status: 'error', message: 'Error', data: err.response.data.message}))
            )
            else  {
             dispatch(setToast({status: 'error', message: 'Error', data: 'Some thing went wrong'}))
            }
        })
        .finally( () => {
            dispatch(setLoading(false))
        })
    }

    const ShowError: React.FC = (key) => {
        let data = []
        if (error[key] && error[key].length > 0) {
            data = error[key]
        }
        return (
            <div className="text-danger mt-1">{ data[0] ? data[0] : '' } </div>
        )
    }
    return (
        <div className='container-fluid'>
            <div className='row  '>
                <div className='col-6'>
                    <div className=''>
                        <div className='label-form'>Name <span className='text-danger'>*</span></div>
                        <input value={name} className='form-control' placeholder='Enter name' onChange={e => setName(e.target.value)}/>
                    </div>
                        {ShowError('Name')}
                    <div className='mt-3'>
                        <div className='label-form'>Status <span className='text-danger'>*</span></div>
                        <div className="form-check form-switch">
                            <input checked={status} onChange={e => setStatus(e.target.checked)} className="form-check-input form-switch switch-input" type="checkbox" id="flexSwitchCheckDefault"/>
                        </div>
                            {ShowError('Status')}
                    </div>
                </div>
                <div className='col-6'>
                    <div className=''>
                        <div className='label-form'>Description</div>
                        <textarea className="form-control"
                                  value={description}
                                  onChange={e => setDescription(e.target.value)}
                                  style={{height: '100px'}} placeholder="Enter description" id="floatingTextarea2"/>

                    </div>
                    {ShowError('Description')}
                </div>
                <div className=' group-btn'>
                    <button onClick={() => dispatch(setShowModal(false))} type="button" className="btn btn-outline-secondary">Cancel</button>
                    {form === 'add' ?
                        (
                            <button onClick={() => addNew()} className='btn btn-general ps-3 pe-3'>Add new</button>

                        ):
                        (
                            <button onClick={() => save()} className='btn btn-general ps-3 pe-3'>Save</button>

                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default ResourceAdd