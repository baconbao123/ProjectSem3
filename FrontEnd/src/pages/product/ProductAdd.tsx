import {
  FormControl,
  Switch,
  TextField,
  Chip,
  Autocomplete,
  IconButton,
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
import "@assets/styles/product.scss";

interface ProductAddProps {
  loadDataTable: () => void;
  id?: number;
  form: string;
}

interface Company {
  Id: number;
  Name: string;
}

interface Author {
  Id: number;
  Name: string;
}

interface Category {
  Id: number;
  Name: string;
  Level: number;
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
  const dispatch = useDispatch();

  console.log(error);

  useEffect(() => {
    if (form === "edit" && id) {
      loadData();
    }
    fetchAuthorsAndCategories();
  }, [form, id]);

  const loadData = async () => {
    dispatch(setLoading(true));
    try {
      const res = await $axios.get(`Product/${id}`);
      const product = res.data.data;

      console.log(product[0]);
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
          setExistingImages(
            product[0].ProductImages.map((img: any) => img.ImagePath)
          );
        }
        setItem(product[0]);
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
          $axios.get("Author"),
          $axios.get("Category"),
          $axios.get("CompanyPartner"),
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
      console.error("Failed to fetch authors and categories", error);
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

  const handleRemoveExistingImage = (index: number) => {
    const imageToRemove = existingImages[index];
    setDeletedImages((prev) => [...prev, imageToRemove]);
    setExistingImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const addNewProduct = async () => {
    setError({});
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

    // Nếu API yêu cầu SaleIds, hãy thêm trường này
    // Ví dụ:
    // const saleIds = [/* các ID sale */];
    // saleIds.forEach((id) => formData.append("SaleIds", id.toString()));

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
    const formData = new FormData();
    formData.append("Name", name);
    formData.append("Description", description);
    formData.append("Status", status ? "1" : "0");
    formData.append("Version", item.Version);
    formData.append("BasePrice", basePrice.toString());
    formData.append("SellPrice", sellPrice.toString());
    formData.append("Quantity", quantity.toString());
    formData.append("CompanyPartnerId", companyPartnerId.toString());

    authorIds.forEach((id) => formData.append("AuthorIds", id.toString()));
    categoryIds.forEach((id) => formData.append("CategoryIds", id.toString()));
    productImages.forEach((file) => formData.append("ProductImages", file));

    if (selectedThumb) {
      formData.append("ImageThumbPath", selectedThumb);
    }

    // Gửi danh sách các hình ảnh đã bị xóa
    deletedImages.forEach((imgPath) => formData.append("DeletedImages", imgPath));

    // Nếu API yêu cầu SaleIds, hãy thêm trường này
    // Ví dụ:
    // const saleIds = [/* các ID sale */];
    // saleIds.forEach((id) => formData.append("SaleIds", id.toString()));

    dispatch(setLoading(true));
    try {
      await $axios.put(`Product/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      loadDataTable();
      dispatch(
        setToast({ status: "success", message: "Edit product successful" })
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

  const ShowError: React.FC<{ key: string }> = ({ key }) => {
    const messages = error[key] || [];
    return <div className="text-danger mt-1">{messages[0] || ""}</div>;
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Các trường Name, Status */}
        <div className="col-6">
          <div>
            <label className="label-form">
              Name <span className="text-danger">*</span>
            </label>
            <input
              value={name}
              className="form-control"
              placeholder="Enter name"
              onChange={(e) => setName(e.target.value)}
            />
            <ShowError key="Name" />
          </div>
          <div className="mt-3">
            <label className="label-form">
              Status <span className="text-danger">*</span>
            </label>
            <div className="form-check form-switch">
              <input
                checked={status}
                onChange={(e) => setStatus(e.target.checked)}
                className="form-check-input form-switch switch-input"
                type="checkbox"
                id="statusSwitch"
              />
            </div>
            <ShowError key="Status" />
          </div>
        </div>
        <div className="col-6"></div>
        {/* Các trường BasePrice, SellPrice, Quantity, Company Partner */}
        <div className="col-6">
          <label className="label-form">
            Company Partner <span className="text-danger">*</span>
          </label>
          <select
            value={companyPartnerId}
            onChange={handleCompanyChange}
            className="form-control"
          >
            <option value={0}>--Select--</option>
            {companies.map((company) => (
              <option key={company.Id} value={company.Id}>
                {company.Name}
              </option>
            ))}
          </select>
          <ShowError key="CompanyPartnerId" />
        </div>
        <div className="col-6"></div>
        <div className="col-4 mt-3">
          <label className="label-form">
            Base Price <span className="text-danger">*</span>
          </label>
          <TextField
            value={basePrice}
            type="number"
            onChange={(e) => setBasePrice(Number(e.target.value))}
            className="form-control"
            label="Base Price"
            variant="outlined"
          />
          <ShowError key="BasePrice" />
        </div>

        <div className="col-4 mt-3">
          <label className="label-form">
            Sell Price <span className="text-danger">*</span>
          </label>
          <TextField
            value={sellPrice}
            type="number"
            onChange={(e) => setSellPrice(Number(e.target.value))}
            className="form-control"
            label="Sell Price"
            variant="outlined"
          />
          <ShowError key="SellPrice" />
        </div>

        <div className="col-4 mt-3">
          <label className="label-form">
            Quantity <span className="text-danger">*</span>
          </label>
          <TextField
            value={quantity}
            type="number"
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="form-control"
            label="Quantity"
            variant="outlined"
          />
          <ShowError key="Quantity" />
        </div>

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
            <ShowError key="Description" />
          </div>
        </div>

        {/* Các trường Author và Category */}
        <div className="col-6 mt-3">
          <label className="label-form">
            Authors <span className="text-danger">*</span>
          </label>
          <Autocomplete
            multiple
            options={authors}
            value={authors.filter((author) => authorIds.includes(author.Id))}
            getOptionLabel={(option) => option.Name}
            onChange={(event, newValue) => {
              setAuthorIds(newValue.map((author) => author.Id));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Select authors"
              />
            )}
          />
          <ShowError key="AuthorIds" />
        </div>

        <div className="col-6 mt-3">
          <label className="label-form">
            Categories <span className="text-danger">*</span>
          </label>
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
              />
            )}
          />
          <ShowError key="CategoryIds" />
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
          <ShowError key="ImageThumbPath" />
          {selectedThumb && (
            <div className="mt-2 position-relative d-inline-block">
              <img
                src={URL.createObjectURL(selectedThumb)}
                alt="Thumbnail Preview"
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
          <ShowError key="ProductImages" />
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
                  <img
                    src={baseUrl + imageUrl}
                    alt={`Existing ${index}`}
                    className="img-thumbnail"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
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

      <div className="modal-footer mt-3 d-flex gap-3">
        <button
          className="btn btn-secondary"
          onClick={() => dispatch(setShowModal(false))}
        >
          Cancel
        </button>
        <button
          className="btn btn-primary"
          onClick={form === "edit" ? updateProduct : addNewProduct}
        >
          {form === "edit" ? "Update Product" : "Add Product"}
        </button>
      </div>

      <Toast />
    </div>
  );
};

export default ProductAdd;
