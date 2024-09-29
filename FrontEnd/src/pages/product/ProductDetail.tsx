import React, { useEffect, useState } from "react";
import {
  setLoading,
  setShowModal,
  setToast,
} from "@src/Store/Slinces/appSlice.ts";
import { useDispatch } from "react-redux";
import $axios, { Categoryization } from "@src/axios.ts";
import Cookies from "js-cookie";
import dayjs from "dayjs";
interface CategoryDetail {
  id: any;
}
const CategoryDetail: React.FC<CategoryDetail> = ({ id }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentCategory, setParentCategory] = useState("");
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
      .get(`Category/${id}`)
      .then((res) => {
        if (res.data.data && res.data.data.Category.Name) {
          setName(res.data.data.Category.Name);
        }
        if (res.data.data && res.data.data.Category.Description) {
          setDescription(res.data.data.Category.Description);
        }
        if (res.data.data && res.data.data.ParentName) {
          setParentCategory(res.data.data.ParentName);
        }
        if (res.data.data && res.data.data.Category.Status) {
          setStatus(res.data.data.Category.Status);
        }
        if (res.data.data && res.data.data.Category.UpdateAt) {
          setUpdateAt(
            dayjs(res.data.data.Category.UpdateAt).format("YYYY-MM-DD HH:mm:ss")
          );
        }
        if (res.data.data && res.data.data.Category.CreatedAt) {
          setCreatedAt(
            dayjs(res.data.data.Category.CreatedAt).format(
              "YYYY-MM-DD HH:mm:ss"
            )
          );
        }

        if (res.data.data && res.data.data.UserCreate) {
          setCreatedBy(res.data.data.UserCreate);
        }
        if (res.data.data && res.data.data.UserUpdate) {
          setUpdatedBy(res.data.data.UserUpdate);
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
            <span className="label-form me-3">Parent category:</span>
            <span> {parentCategory? parentCategory : "-"}</span>
          </div>
        </div>
        <div className="col-6">
          <div>
            <span className="label-form me-3">Description:</span>
            <span> {description ? description : "-"}</span>
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
          <div className="col-6 mt-3">
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

export default CategoryDetail;
