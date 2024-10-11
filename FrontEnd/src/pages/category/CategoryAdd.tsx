import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading, setShowModal, setToast } from "@src/Store/Slinces/appSlice.ts";
import $axios from "@src/axios.ts";
import Cookies from "js-cookie";
import "@assets/styles/category.scss"
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
import CloseIcon from "@mui/icons-material/Close";

interface CategoryAddProps {
  loadDataTable: () => void;
  id?: any;
  form: string;
}

const CategoryAdd: React.FC<CategoryAddProps> = ({ loadDataTable, form, id }) => {
  const [categoriesList, setCategoriesList] = useState([
    {
      name: '',
      description: '',
      parentId: '',
      status: false,
    }
  ]); // Mảng chứa các danh mục cần thêm
  const [error, setError] = useState<{ [key: string]: string }>({});
  const [item, setItem] = useState<any>({});
  const [categories, setCategories] = useState<any[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (form === "edit") {
      loadData();
    }
    loadCategories(); // Load danh sách danh mục cha
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = () => {
    dispatch(setLoading(true));
    $axios.get(`Category/${id}`)
      .then((res) => {
        if (res.data.data && res.data.data.Category ) {
          const category = res.data.data.Category;
          setCategoriesList([{
            name: category.Name || '',
            description: category.Description || '',
            parentId: category.ParentId ? category.ParentId.toString() : '',
            status: category.Status ? true : false,
          }]);
          setItem(category);
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(setToast({
          status: "error",
          message: "Error",
          data: "Failed to load category data",
        }));
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

  const loadCategories = () => {
    // Load danh sách các danh mục cha từ server
    $axios
      .get("Category")
      .then((res) => {
        if (res.data.data ) {
          setCategories(res.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(setToast({
          status: "error",
          message: "Error",
          data: "Failed to load parent categories",
        }));
      });
  };

  const addNewCategory = () => {
    // Thêm một form danh mục mới vào danh sách
    setCategoriesList([
      ...categoriesList,
      { name: "", description: "", parentId: "", status: false }
    ]);
  };

  const removeCategory = (index: number) => {
    // Xóa một form danh mục
    const newCategoriesList = [...categoriesList];
    newCategoriesList.splice(index, 1);
    setCategoriesList(newCategoriesList);
  };

  const handleChange = (index: number, field: string, value: any) => {
    // Thay đổi giá trị của từng form
    const newCategoriesList = [...categoriesList];
    newCategoriesList[index] = { ...newCategoriesList[index], [field]: value };
    setCategoriesList(newCategoriesList);
  };

  const validate = (): boolean => {
    const newError: { [key: string]: string } = {};

    categoriesList.forEach((category, index) => {
      if (!category.name.trim()) {
        newError[`name-${index}`] = "Name is required";
      }


      if (!category.parentId) {
        newError[`parentId-${index}`] = "Parent Category is required";
      }

      // Status là boolean, không cần validation trừ khi bạn có quy tắc cụ thể
      // Giả sử status luôn có giá trị true hoặc false
    });

    setError(newError);
    return Object.keys(newError).length === 0;
  };

  const addNew = () => {
    if (!validate()) return;

    dispatch(setLoading(true));
    const dataForm = categoriesList.map(category => ({
      Name: category.name,
      Description: category.description,
      ParentId: parseInt(category.parentId) || null,
      Status: category.status ? 1 : 0,
    }));

    $axios
      .post("Category", dataForm)
      .then((res) => {
        loadDataTable();
        dispatch(setToast({
          status: "success",
          message: "Success",
          data: "Add new Categories successful",
        }));
        dispatch(setShowModal(false));
      })
      .catch((err) => {
        console.log(err);
        const errorMessage = err.response?.data?.errors?.[0]?.message || "Something went wrong";
        dispatch(setToast({
          status: "error",
          message: "Error",
          data: errorMessage,
        }));
        if (err.response?.data?.errors) {
          const serverErrors: { [key: string]: string } = {};
          err.response.data.errors.forEach((errorItem: any) => {
            serverErrors[errorItem.field.toLowerCase()] = errorItem.message;
          });
          setError(serverErrors);
        }
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

  const save = () => {
    if (!validate()) return;

    const dataForm = {
      Name: categoriesList[0].name,
      Description: categoriesList[0].description,
      ParentId: categoriesList[0].parentId ? parseInt(categoriesList[0].parentId) : null,
      Status: categoriesList[0].status ? 1 : 0,
      Version: item.Version,
    };

    dispatch(setLoading(true));
    $axios
      .put(`Category/${id}`, dataForm)
      .then((res) => {
        loadDataTable();
        dispatch(setToast({
          status: "success",
          message: "Success",
          data: "Edit Category successful",
        }));
        dispatch(setShowModal(false));
      })
      .catch((err) => {
        console.log(err);
        const errorMessage = err.response?.data?.message || "Something went wrong";
        dispatch(setToast({
          status: "error",
          message: "Error",
          data: errorMessage,
        }));
        if (err.response?.data?.errors) {
          const serverErrors: { [key: string]: string } = {};
          err.response.data.errors.forEach((errorItem: any) => {
            serverErrors[errorItem.field.toLowerCase()] = errorItem.message;
          });
          setError(serverErrors);
        }
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

  const ShowError: React.FC<{ errorKey: string }> = ({ errorKey }) => {
    return error[`${errorKey.toLowerCase()}`] ? (
      <div className="text-danger mt-1">{error[`${errorKey.toLowerCase()}`]}</div>
    ) : null;
  };

  return (
    <div className="container-fluid mt-3">
      <Grid>
        {categoriesList.map((category, index) => (
          <Grid container spacing={2} key={index} alignItems="center" className="mb-3">
            {/* Left Column */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Name Category"
                value={category.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                error={!!error[`name-${index}`]}
                helperText={error[`name-${index}`]}
                fullWidth
                required
              />
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Parent Category"
                select
                value={category.parentId}
                onChange={(e) => handleChange(index, "parentId", e.target.value)}
                error={!!error[`parentId-${index}`]}
                helperText={error[`parentId-${index}`]}
                fullWidth
                required
              >
                <MenuItem value="">Select Parent Category</MenuItem>
                {categories
                  .filter(cat => cat.Status !== 0)
                  .map((cat) => (
                    <MenuItem key={cat.Id} value={cat.Id.toString()}>
                      {"-".repeat(cat.Level) + " " + cat.Name}
                    </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                label="Description"
                value={category.description}
                onChange={(e) => handleChange(index, "description", e.target.value)}
           
                fullWidth
                multiline
                rows={4}
           
              />
            </Grid>

            {/* Status */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={category.status}
                    onChange={(e) => handleChange(index, "status", e.target.checked)}
                    color="primary"
                  />
                }
                label="Status"
              />
              {error[`status-${index}`] && (
                <div className="text-danger mt-1">{error[`status-${index}`]}</div>
              )}
            </Grid>

            {/* Remove Button */}
            {form === "add" && (
              <Grid item xs={12} className="d-flex justify-content-end">
                <IconButton
                  color="secondary"
                  onClick={() => removeCategory(index)}
                  disabled={categoriesList.length === 1}
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            )}
          </Grid>
        ))}

        {/* Add More Button */}
        {form === "add" && (
          <Grid container justifyContent="flex-end" className="mb-3">
            <Button
              variant="outlined"
              color="primary"
              startIcon={<AddIcon />}
              onClick={addNewCategory}
            >
              Add More Category
            </Button>
          </Grid>
        )}

        {/* Action Buttons */}
        <Grid container spacing={2} className="mt-3">
          <Grid item xs={12} className="d-flex justify-content-center">
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => dispatch(setShowModal(false))}
              className="mx-3"
              startIcon={<CloseIcon />}
            >
              Cancel
            </Button>
            {form === "add" ? (
              <Button
                variant="contained"
                color="primary"
                onClick={addNew}
              >
                Save All
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={save}
              >
                Save
              </Button>
            )}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default CategoryAdd;
