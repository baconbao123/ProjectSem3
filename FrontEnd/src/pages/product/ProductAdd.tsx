import {
  FormControl,
  Switch,
  TextField,
  Chip,
  Autocomplete,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
  MenuItem,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  setLoading,
  setShowModal,
  setToast,
} from "@src/Store/Slinces/appSlice.ts";
import { useDispatch } from "react-redux";
import $axios from "@src/axios.ts";
import Cookies from "js-cookie";
import { Editor, EditorTextChangeEvent } from "primereact/editor";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add"; // Import icon thêm mới
import "@assets/styles/product.scss";
import { Email } from "@mui/icons-material";
import { Image } from "primereact/image";

interface ProductAddProps {
  loadDataTable: () => void;
  id?: number;
  form: "add" | "edit" | "copy";
}

interface Company {
  Id: number;
  Name: string;
}

interface Author {
  Id: number;
  Name: string;
  Biography: string;
}

interface Category {
  Id: number;
  Name: string;
  Level: number;
  Status: number; // Thêm Status để kiểm tra active
}

const ProductAdd: React.FC<ProductAddProps> = ({ loadDataTable, form, id }) => {
  const baseUrl = import.meta.env.VITE_BASE_URL_LOCALHOST;
  const [name, setName] = useState("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState(true);
  const [error, setError] = useState<Record<string, any>>({});
  const [item, setItem] = useState<any>({});
  const [basePrice, setBasePrice] = useState(0);
  const [sellPrice, setSellPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [companyPartnerId, setCompanyPartnerId] = useState<number>(0);
  const [productImages, setProductImages] = useState<File[]>([]); // Hình ảnh mới
  const [selectedThumb, setSelectedThumb] = useState<File | null>(null); // Thumbnail mới
  const [authorIds, setAuthorIds] = useState<number[]>([]);
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]); // Hình ảnh hiện có
  const [deletedImages, setDeletedImages] = useState<string[]>([]); // Hình ảnh bị xóa
  const token = Cookies.get("token");
  const [currentForm, setCurrentForm] = useState<"add" | "edit" | "copy">(form);
  const dispatch = useDispatch();

  useEffect(() => {
    if ((currentForm === "edit" || currentForm === "copy") && id) {
      loadData();
    }
    fetchAuthorsAndCategories();
  }, [currentForm, id]);

  const loadData = async () => {
    dispatch(setLoading(true));
    try {
      const res = await $axios.get(`Product/${id}`);
      const product = res.data.data;

      if (product) {
        setName(product[0].Name || "");
        setDescription(product[0].Description || "");
        setStatus(product[0].Status === 1);
        setBasePrice(product[0].BasePrice || 0);
        setSellPrice(product[0].SellPrice || 0);
        setQuantity(product[0].Quantity || 0);
        setCompanyPartnerId(product[0].CompanyPartnerId || 0);

        // Lấy tất cả các AuthorIds
        const authorIds = product[0].Authors.map((author: Author) => author.Id);
        setAuthorIds(authorIds);

        // Lấy tất cả các CategoryIds
        const categoryIds = product[0].Categories.map(
          (category: Category) => category.Id
        );
        setCategoryIds(categoryIds);

        // Xử lý hình ảnh hiện có
        if (product[0].ProductImages) {
          setExistingImages(product[0].ProductImages);
        }
        setItem(product[0]);
        if (currentForm === "copy") {
          setName(product[0].Name + " (Copy)");
          setExistingImages([]); // Xóa hình ảnh hiện có nếu cần
          setProductImages([]); // Xóa hình ảnh mới nếu cần
          setSelectedThumb(null); // Xóa thumbnail nếu cần
          setDeletedImages([]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchAuthorsAndCategories = async () => {
    try {
      const [authorsResponse, categoriesResponse, companiesResponse] =
        await Promise.all([
          $axios.get("/Common/author"),
          $axios.get("/Common/category"),
          $axios.get("/Common/companypartner"),
        ]);

      setAuthors(
        authorsResponse.data.data.filter(
          (author: Author) => author.Status === 1
        )
      );
      setCategories(
        categoriesResponse.data.data.filter(
          (category: Category) => category.Status === 1
        )
      );
      setCompanies(
        companiesResponse.data.data.filter(
          (company: Company) => company.Status === 1
        )
      );
    } catch (error) {
      console.error(
        "Failed to fetch authors, categories, and companies",
        error
      );
    }
  };

  // Hàm xử lý chọn Thumbnail
  const handleThumbnailSelect = (event: any) => {
    const selectedFiles: File[] = event.files;
    if (selectedFiles && selectedFiles.length > 0) {
      setSelectedThumb(selectedFiles[0]);
    }
  };

  // Hàm xử lý chọn hình ảnh sản phẩm
  const handleProductImagesSelect = (event: any) => {
    const selectedFiles: File[] = event.files;
    setProductImages((prevImages) => [...prevImages, ...selectedFiles]);
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCompanyPartnerId(Number(e.target.value));
  };

  const handleRemoveImage = (index: number) => {
    setProductImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  // Hàm xử lý khi người dùng xóa một hình ảnh hiện có
  const handleRemoveExistingImage = (index: number) => {
    const newImages = existingImages.filter(
      (_, imgIndex) => imgIndex !== index
    );

    // Thêm hình ảnh đã xóa vào danh sách deletedImages
    setDeletedImages([...deletedImages, existingImages[index]]);

    // Cập nhật trạng thái hình ảnh hiện có
    setExistingImages(newImages);
  };

  // Validate
  const validateForm = (): boolean => {
    const newErrors: Record<string, string[]> = {};

    // Kiểm tra Name
    if (!name.trim()) {
      newErrors.Name = ["Name product is required."];
    }

    // Kiểm tra Status (thường là checkbox nên có giá trị mặc định)

    // Kiểm tra Company Partner
    if (companyPartnerId === 0) {
      newErrors.CompanyPartnerId = ["Please select a Company Partner."];
    }

    // // Kiểm tra Authors
    // if (authorIds.length === 0) {
    //   newErrors.AuthorIds = ["At least one author must be selected."];
    // }

    // Kiểm tra Categories
    if (categoryIds.length === 0) {
      newErrors.CategoryIds = ["At least one category must be selected."];
    }

    // Kiểm tra Description
    if (!description.trim()) {
      newErrors.Description = ["Description is required."];
    }

    // Kiểm tra Thumbnail
    if (!selectedThumb && currentForm === "add") {
      // Ensure thumbnail is required only for 'add'
      newErrors.ImageThumbPath = ["Thumbnail image is required."];
    }

    // Kiểm tra Product Images
    if (productImages.length === 0 && existingImages.length === 0) {
      newErrors.ProductImages = ["At least one product image is required."];
    }

    setError(newErrors);

    // Trả về true nếu không có lỗi
    return Object.keys(newErrors).length === 0;
  };
  const addNewProduct = async () => {
    setError({});

    // Validate form
    if (!validateForm()) {
      return;
    }
    const formData = new FormData();
    formData.append("Name", name);
    formData.append("Description", description);
    formData.append("BasePrice", basePrice.toString());
    formData.append("SellPrice", sellPrice.toString());
    formData.append("Quantity", quantity.toString());
    formData.append("CompanyPartnerId", companyPartnerId.toString());
    formData.append("Status", status ? "1" : "0");

    authorIds.forEach((id) => formData.append("AuthorIds", id.toString()));
    categoryIds.forEach((id) => formData.append("CategoryIds", id.toString()));
    productImages.forEach((file) => formData.append("ProductImages", file));

    if (selectedThumb) {
      formData.append("ImageThumbPath", selectedThumb);
    }

    dispatch(setLoading(true));
    try {
      await $axios.post("Product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      loadDataTable();
      dispatch(
        setToast({ status: "success", message: "Add new product successful" })
      );
      dispatch(setShowModal(false));
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors);
      }
      dispatch(
        setToast({
          status: "error",
          message: err.response?.data?.message || "Something went wrong",
        })
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  const updateProduct = async () => {
    setError({});

    // Validate form
    if (!validateForm()) {
      return; // Dừng nếu không xác thực được form
    }

    const formData = new FormData();
    // Thêm các trường thông tin sản phẩm vào FormData
    formData.append("Name", name);
    formData.append("Description", description);
    formData.append("Status", status ? "1" : "0");
    formData.append("Version", item.Version);
    formData.append("BasePrice", basePrice.toString());
    formData.append("SellPrice", sellPrice.toString());
    formData.append("Quantity", quantity.toString());
    formData.append("CompanyPartnerId", companyPartnerId.toString());

    // Thêm các AuthorIds vào FormData
    authorIds.forEach((id) => formData.append("AuthorIds", id.toString()));
    // Thêm các CategoryIds vào FormData
    categoryIds.forEach((id) => formData.append("CategoryIds", id.toString()));
    // Thêm các hình ảnh sản phẩm vào FormData
    productImages.forEach((file) => formData.append("ProductImages", file));

    // Thêm hình ảnh thumbnail nếu có
    if (selectedThumb) {
      formData.append("ImageThumbPath", selectedThumb);
    }
  
    // Gửi danh sách các hình ảnh đã bị xóa
    deletedImages.forEach((imgPath) =>
      formData.append("DeletedImages", imgPath)
    );
    console.log("Deleted Images:", deletedImages);
    // Bắt đầu trạng thái loading
    dispatch(setLoading(true));
    try {
      // Gửi yêu cầu PUT đến API
      await $axios.put(`Product/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Tải lại dữ liệu cho bảng
      loadDataTable();
      // Hiển thị thông báo thành công
      dispatch(
        setToast({ status: "success", message: "Edit product successful" })
      );
      // Đóng modal
      dispatch(setShowModal(false));
    } catch (err) {
      // Xử lý lỗi nếu có
      if (err.response?.data?.errors) {
        setError(err.response.data.errors);
      }
      // Hiển thị thông báo lỗi
      dispatch(
        setToast({
          status: "error",
          message: err.response?.data?.message || "Something went wrong",
        })
      );
    } finally {
      // Kết thúc trạng thái loading
      dispatch(setLoading(false));
    }
  };

  const ShowError: React.FC<{ field: string }> = ({ field }) => {
    const messages = error[field] || [];
    return messages.length > 0 ? (
      <div className="text-danger mt-1">{messages[0]}</div>
    ) : null;
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Các trường Name, Status */}
        <div className="col-6 mt-2">
          <TextField
            value={name}
            type="text"
            onChange={(e) => setName(e.target.value)}
            className="form-control"
            label="Name product"
            variant="outlined"
            error={!!error.Name}
            helperText={error.Name ? error.Name[0] : ""}
            required
          />
          <div className="mt-3">
            <label className="label-form">
              Status <span className="text-danger">*</span>
            </label>
            <div className="form-check form-switch">
              <input
                checked={status}
                onChange={(e) => setStatus(e.target.checked)}
                className={`form-check-input form-switch switch-input ${
                  error.Status ? "is-invalid" : ""
                }`}
                type="checkbox"
                id="statusSwitch"
              />
            </div>
          </div>
        </div>
        <div className="col-6"></div>
        {/* Các trường Company Partner */}
        <div className="col-6 mt-3">
          <TextField
            select
            label="Company Partner"
            value={companyPartnerId}
            onChange={handleCompanyChange}
            variant="outlined"
            fullWidth
            error={!!error.CompanyPartnerId}
            helperText={error.CompanyPartnerId ? error.CompanyPartnerId[0] : ""}
            required
          >
            <MenuItem value={0}>--Select--</MenuItem>
            {companies.map((company) => (
              <MenuItem key={company.Id} value={company.Id}>
                {company.Name}
              </MenuItem>
            ))}
          </TextField>
          {/* <IconButton
            color="primary"
            onClick={handleOpenAddCompany}
            style={{ marginLeft: 8 }}
          >
            <AddIcon />
          </IconButton> */}
        </div>
        <div className="col-6"></div>
        {/* Các trường BasePrice, SellPrice, Quantity */}
        <div className="col-4 mt-3">
          <TextField
            value={basePrice}
            type="number"
            onChange={(e) => setBasePrice(Number(e.target.value))}
            className="form-control"
            label="Base Price"
            variant="outlined"
            required
          />
        </div>

        <div className="col-4 mt-3">
          <TextField
            value={sellPrice}
            type="number"
            onChange={(e) => setSellPrice(Number(e.target.value))}
            className="form-control"
            label="Sell Price"
            variant="outlined"
            required
          />
        </div>

        <div className="col-4 mt-3">
          <TextField
            value={quantity}
            type="number"
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="form-control"
            label="Quantity"
            variant="outlined"
            required
          />
        </div>

        {/* Trường Description */}
        <div className="col-12">
          <div>
            <label className="label-form">
              Description <span className="text-danger">*</span>
            </label>
            <Editor
              value={description}
              style={{ height: "200px" }}
              onTextChange={(e: EditorTextChangeEvent) =>
                setDescription(e.htmlValue || "")
              }
            />
            <ShowError field="Description" />
          </div>
        </div>

        {/* Các trường Author */}
        <div className="col-6 mt-3">
          <label className="label-form">
            Authors <span className="text-danger">*</span>
          </label>
          <div className="d-flex align-items-center">
            <Autocomplete
              multiple
              options={authors}
              value={authors.filter((author) => authorIds.includes(author.Id))}
              getOptionLabel={(option) => {
                const index = authors.findIndex((a) => a.Id === option.Id) + 1;
                return `${option.Name} (Author #${index})`; // Thêm số thứ tự tác giả
              }}
              onChange={(event, newValue) => {
                setAuthorIds(newValue.map((author) => author.Id));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Select authors"
                  error={!!error.AuthorIds}
                  helperText={error.AuthorIds ? error.AuthorIds[0] : ""}
                />
              )}
              renderOption={(props, option) => (
                <Tooltip
                  title={
                    <div>
                      <strong>Id:</strong> {option.Id} <br />
                      <strong>Name author:</strong> {option.Name} <br />
                      <strong>Biology:</strong> {option.Biography} <br />
                    </div>
                  }
                  arrow
                >
                  <li {...props}>{option.Name}</li>
                </Tooltip>
              )}
              style={{ flexGrow: 1 }}
            />
            {/* <IconButton
              color="primary"
              onClick={handleOpenAddAuthor}
              style={{ marginLeft: 8 }}
            >
              <AddIcon />
            </IconButton> */}
          </div>
        </div>

        {/* Các trường Category */}
        <div className="col-6 mt-3">
          <label className="label-form">
            Categories <span className="text-danger">*</span>
          </label>
          <div className="d-flex align-items-center">
            <Autocomplete
              multiple
              options={categories}
              value={categories.filter((category) =>
                categoryIds.includes(category.Id)
              )}
              getOptionLabel={(option) =>
                "- ".repeat(option.Level) + " " + option.Name
              }
              onChange={(event, newValue) => {
                setCategoryIds(newValue.map((category) => category.Id));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Select categories"
                  error={!!error.CategoryIds}
                  helperText={error.CategoryIds ? error.CategoryIds[0] : ""}
                />
              )}
              renderOption={(props, option) => (
                <Tooltip
                  title={
                    <div>
                      <strong>Id:</strong> {option.Id} <br />
                      <strong>Name category:</strong> {option.Name} <br />
                      {/* Bạn có thể thêm các thông tin khác nếu cần */}
                    </div>
                  }
                  arrow
                >
                  <li {...props}>{option.Name}</li>
                </Tooltip>
              )}
              style={{ flexGrow: 1 }}
            />
            {/* <IconButton
              color="primary"
              onClick={handleOpenAddCategory}
              style={{ marginLeft: 8 }}
            >
              <AddIcon />
            </IconButton> */}
          </div>
        </div>

        {/* Trường File Upload Thumbnail */}
        <div className="col-12 mt-3">
          <label className="label-form">
            Thumbnail Product <span className="text-danger">*</span>
          </label>
          <FileUpload
            mode="basic"
            name="thumbnail"
            accept="image/*"
            maxFileSize={1000000000}
            onSelect={handleThumbnailSelect}
            chooseLabel="Select Thumbnail"
            className="file-upload"
            customUpload
            uploadHandler={() => {}} // Nếu không sử dụng uploadHandler tự túc
          />
          <ShowError field="ImageThumbPath" />
          {selectedThumb && (
            <div className="mt-2 position-relative d-inline-block">
              <img
                src={URL.createObjectURL(selectedThumb)}
                alt={`Thumbnail Preview`}
                className="img-thumbnail"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                }}
              />
              <IconButton
                size="small"
                onClick={() => setSelectedThumb(null)}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                }}
              >
                <DeleteIcon fontSize="small" color="error" />
              </IconButton>
            </div>
          )}
        </div>

        {/* Trường File Upload Product Images */}
        <div className="col-12 mt-3">
          <label className="label-form">
            Product Images <span className="text-danger">*</span>
          </label>
          <FileUpload
            mode="basic"
            name="productImages"
            accept="image/*"
            maxFileSize={1000000000}
            onSelect={handleProductImagesSelect}
            chooseLabel="Select Images"
            className="file-upload"
            multiple
            customUpload
            uploadHandler={() => {}} // Nếu không sử dụng uploadHandler tự túc
          />
          <ShowError field="ProductImages" />
        </div>

        {/* Phần Preview và Xóa Ảnh Mới */}
        {productImages.length > 0 && (
          <div className="col-12 mt-3">
            <label className="label-form">Image Preview:</label>
            <div className="d-flex flex-wrap gap-3">
              {productImages.map((file, index) => (
                <div key={index} className="position-relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    className="img-thumbnail"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveImage(index)}
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      backgroundColor: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    <DeleteIcon fontSize="small" color="error" />
                  </IconButton>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hình ảnh hiện có */}
        {existingImages.length > 0 && (
          <div className="col-12 mt-3">
            <label className="label-form">Existing Images:</label>
            <div className="d-flex flex-wrap gap-3">
              {existingImages.map((imageUrl, index) => (
                <div key={index} className="position-relative">
                  <Image
                    src={`${baseUrl + imageUrl}`}
                    alt={`Existing ${index}`}
                    className="img-thumbnail"
                    height="50px"
                  />
                  {/* Nút xóa hình ảnh hiện có */}
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveExistingImage(index)}
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      backgroundColor: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    <DeleteIcon fontSize="small" color="error" />
                  </IconButton>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal Footer */}
      <div className="modal-footer mt-3 d-flex gap-3">
        <button
          className="btn btn-secondary"
          onClick={() => dispatch(setShowModal(false))}
        >
          Cancel
        </button>
        <button
          className="btn btn-general"
          onClick={form === "edit" ? updateProduct : addNewProduct}
        >
          {form === "edit" ? "Update Product" : "Add Product"}
        </button>
      </div>

      <Toast />
      {/* Dialog Thêm Author Mới */}
    </div>
  );
};

export default ProductAdd;
