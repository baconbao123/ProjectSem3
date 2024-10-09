import React, { useEffect, useState } from "react";
import {
  setLoading,
  setShowModal,
  setToast,
} from "@src/Store/Slinces/appSlice.ts";
import { useDispatch } from "react-redux";
import $axios, { Productization } from "@src/axios.ts";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import { Image } from 'primereact/image';
interface ProductDetail {
  id: any;
}
const ProductDetail: React.FC<ProductDetail> = ({ id }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [status, setStatus] = useState(false);
  const [createdBy, setCreatedBy] = useState("");
  const [updatedBy, setUpdatedBy] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdateAt] = useState("");
  const [basePrice, setBasePrice] = useState(0);
  const [sellPrice, setSellPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [imageThumbPath, setImageThumbPath] = useState("");
  const baseUrl = import.meta.env.VITE_BASE_URL_LOCALHOST;
  const token = Cookies.get("token");
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_LENGTH = 500; // Độ dài tối đa để cắt bớt mô tả

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  const shortDescription =
    description?.length > MAX_LENGTH
      ? description.substring(0, MAX_LENGTH) + "..."
      : description;
  useEffect(() => {
    loadData();
  }, []);
  const loadData = () => {
    dispatch(setLoading(true));

    $axios
      .get(`Product/${id}`)
      .then((res) => {
        console.log(res.data.data[0]);
      
        if (res.data.data[0] && res.data.data[0].Name) {
          setName(res.data.data[0].Name);
        }
        if (res.data.data[0] && res.data.data[0].Description) {
          setDescription(res.data.data[0].Description);
        }

        if (res.data.data[0] && res.data.data[0].BasePrice) {
          setBasePrice(res.data.data[0].BasePrice);
        }
        if (res.data.data[0] && res.data.data[0].SellPrice) {
          setSellPrice(res.data.data[0].SellPrice);
        }
        if (res.data.data[0] && res.data.data[0].Quantity) {
          setQuantity(res.data.data[0].Quantity);
        }

        if (res.data.data[0] && res.data.data[0].Status) {
          setStatus(res.data.data[0].Status);
        }
        if (res.data.data[0] && res.data.data[0].UpdateAt) {
          setUpdateAt(
            dayjs(res.data.data[0].UpdateAt).format("YYYY-MM-DD HH:mm:ss")
          );
        }
        if (res.data.data[0] && res.data.data[0].CreatedAt) {
          setCreatedAt(
            dayjs(res.data.data[0].CreatedAt).format("YYYY-MM-DD HH:mm:ss")
          );
        }

        if (res.data.data[0] && res.data.data[0].CreatedBy) {
          setCreatedBy(res.data.data[0].CreatedBy);
        }
        if (res.data.data[0] && res.data.data[0].UpdatedBy) {
          setUpdatedBy(res.data.data[0].UpdatedBy);
        }
        if (res.data.data[0] && res.data.data[0].ImageThumbPath) {
          setImageThumbPath(res.data.data[0].ImageThumbPath);
       
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
          <div className="mt-3">
            {imageThumbPath ? (
              <Image
                src={baseUrl+imageThumbPath}
                alt="Thumb"
                className="image-product"
                width="70"
                preview
              />
            ) : (
              "-"
            )}
          </div>
        </div>
        <div className="col-6">
          <div>
            <span className="label-form me-3">Quantity:</span>
            <span>x {quantity ? quantity : "-"}</span>
          </div>
          <div>
            <span className="label-form me-3">Base price:</span>
            <span> $ {basePrice ? basePrice : "-"}</span>
          </div>
          <div>
            <span className="label-form me-3">Sell price:</span>
            <span> $ {sellPrice ? sellPrice : "-"}</span>
          </div>
        </div>

        <div className="col-12">
          <div>
            <span className="label-form me-3">Description:</span>
            <span>
              {description ? (
                <span
                  dangerouslySetInnerHTML={{
                    __html: isExpanded ? description : shortDescription,
                  }}
                />
              ) : (
                "-"
              )}
            </span>
            {description.length > MAX_LENGTH && (
              <button
                onClick={toggleDescription}
                style={{
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  color: "blue",
                }}
              >
                {isExpanded ? "Hide" : "More"}
              </button>
            )}
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

export default ProductDetail;
