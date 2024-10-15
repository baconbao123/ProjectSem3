import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  setLoading,
  setShowModal,
  setToast,
} from "@src/Store/Slinces/appSlice.ts";
import $axios from "@src/axios.ts";
import Cookies from "js-cookie";
import {
  TextField,
  MenuItem,
  IconButton,
  Grid,
  Button,
  Switch,
  FormControlLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

interface CompanyAddProps {
  loadDataTable: () => void;
  id?: any;
  form: string;
}

const CompanyAdd: React.FC<CompanyAddProps> = ({ loadDataTable, form, id }) => {
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
              type: company.Type || "",
              status: company.Status ? true : false,
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

  const validate = () => {
    const newError: any = {};
    companiesList.forEach((company, index) => {
      if (!company.name.trim()) newError[`name-${index}`] = "Name is required";
      if (!company.email.trim()) {
        newError[`email-${index}`] = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(company.email)) {
        newError[`email-${index}`] = "Invalid email format";
      }
      if (!company.address.trim()) newError[`address-${index}`] = "Address is required";
      if (!company.phone.trim()) {
        newError[`phone-${index}`] = "Phone number is required";
      } else if (!/^\d{10}$/.test(company.phone)) {
        newError[`phone-${index}`] = "Phone number must be 10 digits";
      }
      if (!company.type) newError[`type-${index}`] = "Parent Company is required";
    });
    setError(newError);
    return Object.keys(newError).length === 0;
  };

  const addNew = () => {
    if (!validate()) return;

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

  const save = () => {
    if (!validate()) return;

    const dataForm = {
      Name: companiesList[0].name,
      Email: companiesList[0].email,
      Address: companiesList[0].address,
      Phone: companiesList[0].phone,
      Type: companiesList[0].type,
      Status: companiesList[0].status ? 1 : 0,
      Version: item.Version,
    };

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
    const errorMessages = Object.keys(error).filter((key) =>
      key.startsWith(errorKey)
    ).map((key) => error[key]);

    return errorMessages.length > 0 ? (
      <div className="text-danger mt-1">{errorMessages[0]}</div>
    ) : null;
  };

  return (
    <div className="container-fluid mt-4">
      {companiesList.map((company, index) => (
        <div  style={{ border: "1px solid #ccc", borderRadius: "8px", padding:"10px", marginBottom:"20px" }} >
        <Grid container spacing={2} key={index} alignItems="center" className="mb-3">
          <Grid item xs={12} md={6}>
            <TextField
              label="Name"
              value={company.name}
              onChange={(e) => handleChange(index, "name", e.target.value)}
              error={!!error[`name-${index}`]}
              helperText={error[`name-${index}`]}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Email"
              type="email"
              value={company.email}
              onChange={(e) => handleChange(index, "email", e.target.value)}
              error={!!error[`email-${index}`]}
              helperText={error[`email-${index}`]}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Address"
              value={company.address}
              onChange={(e) => handleChange(index, "address", e.target.value)}
              error={!!error[`address-${index}`]}
              helperText={error[`address-${index}`]}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Phone"
              type="text"
              value={company.phone}
              onChange={(e) => handleChange(index, "phone", e.target.value)}
              error={!!error[`phone-${index}`]}
              helperText={error[`phone-${index}`]}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Parent Company"
              select
              value={company.type}
              onChange={(e) => handleChange(index, "type", e.target.value)}
              error={!!error[`type-${index}`]}
              helperText={error[`type-${index}`]}
              fullWidth
              required
            >
              <MenuItem value="">Select Parent Company</MenuItem>
              <MenuItem value="Manufacturer">Manufacturer</MenuItem>
              <MenuItem value="Publisher">Publisher</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={company.status}
                  onChange={(e) =>
                    handleChange(index, "status", e.target.checked)
                  }
                  color="primary"
                />
              }
              label="Status"
            />
          </Grid>
          {form === "add" && (
            <Grid item xs={12} md={12} className="d-flex justify-content-end">
              <IconButton
                color="secondary"
                className="btn btn-general"
                onClick={() => removeCompany(index)}
              >
                <DeleteIcon  />
              </IconButton>
            </Grid>
          )}
        </Grid>
        </div>
      ))}
      

      {form === "add" && (
        <Grid container justifyContent="flex-end" className="mb-3">
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            onClick={addNewCompany}
          >
            Add New Company
          </Button>
        </Grid>
      )}

      <Grid container spacing={2} className="mt-3">
        <Grid item xs={12} className="d-flex justify-content-center">
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => dispatch(setShowModal(false))}
            className="mx-3"
          >
            Cancel
          </Button>
          {form === "add" ? (
            <Button
              variant="contained"
             className="btn btn-general"
              onClick={addNew}
            >
              Save All
            </Button>
          ) : (
            <Button
              variant="contained"
              className="btn btn-general"
              onClick={save}
            >
              Update
            </Button>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default CompanyAdd;
