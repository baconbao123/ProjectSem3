import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading, setShowModal, setToast } from "@src/Store/Slinces/appSlice.ts";
import $axios from "@src/axios.ts";
import "@assets/styles/category.scss";
import {
  TextField,
  MenuItem,
  Grid,
  Button,
  Switch,
  FormControlLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FileUpload } from "primereact/fileupload";

interface CategoryAddProps {
  loadDataTable: () => void;
  id?: any;
  form: string; // "add" hoặc "edit"
}

interface Category {
  name: string;
  description: string;
  parentId: string;
  status: boolean;
  imgFile: File | null;
  imgPreview: string;
}

const CategoryAdd: React.FC<CategoryAddProps> = ({ loadDataTable, form, id }) => {
  const [category, setCategory] = useState<Category>({
    name: "",
    description: "",
    parentId: "",
    status: false,
    imgFile: null,
    imgPreview: "",
  }); // Đối tượng chứa thông tin danh mục cần thêm/chỉnh sửa
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
    $axios
      .get(`Category/${id}`)
      .then((res) => {
        if (res.data.data && res.data.data.Category) {
          const fetchedCategory = res.data.data.Category;
          setCategory({
            name: fetchedCategory.Name || "",
            description: fetchedCategory.Description || "",
            parentId: fetchedCategory.ParentId ? fetchedCategory.ParentId.toString() : "",
            status: fetchedCategory.Status ? true : false,
            imgFile: null, // Không có tệp ảnh mới được chọn
            imgPreview: fetchedCategory.ImgThumbCategory || "", // Sử dụng đường dẫn ảnh hiện tại
          });
          setItem(fetchedCategory);
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(
          setToast({
            status: "error",
            message: "Error",
            data: "Failed to load category data",
          })
        );
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
        if (res.data.data) {
          setCategories(res.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(
          setToast({
            status: "error",
            message: "Error",
            data: "Failed to load parent categories",
          })
        );
      });
  };

  const handleChange = (field: string, value: any) => {
    // Thay đổi giá trị của từng trường trong form
    setCategory({ ...category, [field]: value });
  };

  const onUpload = (event: any) => {
    // Xử lý khi người dùng tải lên tệp ảnh
    if (event.files && event.files.length > 0) {
      const file = event.files[0];
      setCategory({
        ...category,
        imgFile: file,
        imgPreview: URL.createObjectURL(file), // Tạo URL để hiển thị ảnh trước khi tải lên
      });
    }
  };

  const onRemove = (event: any) => {
    // Xử lý khi người dùng xóa tệp ảnh đã chọn
    setCategory({
      ...category,
      imgFile: null,
      imgPreview: "",
    });
  };

  const validate = (): boolean => {
    const newError: { [key: string]: string } = {};

    if (!category.name.trim()) {
      newError["name"] = "Name is required";
    }

    // if (!category.parentId) {
    //   newError["parentId"] = "Parent Category is required";
    // }

    // Nếu ở chế độ thêm mới, bắt buộc phải có ảnh
    // if (form === "add" && !category.imgFile) {
    //   newError["imgFile"] = "Image is required";
    // }

    setError(newError);
    return Object.keys(newError).length === 0;
  };

  const addNew = () => {
    if (!validate()) return;

    dispatch(setLoading(true));

    // Tạo FormData để gửi dưới dạng multipart/form-data
    const formData = new FormData();
    formData.append("Name", category.name);
    formData.append("Description", category.description);
    formData.append("ParentId", category.parentId ? category.parentId : "");
    formData.append("Status", category.status ? "1" : "0");

    if (category.imgFile) {
      formData.append("imgThumbCategory", category.imgFile);
    }

    $axios
      .post("Category", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        loadDataTable();
        dispatch(
          setToast({
            status: "success",
            message: "Success",
            data: "Add new Category successful",
          })
        );
        dispatch(setShowModal(false));
      })
      .catch((err) => {
        console.log(err);
        const errorMessage =
          err.response?.data?.message || "Something went wrong";
        dispatch(
          setToast({
            status: "error",
            message: "Error",
            data: errorMessage,
          })
        );
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

    dispatch(setLoading(true));

    // Tạo FormData để gửi dưới dạng multipart/form-data
    const formData = new FormData();
    formData.append("Name", category.name);
    formData.append("Description", category.description);
    formData.append("ParentId", category.parentId ? category.parentId : "");
    formData.append("Status", category.status ? "1" : "0");
    formData.append("Version", item.Version.toString());

    if (category.imgFile) {
      formData.append("ImgThumbCategory", category.imgFile);
    }

    $axios
      .put(`Category/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        loadDataTable();
        dispatch(
          setToast({
            status: "success",
            message: "Success",
            data: "Edit Category successful",
          })
        );
        dispatch(setShowModal(false));
      })
      .catch((err) => {
        console.log(err);
        const errorMessage =
          err.response?.data?.message || "Something went wrong";
        dispatch(
          setToast({
            status: "error",
            message: "Error",
            data: errorMessage,
          })
        );
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
      <Grid container spacing={2}>
        {/* Name Category */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Name Category"
            value={category.name}
            onChange={(e) => handleChange("name", e.target.value)}
            error={!!error["name"]}
            helperText={error["name"]}
            fullWidth
            required
          />
        </Grid>

        {/* Parent Category */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Parent Category"
            select
            value={category.parentId}
            onChange={(e) => handleChange("parentId", e.target.value)}
            fullWidth
        
          >
            <MenuItem value="">Select Parent Category</MenuItem>
            {categories
              .filter((cat) => cat.Status !== 0)
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
            onChange={(e) => handleChange("description", e.target.value)}
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
                onChange={(e) => handleChange("status", e.target.checked)}
                color="primary"
              />
            }
            label="Status"
          />
          {error["status"] && (
            <div className="text-danger mt-1">{error["status"]}</div>
          )}
        </Grid>

        {/* Image Upload using PrimeReact FileUpload */}
        <Grid item xs={12}>
          <FileUpload
            name="imgThumbCategory"
            url="" // Không cần URL vì chúng ta sẽ xử lý upload thủ công
            accept="image/*"
            maxFileSize={2000000} // 2MB
            onSelect={(e) => {
              if (e.files && e.files.length > 0) {
                const file = e.files[0];
                setCategory({
                  ...category,
                  imgFile: file,
                  imgPreview: URL.createObjectURL(file),
                });
              }
            }}
            onRemove={(e) => {
              setCategory({
                ...category,
                imgFile: null,
                imgPreview: "",
              });
            }}
            customUpload
            uploadHandler={() => {}} // Không cần thực hiện upload tự động
            // headerTemplate={() => null} // Ẩn header
            // itemTemplate={() => null} // Ẩn danh sách tệp
          />
          {error["imgFile"] && (
            <div className="text-danger mt-1">{error["imgFile"]}</div>
          )}
          {category.imgPreview && (
            <div className="mt-2">
              <img
                src={category.imgPreview}
                alt="Thumbnail Preview"
                style={{ width: "200px", height: "auto", borderRadius: "8px" }}
              />
            </div>
          )}
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={12} className="d-flex justify-content-center mt-3">
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
            <Button variant="contained" color="primary" onClick={addNew}>
              Save
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={save}>
              Save
            </Button>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default CategoryAdd;
