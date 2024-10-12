
import React, {useEffect, useState} from "react";
import {setLoading, setShowModal, setShowModal3, setToast} from "@src/Store/Slinces/appSlice.ts";
import {useDispatch} from "react-redux";
import $axios from "@src/axios.ts";
import { InputText } from 'primereact/inputtext';
interface UserForgot {
    loadDataTable: any,
    id?: any,
}
const UserForgot : React.FC<UserForgot> = ({loadDataTable, id}) => {
    const [password, setPassword] = useState('')
    const [cpassword, setCpassword] = useState('')
    const [error, setError] = useState({})
    useEffect(() => {

    }, [])

    const dispatch = useDispatch();
    const save = () => {
        setError({})
        const dataForm = {
            password: password
        }
        if (password !== cpassword) {
            setError({Password: ["Password not match"], CPassword: ["Password not match"]})
            return
        }

        console.log('Check data ', dataForm)
        dispatch(setLoading(true))
        $axios.put(`User/changePass/${id}`,dataForm).then(res => {
            console.log("check res", res)
            loadDataTable()
            dispatch(setToast({status: 'success', message: 'Success', data: 'Change password successful'}))
            dispatch(setShowModal(false))
            dispatch(setLoading(false))
        })
            .catch(err => {
                console.log(err)
                console.log("check err", err.response.data.Errors)
                if (err.response.data.Errors) {
                    setError(err.response.data.Errors)
                }
                if (err.response.data.type === 'reload') (
                    dispatch(setToast({status: 'error', message: 'Error', data: err.response.data.message}))
                )
                else  {
                    dispatch(setToast({status: 'error', message: 'Error', data: 'Some thing went wrong'}))
                }
                dispatch(setLoading(false))
            })
            .finally( () => {

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

                <div className='row'>
                    <div className='col-6'>
                        <div className='mt-3'>
                            <div className='label-form'>Password <span className='text-danger'>*</span></div>
                            <InputText value={password} type='password' className='p-inputtext-lg w-100'
                                       placeholder='Enter password' onChange={e => setPassword(e.target.value)}/>
                        </div>
                        {ShowError('Password')}
                    </div>
                    <div className='col-6'>
                        <div className='mt-3'>
                            <div className='label-form'>Confirm password <span className='text-danger'>*</span></div>
                            <InputText value={cpassword} type='password' className='p-inputtext-lg w-100'
                                       placeholder='Enter confirm password'
                                       onChange={e => setCpassword(e.target.value)}/>
                        </div>
                        {ShowError('CPassword')}
                    </div>
                </div>

            <div className=' group-btn'>
                <button onClick={() => {
                    dispatch(setShowModal(false))
                    dispatch(setShowModal3(false))
                }} type="button"
                        className="btn btn-outline-secondary">Cancel
                </button>
                        <button onClick={() => save()} className='btn btn-general ps-3 pe-3'>Change password</button>
            </div>

        </div>
    )
}

export default UserForgot