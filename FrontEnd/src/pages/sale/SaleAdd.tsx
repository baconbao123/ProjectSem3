import { FormControl, Switch, TextField, Grid, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  setLoading,
  setShowModal,
  setToast,
} from "@src/Store/Slinces/appSlice.ts";
import { useDispatch } from "react-redux";
import $axios from "@src/axios.ts";
import Cookies from "js-cookie";
import dayjs from "dayjs";

interface SaleAdd {
  loadDataTable: () => void;
  id?: any;
  form: string;
}
interface Category {
  Id: number;
  Name: string;
}

const SaleAdd: React.FC<SaleAdd> = ({ loadDataTable, form, id }) => {
  const [name, setName] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [categoryId, setCategoryId] = useState<number>(-1);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [type, setType] = useState<number>(1);
  const [discount, setDiscount] = useState<number>(0);
  const [status, setStatus] = useState<boolean>(false);
  const [error, setError] = useState<Record<string, string[]>>({});
  const [item, setItem] = useState<any>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const dispatch = useDispatch();
  const token = Cookies.get("token");

  useEffect(() => {
    if (form === "edit") {
      loadData();
    }
    fetchCategories();
  }, [form, id]);

  const fetchCategories = async () => {
    try {
      const response = await $axios.get("Category");
      setCategories(response.data.data.filter((category: Category) => category.Status === 1));
    } catch (error) {
      console.error("Failed to fetch categories", error);
      dispatch(setToast({ status: "error", message: "Error", data: "Failed to load categories." }));
    }
  };

  const loadData = () => {
    dispatch(setLoading(true));
    $axios.get(`Sale/${id}`)
      .then((res) => {
        const sale = res.data.data.Sale;
        if (sale) {
          setName(sale.Name);
          setType(sale.Type);
          setQuantity(sale.Quantity);
          setCategoryId(sale.CategoryId);
          setStartDate(dayjs(sale.StartDate).format("YYYY-MM-DDTHH:mm"));
          setEndDate(dayjs(sale.EndDate).format("YYYY-MM-DDTHH:mm"));
          setDiscount(sale.Discount * 100);
          setStatus(sale.Status);
          setItem(sale);
        }
      })
      .catch((err) => {
        console.error("Failed to load sale data", err);
        dispatch(setToast({ status: "error", message: "Error", data: "Failed to load sale data." }));
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

  const addNew = () => {
    setError({});
    if (!validateFields()) return;

    const formattedStartDate = startDate ? dayjs(startDate).format("YYYY-MM-DDTHH:mm") : "";
    const formattedEndDate = endDate ? dayjs(endDate).format("YYYY-MM-DDTHH:mm") : "";

    const dataForm = {
      Name: name,
      Discount: discount,
      Quantity: quantity,
      CategoryId: categoryId || null,
      StartDate: formattedStartDate || undefined,
      EndDate: formattedEndDate || undefined,
      Type: type,
      Status: status ? 1 : 0,
    };

    dispatch(setLoading(true));
    $axios.post("Sale", dataForm)
      .then(() => {
        loadDataTable();
        dispatch(setToast({ status: "success", message: "Success", data: "Add new discount successful" }));
        dispatch(setShowModal(false));
      })
      .catch((err) => {
        console.error("Failed to add new discount", err);
        if (err.response?.data?.errors) {
          setError(err.response.data.errors);
        }
        dispatch(setToast({ status: "error", message: "Error", data: "Something went wrong" }));
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

  const save = () => {
    setError({});
    if (!validateFields()) return;

    const dataForm = {
      Name: name,
      Discount: discount,
      Quantity: quantity,
      CategoryId: categoryId,
      StartDate: startDate,
      EndDate: endDate,
      Type: type,
      Status: status ? 1 : 0,
      Version: item.Version,
    };

    dispatch(setLoading(true));
    $axios.put(`Sale/${id}`, dataForm)
      .then(() => {
        loadDataTable();
        dispatch(setToast({ status: "success", message: "Success", data: "Edit Sale successful" }));
        dispatch(setShowModal(false));
      })
      .catch((err) => {
        console.error("Failed to save sale", err);
        if (err.response?.data?.errors) {
          setError(err.response.data.errors);
        }
        dispatch(setToast({ status: "error", message: "Error", data: "Something went wrong" }));
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(Number(e.target.value));
  };
  const handleTypeChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryId(Number(e.target.value));
  };


  const validateFields = () => {
    const newError: Record<string, string[]> = {};
    if (!name) {
      newError.Name = ["Name is required."];
    }
    if (discount > 100) {
      newError.Discount = ["Discount percentage cannot exceed 100."];
    }
    if (quantity < 0) {
      newError.Quantity = ["Quantity cannot be negative."];
    }
    if (!startDate) {
      newError.StartDate = ["Start date is required."];
    }
    if (!endDate) {
      newError.EndDate = ["End date is required."];
    } else if (!validateDates()) {
      newError.EndDate = ["End date cannot be before start date."];
    }
    setError(newError);
    return Object.keys(newError).length === 0; // Return true if no errors
  };

  const validateDates = () => {
    if (startDate && endDate) {
      return dayjs(endDate).isAfter(dayjs(startDate));
    }
    return true; // If dates are not provided, assume valid
  };

  const ShowError = (key: string) => {
    const messages = error[key];
    return messages ? <div className="text-danger mt-1">{messages[0]}</div> : null;
  };

  return (
    <div className="container-fluid">
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <TextField
            value={name || ""}
            label="Name discount"
            variant="outlined"
            fullWidth
            required
            onChange={(e) => setName(e.target.value)}
            error={!!error.Name}
            helperText={ShowError("Name")}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Start date and time"
            type="datetime-local"
            variant="outlined"
            fullWidth
            required
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            error={!!error.StartDate}
            helperText={ShowError("StartDate")}
            InputLabelProps={{ shrink: true }} // Ensure label stays above the input
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="End date and time"
            type="datetime-local"
            variant="outlined"
            fullWidth
            required
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            error={!!error.EndDate}
            helperText={ShowError("EndDate")}
            InputLabelProps={{ shrink: true }} 
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            value={quantity}
            label="Quantity"
            variant="outlined"
            type="number"
            fullWidth
            required
            onChange={(e) => setQuantity(Number(e.target.value))}
            error={!!error.Quantity}
            helperText={ShowError("Quantity")}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            value={discount}
            label="Discount Percentage"
            variant="outlined"
            type="number"
            fullWidth
            required
            onChange={(e) => setDiscount(Number(e.target.value))}
            error={!!error.Discount}
            helperText={ShowError("Discount")}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <div className="label-form">Status</div>
            <Switch
              checked={status}
              onChange={(e) => setStatus(e.target.checked)}
              color="primary"
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
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
          {type === 3 ? (
            <div className="">
              {/* Thêm dropdown để chọn Type */}
              <div className="">
                <div className="label-form">
                  Category <span className="text-danger">*</span>
                </div>
                <select
                  value={categoryId}
                  onChange={handleTypeChangeCategory}
                  className="form-control"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.Id} value={category.Id}>
                      {category.Name}
                    </option>
                  ))}
                </select>
              </div>
              {ShowError("Discount")}
            </div>
          ) : (
            " "
          )}
        </Grid>


        <Grid item xs={12} container  justifyContent="flex-end">
          <Button
            variant="contained"
           className="btn btn-general"
            onClick={form === "edit" ? save : addNew}
          >
            {form === "edit" ? "Edit" : "Add"}
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default SaleAdd;
