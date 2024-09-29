import {FormControl, Switch, TextField} from "@mui/material";
import React, {useEffect, useState} from "react";
import {setLoading, setShowModal, setToast} from "@src/Store/Slinces/appSlice.ts";
import {useDispatch} from "react-redux";
import $axios, {authorization} from "@src/axios.ts";
import Cookies from "js-cookie";
import dayjs from 'dayjs';
interface AuthorAdd {
    loadDataTable: any,
    id?: any,
    form: string
}
const AuthorAdd : React.FC<AuthorAdd> = ({loadDataTable, form, id}) => {
    const [name, setName] = useState('')
    const [biography, setBiography] = useState('')
    const [birth, setBirth] = useState('')
    const [status, setStatus] = useState(false)
    const [error, setError] = useState({})
    const [item, setItem] = useState({})
    const token = Cookies.get("token")
    useEffect(() => {
        console.log("check props ", form , id)
        if (form === 'edit') {
            loadData()
        }
        console.log("check", name, status, biography, birth,item )

    }, [])
    const loadData = ()  => {
        dispatch(setLoading(true))

        $axios.get(`Author/${id}`).then(res => {

            if (res.data.data && res.data.data.Author.Name) {
                setName( res.data.data.Author.Name)
            }
            if (res.data.data && res.data.data.Author.Birth) {
                setBirth(dayjs(res.data.data.Author.Birth).format('YYYY-MM-DD')) 
            }
            if (res.data.data && res.data.data.Author.Biography) {
                setBiography(res.data.data.Author.Biography)
            }
            if (res.data.data && res.data.data.Author.Status) {
                setStatus(res.data.data.Author.Status)
            }
            if (res.data.data.Author) {
                setItem(res.data.data.Author)
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
       

    const formattedBirth = birth ? dayjs(birth).format('YYYY-MM-DD') : '';
        
    const dataForm = {
        Name: name,
        Biography: biography,
        DateOfBirth: formattedBirth || undefined, // Chỉ thêm DateOfBirth nếu có giá trị
        Status: status ? 1 : 0,
    }
        dispatch(setLoading(true))
        $axios.post('Author',dataForm).then(res => {
            console.log("check res", res)
            loadDataTable()
            dispatch(setToast({status: 'success', message: 'Success', data: 'Add new Author successful'}))
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
            Biography: biography ,
            DateOfBirth: birth ,
            Status: status? 1: 0,
            Version: item.Version
        }
        dispatch(setLoading(true))
        $axios.put(`Author/${id}`,dataForm).then(res => {
            console.log("check res", res)
            loadDataTable()
            dispatch(setToast({status: 'success', message: 'Success', data: 'Edit Author successful'}))
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
                    <div className=''>
                        <div className='label-form'>Day of birth </div>
                        <input value={birth} className='form-control' placeholder='Enter name' type= "date" onChange={e => setBirth(e.target.value)}/>
                    </div>
                        {ShowError('Birth')}
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
                        <div className='label-form'>Biography</div>
                        <textarea className="form-control"
                                  value={biography}
                                  onChange={e =>  setBiography(e.target.value)}
                                  style={{height: '100px'}} placeholder="Enter Biography" id="floatingTextarea2"/>

                    </div>
                    {ShowError('Biography')}
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

export default AuthorAdd