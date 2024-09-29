import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  setLoading,
  setShowModal,
  setToast,
} from "@src/Store/Slinces/appSlice.ts";
import $axios from "@src/axios.ts";
import Cookies from "js-cookie";
import { Email } from "@mui/icons-material";

interface CompanyAdd {
  loadDataTable: any;
  id?: any;
  form: string;
}

const CompanyAdd: React.FC<CompanyAdd> = ({ loadDataTable, form, id }) => {
  const [companiesList, setCompaniesList] = useState([
    {
      name: "",
      email: "",
      address: "",
      phone: "",
      type: "",
      status: false,
    },
  ]); // Mảng chứa các công ty cần thêm
  const [error, setError] = useState<any>({});
  const [item, setItem] = useState<any>({});
  const [companies, setCompanies] = useState<any[]>([]);
  const token = Cookies.get("token");
  const dispatch = useDispatch();

  useEffect(() => {
    if (form === "edit") {
      loadData();
    }
    loadCompanies(); // Load danh sách công ty cha
  }, []);

  const loadData = () => {
    dispatch(setLoading(true));
    $axios
      .get(`CompanyPartner/${id}`)
      .then((res) => {
        if (res.data.data && res.data.data.CompanyPartner) {
          const company = res.data.data.CompanyPartner;
          setCompaniesList([
            {
              name: company.Name || "",
              email: company.Email || "",
              address: company.Address || "",
              phone: company.Phone || "",
              type: company.Type,
              status: company.Status || false,
            },
          ]);
          setItem(company);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

  const loadCompanies = () => {
    // Load danh sách các công ty cha từ server
    $axios
      .get("CompanyPartner")
      .then((res) => {
        if (res.data.data) {
          setCompanies(res.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addNewCompany = () => {
    // Thêm một form công ty mới vào danh sách
    setCompaniesList([
      ...companiesList,
      { name: "", email: "", address: "", phone: "", type: "", status: false },
    ]);
  };

  const removeCompany = (index: number) => {
    // Xóa một form công ty
    const newCompaniesList = [...companiesList];
    newCompaniesList.splice(index, 1);
    setCompaniesList(newCompaniesList);
  };

  const handleChange = (index: number, field: string, value: any) => {
    // Thay đổi giá trị của từng form
    const newCompaniesList = [...companiesList];
    newCompaniesList[index] = { ...newCompaniesList[index], [field]: value };
    setCompaniesList(newCompaniesList);
  };

  const addNew = () => {
    setError({});
    dispatch(setLoading(true));
    const dataForm = companiesList.map((company) => ({
      Name: company.name,
      Email: company.email,
      Address: company.address,
      Phone: company.phone,
      Type: company.type || null,
      Status: company.status ? 1 : 0,
    }));
    $axios
      .post("CompanyPartner", dataForm)
      .then((res) => {
        loadDataTable();
        dispatch(
          setToast({
            status: "success",
            message: "Success",
            data: "Add new Companies successful",
          })
        );
        dispatch(setShowModal(false));
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.error || "Something went wrong";
        dispatch(
          setToast({
            status: "error",
            message: "Error",
            data: errorMessage,
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
      Name: companiesList[0].name,
      Email: companiesList[0].email,
      Address: companiesList[0].address,
      Phone: companiesList[0].phone,
      Type: companiesList[0].type,
      Status: companiesList[0].status ? 1 : 0,
      Version: item.Version,
    };
    console.log(dataForm)
    dispatch(setLoading(true));
    $axios
      .put(`CompanyPartner/${id}`, dataForm)
      .then((res) => {
        loadDataTable();
        dispatch(
          setToast({
            status: "success",
            message: "Success",
            data: "Edit Company successful",
          })
        );
        dispatch(setShowModal(false));
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.message || "Something went wrong";
        dispatch(
          setToast({
            status: "error",
            message: "Error",
            data: errorMessage,
          })
        );
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

  const ShowError: React.FC<{ errorKey: string }> = ({ errorKey }) => {
    let data: any[] = [];
    if (error[errorKey] && error[errorKey].length > 0) {
      data = error[errorKey];
    }
    return <div className="text-danger mt-1">{data[0] ? data[0] : ""} </div>;
  };

  return (
    <div className="container-fluid">
      {companiesList.map((company, index) => (
        <div className="row" key={index}>
          <div className="col-6">
            <div className="">
              <div className="label-form">
                Name <span className="text-danger">*</span>
              </div>
              <input
                value={company.name}
                className="form-control"
                placeholder="Enter name"
                onChange={(e) => handleChange(index, "name", e.target.value)}
              />
              <ShowError errorKey="Name" />
            </div>
            <div className="">
              <div className="label-form">
                Email <span className="text-danger">*</span>
              </div>
              <input
                value={company.email}
                className="form-control"
                placeholder="Enter email"
                onChange={(e) => handleChange(index, "address", e.target.value)}
              />
              <ShowError errorKey="Email" />
            </div>
            <div className="">
              <div className="label-form">
                Address <span className="text-danger">*</span>
              </div>
              <input
                value={company.address}
                className="form-control"
                placeholder="Enter address"
                onChange={(e) => handleChange(index, "address", e.target.value)}
              />
              <ShowError errorKey="Address" />
            </div>

            <div className="mt-3">
              <div className="label-form">
                Status <span className="text-danger">*</span>
              </div>
              <div className="form-check form-switch">
                <input
                  checked={company.status}
                  onChange={(e) =>
                    handleChange(index, "status", e.target.checked)
                  }
                  className="form-check-input form-switch switch-input"
                  type="checkbox"
                  id="flexSwitchCheckDefault"
                />
              </div>
              <ShowError errorKey="Status" />
            </div>

           
          </div>

          <div className="col-6">
            <div className="">
              <div className="label-form">Phone</div>
              <input
                value={company.phone}
                className="form-control"
                placeholder="Enter phone number"
                onChange={(e) => handleChange(index, "phone", e.target.value)}
              />
              <ShowError errorKey="Phone" />
            <div className=" ">
              <div className="label-form">Parent Company <span className="text-danger">*</span></div>
              <select
                className="form-select"
                value={company.type}
                onChange={(e) => handleChange(index, "type", e.target.value)}
              >
                <option value="">Select Parent Company</option>
                <option value="Manufacturer">Manufacturer</option>
                <option value="Publisher">Publisher</option>
              </select>
              <ShowError errorKey="ParentCompany" />
            </div> 
            </div>

            <div className="mt-3"></div>
          </div>

          {form === "add" && (
            <div className="col-12 mt-3 d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => removeCompany(index)}
              >
                Remove
              </button>
            </div>
          )}
        </div>
      ))}
      <div className="row">
        {form === "add" && (
          <div className="col-12 mt-3 d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={addNewCompany}
            >
              Add New
            </button>
          </div>
        )}

        <div className="col-12 mt-3 d-flex justify-content-center">
          <button  onClick={() => dispatch(setShowModal(false))}
          type="button"
          className="btn btn-outline-secondary mx-3" >Cancel</button>
          {form === "add" ? (
            <button type="button" onClick={addNew} className="btn btn-primary ">
              Save All
            </button>
          ) : (
            <button type="button" onClick={save} className="btn btn-primary">
              Update
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyAdd;
