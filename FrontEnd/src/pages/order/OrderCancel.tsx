import {FormControl, Switch, TextField} from "@mui/material";
import React, {useEffect, useState} from "react";
import {setLoading, setShowModal, setToast} from "@src/Store/Slinces/appSlice.ts";
import {useDispatch} from "react-redux";
import $axios, {authorization} from "@src/axios.ts";
import Cookies from "js-cookie";
import {Simulate} from "react-dom/test-utils";
import cancel = Simulate.cancel;
import Swal from "sweetalert2";
interface OrderCancel {
    loadDataTable: any,
    id?: any,
    form: string
}
const OrderCancel : React.FC<OrderCancel> = ({loadDataTable, form, id}) => {
    const [name, setName] = useState('')
    const [cancelReason, setCancelReason] = useState('')
    const [status, setStatus] = useState(true)
    const [error, setError] = useState({})
    const [item, setItem] = useState({})
    useEffect(() => {
        loadData()
    }, [])
    const loadData = ()  => {
        dispatch(setLoading(true))

        $axios.get(`Order/${id}`).then(res => {
            console.log("Check ",  res.data.data)
            if (res.data.data ) {
                setItem(res.data.data)
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

    const save = () => {
        let dataForm = {
            Cancel: cancelReason,
            Version: item.version
        }
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, cancel it!"
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(setLoading(true))
                $axios.put(`Order/cancel/${item.id}`, dataForm).then(res => {
                    console.log("check res", res)
                    loadDataTable()
                    dispatch(setToast({status: 'success', message: 'Success', data: 'Cancel order successful'}))
                    dispatch(setShowModal(false))
                })
                    .catch(err => {
                        console.log(err)
                        if (err.response.data.Errors) {
                            setError(err.response.data.Errors)
                        }
                        dispatch(setToast({status: 'error', message: 'Error', data: err.response.data.message}))

                    })
                    .finally( () => {
                        dispatch(setLoading(false))
                        dispatch(setShowModal(false))
                    })
            }
        });
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
                <div className=''>
                    <div className=''>
                        <div className='label-form'>Cancel reason <span className='text-danger'>*</span></div>
                        <textarea className="form-control"
                                  value={cancelReason}
                                  onChange={e => setCancelReason(e.target.value)}
                                  style={{height: '100px'}} placeholder="Enter cancel reason" id="floatingTextarea2"/>

                    </div>
                    {ShowError('Cancel')}
                </div>

            </div>
            <div className=' group-btn'>
                <button onClick={() => dispatch(setShowModal(false))} type="button"
                        className="btn btn-outline-secondary">Cancel
                </button>
                <button onClick={() => save()} className='btn btn-general ps-3 pe-3'>Confirm</button>
            </div>
        </div>
    )
}

export default OrderCancel