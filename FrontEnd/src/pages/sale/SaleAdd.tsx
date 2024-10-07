import { FormControl, Switch, TextField } from "@mui/material";
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
interface SaleAdd {
  loadDataTable: any;
  id?: any;
  form: string;
}
const SaleAdd: React.FC<SaleAdd> = ({ loadDataTable, form, id }) => {
  const [name, setName] = useState("");
  
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [type, setType] = useState<number>(1);
  const [discount, setDiscount] = useState<number>(0);
  const [status, setStatus] = useState(false);
  const [error, setError] = useState({});
  const [item, setItem] = useState({});
  const token = Cookies.get("token");
  useEffect(() => {
    console.log("check props ", form, id);
    if (form === "edit") {
      loadData();
    }
  }, []);
  const loadData = () => {
    dispatch(setLoading(true));

    $axios
      .get(`Sale/${id}`)
      .then((res) => {
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
        if (res.data.data.Sale) {
          setItem(res.data.data.Sale);
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
  const addNew = () => {
    setError({});

    const formattedStartDate = startDate
    ? dayjs(startDate).format("YYYY-MM-DDTHH:mm")
    : "";
  const formattedEndDate = endDate
    ? dayjs(endDate).format("YYYY-MM-DDTHH:mm")
    : "";

    const dataForm = {
      Name: name,
      Discount: discount,
      StartDate: formattedStartDate || undefined, // Chỉ thêm DateOfBirth nếu có giá trị
      EndDate: formattedEndDate || undefined, // Chỉ thêm DateOfBirth nếu có giá trị
      Type: type,
      Status: status ? 1 : 0,
    };
    dispatch(setLoading(true));
    $axios
      .post("Sale", dataForm)
      .then((res) => {
        console.log("check res", res);
        loadDataTable();
        dispatch(
          setToast({
            status: "success",
            message: "Success",
            data: "Add new discount successful",
          })
        );
        dispatch(setShowModal(false));
      })
      .catch((err) => {
        console.log(err);
        console.log("check err", err.response.data.Errors);
        if (err.response.data.Errors) {
          setError(err.response.data.Errors);
        }
        dispatch(
          setToast({
            status: "error",
            message: "Error",
            data: "Some thing went wrong",
          })
        );
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };
  const save = () => {
    setError({});
    const dataForm = {
      Name: name,
      Discount: discount,
      StartDate: startDate, // Chỉ thêm DateOfBirth nếu có giá trị
      EndDate: endDate, // Chỉ thêm DateOfBirth nếu có giá trị
      Type: type,
      Status: status ? 1 : 0,
      Version: item.Version,
    };
    dispatch(setLoading(true));
    $axios
      .put(`Sale/${id}`, dataForm)
      .then((res) => {
        console.log("check res", res);
        loadDataTable();
        dispatch(
          setToast({
            status: "success",
            message: "Success",
            data: "Edit Sale successful",
          })
        );
        dispatch(setShowModal(false));
      })
      .catch((err) => {
        console.log(err);
        console.log("check err");
        if (err.response.data.Errors) {
          setError(err.response.data.Errors);
        }
        if (err.response.data.type === "reload")
          dispatch(
            setToast({
              status: "error",
              message: "Error",
              data: err.response.data.message,
            })
          );
        else {
          dispatch(
            setToast({
              status: "error",
              message: "Error",
              data: "Some thing went wrong",
            })
          );
        }
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(Number(e.target.value));
  };

  const validateDates = () => {
    if (startDate && endDate) {
      const start = dayjs(startDate);
      const end = dayjs(endDate);
      if (end.isBefore(start)) {
        setError((prev) => ({
          ...prev,
          EndDate: ["End date cannot be before start date."],
        }));
        return false;
      } else {
        setError((prev) => {
          const newError = { ...prev };
          delete newError.EndDate;
          return newError;
        });
        return true;
      }
    }
    return true;
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
    setError((prev) => ({ ...prev, StartDate: [] }));
    // Re-validate dates
    setTimeout(() => {
      validateDates();
    }, 0);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
    setError((prev) => ({ ...prev, EndDate: [] }));
    // Re-validate dates
    setTimeout(() => {
      validateDates();
    }, 0);
  };
  const ShowError: React.FC = (key) => {
    let data = [];
    if (error[key] && error[key].length > 0) {
      data = error[key];
    }
    return <div className="text-danger mt-1">{data[0] ? data[0] : ""} </div>;
  };

  return (
    <div className="container-fluid">
      <div className="row  ">
        <div className="col-6">
          <div className="">
            <div className="label-form">
              Name discount <span className="text-danger">*</span>
            </div>
            <input
              value={name}
              className="form-control"
              placeholder="Enter discount"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {ShowError("Name")}
          <div className="">
            <div className="label-form">
              Start date and time <span className="text-danger">*</span>
            </div>
            <input
              value={startDate}
              className="form-control"
              type="datetime-local"
              
              onChange={handleStartDateChange}
            />
          </div>
          {ShowError("StartDate")}

          <div className="">
            <div className="label-form">
              End date and time <span className="text-danger">*</span>
            </div>
            <input
              value={endDate}
              className="form-control"
              type="datetime-local"

              onChange={handleEndDateChange}
            />
          </div>
          {ShowError("EndDate")}

          <div className="mt-3">
            <div className="label-form">
              Status <span className="text-danger">*</span>
            </div>
            <div className="form-check form-switch">
              <input
                checked={status}
                onChange={(e) => setStatus(e.target.checked)}
                className="form-check-input form-switch switch-input"
                type="checkbox"
                id="flexSwitchCheckDefault"
              />
            </div>
            {ShowError("Status")}
          </div>
        </div>
        <div className="col-6">
          {/* Thêm dropdown để chọn Type */}
          <div className="">
            <div className="label-form">
              Discount Type <span className="text-danger">*</span>
            </div>
            <select
              value={type}
              onChange={handleTypeChange}
              className="form-control"
            >
              <option value={1}>Freeship</option>
              <option value={2}>Discount By Order</option>
              <option value={3}>Discount By Category</option>
            </select>
          </div>
          {ShowError("Type")}
          <div className="">
            <div className="">
              <div className="label-form">
                Discount <span className="text-danger">*</span>
              </div>
              <input
                value={discount}
                type="number"
                className="form-control"
                placeholder="Enter discount %"
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
              />
            </div>
            {ShowError("Discount")}
          </div>
        </div>

        <div className=" group-btn">
          <button
            onClick={() => dispatch(setShowModal(false))}
            type="button"
            className="btn btn-outline-secondary"
          >
            Cancel
          </button>
          {form === "add" ? (
            <button
              onClick={() => addNew()}
              className="btn btn-general ps-3 pe-3"
            >
              Add new
            </button>
          ) : (
            <button
              onClick={() => save()}
              className="btn btn-general ps-3 pe-3"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SaleAdd;
