import React, {useEffect, useState} from "react";
import {setLoading, setShowModal, setToast} from "@src/Store/Slinces/appSlice.ts";
import {useDispatch} from "react-redux";
import $axios, {authorization} from "@src/axios.ts";
import Cookies from "js-cookie";
import dayjs from "dayjs";
interface SaleAdd {

    id: any,

}
const SaleDetail : React.FC<SaleAdd> = ({id}) => {
    const [name, setName] = useState('')


  
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [type, setType] = useState<number>(1);
    const [discount, setDiscount] = useState<number>(0);
 
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

        $axios.get(`Sale/${id}`).then(res => {

            if (res.data.data && res.data.data.Sale.Name) {
                setName(res.data.data.Sale.Name);
              }
              if (res.data.data && res.data.data.Sale.Type) {
                setType(res.data.data.Sale.Type);
              }
              if (res.data.data && res.data.data.Sale.StartDate) {
                setStartDate(
                  dayjs(res.data.data.Sale.StartDate).format("YYYY-MM-DDTHH:mm")
                );
              }
              if (res.data.data && res.data.data.Sale.EndDate) {
                setEndDate(dayjs(res.data.data.Sale.EndDate).format("YYYY-MM-DDTHH:mm"));
              }
              if (res.data.data && res.data.data.Sale.Discount) {
                setDiscount(res.data.data.Sale.Discount * 100);
              }
      
              if (res.data.data && res.data.data.Sale.Status) {
                setStatus(res.data.data.Sale.Status);
              }
           
            if (res.data.data && res.data.data.Sale.UpdateAt) {
                setUpdateAt( dayjs(res.data.data.Sale.UpdateAt).format('YYYY-MM-DD HH:mm:ss'))
            }
            if (res.data.data && res.data.data.Sale.CreatedAt) {
                setCreatedAt(dayjs(res.data.data.Sale.CreatedAt).format('YYYY-MM-DD HH:mm:ss'))
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
    const typeLabels: { [key: number]: string } = {
        1: "Free ship",
        2: "Discount by order",
        3: "Discount by category"
      };
      
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
                           Start date
                        </span>
                        <span className="fs-5 text-success"> {startDate ? dayjs(startDate).format("DD-MM-YYYY - HH:mm") : '-'}</span>
                    </div>
                    <div>
                        <span className='label-form me-3 fs-6'>
                           End date
                        </span>
                        <span className="fs-5 text-success"> {endDate ? dayjs(endDate).format("DD-MM-YYYY - HH:mm") : '-'}</span>
                    </div>
                    <div>
                    <span className='label-form me-3 fs-6'>
                           Discount
                        </span>

                        <span className="fs-5 text-success"> {discount ? discount + " %" : '-'}</span>
                    </div>
                    <div>
                    <span className='label-form me-3 fs-6'>
                           Type
                        </span>
                        <span className="fs-5 text-success">  {typeLabels[type] || "-"}</span>
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

export default SaleDetail