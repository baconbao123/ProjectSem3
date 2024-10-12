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
  Tooltip
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

  // States for Add Author Dialog
  const [openAddAuthor, setOpenAddAuthor] = useState(false);
  const [newAuthorName, setNewAuthorName] = useState("");

  // States for Add Company Dialog
  const [openAddCompany, setOpenAddCompany] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanyEmail, setNewCompanyEmail] = useState("");
  const [newCompanyPhone, setNewCompanyPhone] = useState("");
  const [newCompanyAddress, setNewCompanyAddress] = useState("");
  const [newCompanyType, setNewCompanyType] = useState("");
  const [newCompanyStatus, setNewCompanyStatus] = useState<boolean>(true);
  const [addCompanyError, setAddCompanyError] = useState<string>("");
   // States for Add Category Dialog
   const [openAddCategory, setOpenAddCategory] = useState(false);
   const [addCategoryError, setAddCategoryError] = useState<string>(""); // Added error state
   const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    parentId: "",
    status: true,
    imgFile: null as File | null,
    imgPreview: "",
  });
  const [newCompanys, setNewCompanys] = useState([
    {
      name: "",
      email: "",
      address: "",
      phone: "",
      type: "",
      status: false,
    },
  ]);

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
          setExistingImages(
            product[0].ProductImages.map((img: any) => img.ImagePath)
          );
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
    deletedImages.forEach((imgPath) =>
      formData.append("DeletedImages", imgPath)
    );

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

  // Hàm mở và đóng Dialog Author
  const handleOpenAddAuthor = () => {
    setNewAuthorName("");
    setOpenAddAuthor(true);
  };

  const handleCloseAddAuthor = () => {
    setOpenAddAuthor(false);
  };

  const handleAddAuthor = async () => {
    if (!newAuthorName.trim()) {
      setError((prev) => ({
        ...prev,
        newAuthorName: ["Author name is required"],
      }));
      return;
    }
    try {
      dispatch(setLoading(true));
      const res = await $axios.post("Author", { Name: newAuthorName , Status: 1 });
      const newAuthor: Author = res.data.data;
      setAuthors((prev) => [...prev, newAuthor]);
      setAuthorIds((prev) => [...prev, newAuthor.Id]);
      setOpenAddAuthor(false);
      dispatch(
        setToast({ status: "success", message: "Author added successfully" })
      );
    } catch (err: any) {
      console.error("Failed to add author", err);
      dispatch(
        setToast({
          status: "error",
          message: err.response?.data?.message || "Failed to add author",
        })
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Hàm mở và đóng Dialog Company
  const handleOpenAddCompany = () => {
    setNewCompanyName("");
    setNewCompanyEmail("");
    setNewCompanyPhone("");
    setNewCompanyAddress("");
    setNewCompanyStatus(true);

    setOpenAddCompany(true);
  };

  const handleCloseAddCompany = () => {
    setOpenAddCompany(false);
  };

  const handleNewCompanyChange = (index: number, field: string, value: any) => {
    const updatedCompanys = [...newCompanys];
    updatedCompanys[index] = { ...updatedCompanys[index], [field]: value };
    setNewCompanys(updatedCompanys);
  };
  const addNewCompanyField = () => {
    setNewCompanys([
      ...newCompanys,
      { name: "", email: "", phone: "", address: "", type: "", status: true },
    ]);
  };
  const removeNewCompany = (index: number) => {
    const updatedCompanys = [...newCompanys];
    updatedCompanys.splice(index, 1);
    setNewCompanys(updatedCompanys);
  };
  const handleAddCompanies = async () => {
    // Check if newCompanys array is empty
    if (newCompanys.length === 0) {
      setAddCompanyError("At least one company must be provided.");
      return;
    }

    const errors: string[] = [];
    // Prepare data form
    const dataForm = newCompanys
      .map((company, index) => {
        // Validate company data
        if (!company.name.trim()) {
          errors.push(`Company name is required for category ${index + 1}`);
        }
        if (!company.email || !/\S+@\S+\.\S+/.test(company.email)) {
          errors.push(`Valid email is required for category ${index + 1}`);
        }
        if (!company.phone || company.phone.length !== 10) {
          errors.push(`Phone number must be exactly 10 digits for category ${index + 1}`);
        }
        if (!company.address.trim()) {
          errors.push(`Address is required for category ${index + 1}`);
        }
        if (!company.type) {
          errors.push(
            `Partner company type is required for category ${index + 1}`
          );
        }

        // Return company data if valid, otherwise return null
        return errors.length === 0
          ? {
              Name: company.name,
              Email: company.email,
              Phone: company.phone,
              Address: company.address,
              Type: company.type,
              Status: company.status ? 1 : 0,
            }
          : null; // Return null if there are errors
      })
      .filter(Boolean); // Filter out any null values

    // If there are any errors, set the error message and exit
    if (errors.length > 0) {
      setAddCompanyError(errors.join(", "));
      return;
    }

    if (dataForm.length === 0) {
      return;
    }

    try {
      dispatch(setLoading(true));
      const res = await $axios.post("CompanyPartner", dataForm);
      const addedCompanies: Company[] = res.data.data;
      setOpenAddCompany(false);
      setCompanies((prev) => [...prev, ...addedCompanies]);
      setNewCompanys([
        { name: "", email: "", phone: "", address: "", type: "", status: true },
      ]);
      dispatch(
        setToast({ status: "success", message: "Companies added successfully" })
      );
    } catch (err: any) {
      console.error("Failed to add companies", err);
      setAddCompanyError(
        err.response?.data?.message || "Failed to add companies"
      );
      dispatch(
        setToast({
          status: "error",
          message: err.response?.data?.message || "Failed to add companies",
        })
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ====================End company===================

  // Hàm mở và đóng Dialog Category
 
  // Function to open Add Category Dialog
  const handleOpenAddCategory = () => {
    setNewCategory({
      name: "",
      description: "",
      parentId: "",
      status: true,
      imgFile: null,
      imgPreview: "",
    });
    setAddCategoryError("");
    setOpenAddCategory(true);
  };

  // Function to close Add Category Dialog
  const handleCloseAddCategory = () => {
    setOpenAddCategory(false);
  };

  // Handler for new category field changes
  const handleNewCategoryChange = (field: string, value: any) => {
    setNewCategory((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handler to remove Category Image
  const handleRemoveCategoryImage = () => {
    setNewCategory((prev) => ({
      ...prev,
      imgFile: null,
      imgPreview: "",
    }));
  };

  // Function to add a new category
  const handleAddCategory = async () => {
    // Validate that the category name and image are present
    if (!newCategory.name.trim()) {
      setAddCategoryError("Category name is required.");
      return;
    }

   

    dispatch(setLoading(true));
    try {
      const formData = new FormData();
      formData.append("Name", newCategory.name);
      formData.append("Description", newCategory.description);
      formData.append(
        "ParentId",
        newCategory.parentId ? newCategory.parentId : ""
      );
      formData.append("Status", newCategory.status ? "1" : "0");
      if ( newCategory.imgFile) {
        formData.append("imgThumbCategory",  newCategory.imgFile);
      }

      const res = await $axios.post("Category", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Assume API returns the added category
      const addedCategory: Category = res.data.data;

      setCategories((prev) => [...prev, addedCategory]);
      setCategoryIds((prev) => [...prev, addedCategory.Id]);
      setOpenAddCategory(false);
      setNewCategory({
        name: "",
        description: "",
        parentId: "",
        status: true,
        imgFile: null,
        imgPreview: "",
      });
      setAddCategoryError("");
      dispatch(
        setToast({
          status: "success",
          message: "Category added successfully",
        })
      );
    } catch (err: any) {
      console.error("Failed to add category", err);
      setAddCategoryError(
        err.response?.data?.message || "Failed to add category"
      );
      dispatch(
        setToast({
          status: "error",
          message: err.response?.data?.message || "Failed to add category",
        })
      );
    } finally {
      dispatch(setLoading(false));
    }
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
          <div className="d-flex align-items-center">
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
            <IconButton
              color="primary"
              onClick={handleOpenAddCompany}
              style={{ marginLeft: 8 }}
            >
              <AddIcon />
            </IconButton>
          </div>
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
              <li {...props}>
                {option.Name} 
              </li>
            </Tooltip>
          )}
          style={{ flexGrow: 1 }}
        />
        <IconButton
          color="primary"
          onClick={handleOpenAddAuthor}
          style={{ marginLeft: 8 }}
        >
          <AddIcon />
        </IconButton>
      </div>
      {/* Hiển thị lỗi nếu có */}
      <ShowError key="AuthorIds" />
    </div>

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
                />
              )}
              style={{ flexGrow: 1 }}
            />
            <IconButton
              color="primary"
              onClick={handleOpenAddCategory}
              style={{ marginLeft: 8 }}
            >
              <AddIcon />
            </IconButton>
          </div>
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
                    src={`${baseUrl}${imageUrl}`}
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
      {/* Dialog Thêm Author Mới */}
      <Dialog open={openAddAuthor} onClose={handleCloseAddAuthor}>
        <DialogTitle>Add New Author</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Author Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newAuthorName}
            onChange={(e) => setNewAuthorName(e.target.value)}
            error={Boolean(error.newAuthorName)}
            helperText={error.newAuthorName ? error.newAuthorName[0] : ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddAuthor} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddAuthor} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Thêm Companys Mới */}

      <Dialog
        open={openAddCompany}
        onClose={handleCloseAddCompany}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Compannys</DialogTitle>
        <DialogContent>
          {newCompanys.map((company, index) => (
            <div
              key={index}
              className="category-form mb-4 p-3"
              style={{ border: "1px solid #ccc", borderRadius: "8px" }}
            >
              <h5>Company {index + 1}</h5>
              <TextField
                margin="dense"
                label="Category Name"
                type="text"
                fullWidth
                variant="outlined"
                value={company.name}
                onChange={(e) =>
                  handleNewCompanyChange(index, "name", e.target.value)
                }
                error={!company.name.trim()} // Error condition for name
                helperText={
                  !company.name.trim() ? "Company name is required." : ""
                }
                required
              />
              <TextField
                margin="dense"
                label="Email"
                type="email"
                fullWidth
                variant="outlined"
                value={company.email}
                onChange={(e) =>
                  handleNewCompanyChange(index, "email", e.target.value)
                }
                error={!company.email || !/\S+@\S+\.\S+/.test(company.email)} // Error condition for email
                helperText={
                  !company.email || !/\S+@\S+\.\S+/.test(company.email)
                    ? "Valid email is required."
                    : ""
                }
              />
              <TextField
                margin="dense"
                label="Phone"
                type="text"
                fullWidth
                variant="outlined"
                value={company.phone}
                onChange={(e) =>
                  handleNewCompanyChange(index, "phone", e.target.value)
                }
                error={!company.phone || company.phone.length !== 10} // Error condition for phone
                helperText={
                  !company.phone || company.phone.length !== 10
                    ? "Phone number must be exactly 10 digits."
                    : ""
                }
              />
              <TextField
                margin="dense"
                label="Address"
                type="text"
                fullWidth
                variant="outlined"
                value={company.address}
                onChange={(e) =>
                  handleNewCompanyChange(index, "address", e.target.value)
                }
                error={!company.address.trim()} // Error condition for address
                helperText={
                  !company.address.trim() ? "Address is required." : ""
                }
              />
              <FormControl fullWidth margin="dense">
                <label className="label-form">Patner company</label>
                <select
                  value={company.type}
                  onChange={(e) =>
                    handleNewCompanyChange(index, "type", e.target.value)
                  }
                  className="form-control"
                >
                  <option> Select company type</option>
                  <option value="Manufacturer">Manufacturer</option>
                  <option value="Publisher">Publisher</option>
                </select>
                {/* Display error for Partner Company Type */}
                {!company.type && (
                  <div style={{ color: "red", marginTop: "5px" }}>
                    Partner company type is required for category {index + 1}.
                  </div>
                )}
              </FormControl>

              <FormControl component="fieldset" margin="dense">
                <label className="label-form">Status</label>
                <Switch
                  checked={company.status}
                  onChange={(e) =>
                    handleNewCompanyChange(index, "status", e.target.checked)
                  }
                  color="primary"
                />
              </FormControl>
              {newCompanys.length > 1 && (
                <IconButton
                  color="secondary"
                  onClick={() => removeNewCompany(index)}
                  style={{ marginTop: 8 }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </div>
          ))}

          <Button
            variant="outlined"
            color="primary"
            onClick={addNewCompanyField}
            startIcon={<AddIcon />}
          >
            Add More Company
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddCompany} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddCompanies} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
     {/* Dialog to Add New Category */}

     <Dialog
        open={openAddCategory}
        onClose={handleCloseAddCategory}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <div
            className="category-form mb-4 p-3"
            style={{ border: "1px solid #ccc", borderRadius: "8px" }}
          >
          
            <TextField
              margin="dense"
              label="Category Name"
              type="text"
              fullWidth
              variant="outlined"
              value={newCategory.name}
              onChange={(e) => handleNewCategoryChange("name", e.target.value)}
              required
         
            />
            <TextField
              margin="dense"
              label="Description"
              type="text"
              fullWidth
              variant="outlined"
              value={newCategory.description}
              onChange={(e) =>
                handleNewCategoryChange("description", e.target.value)
              }
            />
            <FormControl fullWidth margin="dense">
              <label className="label-form">Parent Category</label>
              <select
                value={newCategory.parentId}
                onChange={(e) =>
                  handleNewCategoryChange("parentId", e.target.value)
                }
                className="form-control"
              >
                <option value="">Select Parent Category</option>
                {categories
                  .filter((cat) => cat.Status !== 0 && cat.Id !== id) // Remove current category to prevent selecting itself
                  .map((cat) => (
                    <option key={cat.Id} value={cat.Id}>
                      {"- ".repeat(cat.Level) + " " + cat.Name}
                    </option>
                  ))}
              </select>
            </FormControl>

            <FormControl component="fieldset" margin="dense">
              <label className="label-form">Status</label>
              <Switch
                checked={newCategory.status}
                onChange={(e) =>
                  handleNewCategoryChange("status", e.target.checked)
                }
                color="primary"
              />
            </FormControl>

            {/* Category Image Upload */}
            <div className="mt-3">
              <label className="label-form">
                Category Image 
              </label>
              <FileUpload
                name="imgThumbCategory"
                url="" // Not needed because we handle upload manually
                accept="image/*"
                maxFileSize={2000000} // 2MB
                onSelect={(e) => {
                  if (e.files && e.files.length > 0) {
                    const file = e.files[0];
                    setNewCategory({
                      ...newCategory,
                      imgFile: file,
                      imgPreview: URL.createObjectURL(file),
                    });
                  }
                }}
                onRemove={() => {
                  setNewCategory({
                    ...newCategory,
                    imgFile: null,
                    imgPreview: "",
                  });
                }}
                customUpload
                uploadHandler={() => {}}
              />
              {newCategory.imgPreview && (
                <div className="mt-2 position-relative d-inline-block">
                  <img
                    src={newCategory.imgPreview}
                    alt={`Category Image Preview`}
                    className="img-thumbnail"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={handleRemoveCategoryImage}
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
              {addCategoryError && (
                <div className="text-danger mt-2">{addCategoryError}</div>
              )}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddCategory} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddCategory} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProductAdd;
