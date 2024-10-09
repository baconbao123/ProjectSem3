import React, { useEffect, useState } from "react";
import {
  setLoading,
  setShowModal,
  setToast,
} from "@src/Store/Slinces/appSlice.ts";
import { useDispatch } from "react-redux";
import $axios, { authorization } from "@src/axios.ts";
import Cookies from "js-cookie";
import dayjs from "dayjs";
interface CompanyDetail {
  id: any;
}
const CompanyDetail: React.FC<CompanyDetail> = ({ id }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState(false);
  const [createdBy, setCreatedBy] = useState("");
  const [updatedBy, setUpdatedBy] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdateAt] = useState("");

  const token = Cookies.get("token");
  useEffect(() => {
    loadData();
  }, []);
  const loadData = () => {
    dispatch(setLoading(true));

    $axios
      .get(`FAQ/${id}`)
      .then((res) => {
        if (res.data.data && res.data.data.CompanyPartner.Name) {
          setName(res.data.data.CompanyPartner.Name);
        }
        if (res.data.data && res.data.data.CompanyPartner.Email) {
          setEmail(res.data.data.CompanyPartner.Email);
        }
        if (res.data.data && res.data.data.CompanyPartner.Address) {
          setAddress(res.data.data.CompanyPartner.Address);
        }
        if (res.data.data && res.data.data.CompanyPartner.Phone) {
          setPhone(res.data.data.CompanyPartner.Phone);
        }
        if (res.data.data && res.data.data.CompanyPartner.Type) {
          setType(res.data.data.CompanyPartner.Type);
        }
        if (res.data.data && res.data.data.CompanyPartner.Status) {
          setStatus(res.data.data.CompanyPartner.Status);
        }
        if (res.data.data && res.data.data.CompanyPartner.UpdateAt) {
          setUpdateAt(
            dayjs(res.data.data.CompanyPartner.UpdateAt).format("YYYY-MM-DD HH:mm:ss")
          );
        }
        if (res.data.data && res.data.data.CompanyPartner.CreatedAt) {
          setCreatedAt(
            dayjs(res.data.data.CompanyPartner.CreatedAt).format("YYYY-MM-DD HH:mm:ss")
          );
        }

        if (res.data.data && res.data.data.CreatedUpdated) {
          setCreatedBy(res.data.data.CreatedUpdated);
        }
        if (res.data.data && res.data.data.UserUpdated) {
          setUpdatedBy(res.data.data.UserUpdated);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };
  const dispatch = useDispatch();

  return (
    <div className="container-fluid">
      <div className="row  ">
        <div className="col-6">
          <div>
            <span className="label-form me-3">Name:</span>
            <span> {name ? name : "-"}</span>
          </div>
          <div>
            <span className="label-form me-3">Email:</span>
            <span> {email ? email : "-"}</span>
          </div>
          <div>
            <span className="label-form me-3">Phone:</span>
            <span> {phone ? phone : "-"}</span>
          </div>
          <div>
            <span className="label-form me-3">Address:</span>
            <span> {address ? address : "-"}</span>
          </div>
          <div>
            <span className="label-form me-3">Type:</span>
            <span> {type ? type : "-"}</span>
          </div>
        </div>
        <div className="col-6">
        <div>
            <div>
              <span className="label-form me-3">Created by:</span>
              <span> {createdBy ? createdBy : "-"}</span>
            </div>
            <div>
              <span className="label-form me-3">Created At:</span>
              <span>
                {" "}
                {createdAt
                  ? dayjs(createdAt).format("DD-MM-YYYY | HH:mm:ss")
                  : "-"}
              </span>
            </div>
            <div>
              <span className="label-form me-3">Update by:</span>
              <span> {updatedBy ? updatedBy : "-"}</span>
            </div>

            <div>
              <span className="label-form me-3">Update At:</span>
              <span>
                {" "}
                {updatedAt
                  ? dayjs(updatedAt).format("DD-MM-YYYY | HH:mm:ss")
                  : "-"}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-3 col-6">
          <div>
            <span className="label-form me-3">Status:</span>
            {status ? (
              <span className="status-success ">Active</span>
            ) : (
              <span className="status-disable">Disable</span>
            )}
          </div>
        </div>
        <div className="col-6 mt-3">
          
        </div>
        <div className=" group-btn">
          <button
            onClick={() => dispatch(setShowModal(false))}
            type="button"
            className="btn btn-outline-secondary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;
