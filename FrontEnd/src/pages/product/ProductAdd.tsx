import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading, setShowModal, setToast } from "@src/Store/Slinces/appSlice.ts";
import $axios from "@src/axios.ts";
import Cookies from "js-cookie";

interface CategoryAdd {
  loadDataTable: any;
  id?: any;
  form: string;
}

const CategoryAdd: React.FC<CategoryAdd> = ({ loadDataTable, form, id }) => {
  const [categoriesList, setCategoriesList] = useState([
    {
      name: '',
      description: '',
      parentId: '',
      status: false,
    }
  ]); // Mảng chứa các danh mục cần thêm
  const [error, setError] = useState<any>({});
  const [item, setItem] = useState<any>({});
  const [categories, setCategories] = useState<any[]>([]);
  const token = Cookies.get("token");
  const dispatch = useDispatch();

  useEffect(() => {
    if (form === "edit") {
      loadData();
    }
    loadCategories(); // Load danh sách danh mục cha
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
            parentId: category.ParentId || '',
            status: category.Status || false,
          }]);
          setItem(category);
        }
      })
      .catch((err) => {
        console.log(err);
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

  const addNew = () => {
    setError({});
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
        dispatch(
          setToast({
            status: "success",
            message: "Success",
            data: "Add new Categories successful",
          })
        );
        dispatch(setShowModal(false));
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.error || "Something went wrong";
    
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
      Name: categoriesList[0].name,
      Description: categoriesList[0].description,
      ParentId: parseInt(categoriesList[0].parentId) || null,
      Status: categoriesList[0].status ? 1 : 0,
      Version: item.Version,
    };
    dispatch(setLoading(true));
    $axios
      .put(`Category/${id}`, dataForm)
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
        const errorMessage = err.response?.data?.message || "Something went wrong";
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
      {categoriesList.map((category, index) => (
        <div className="row" key={index}>
          <div className="col-6">
            <div className="">
              <div className="label-form">
                Name <span className="text-danger">*</span>
              </div>
              <input
                value={category.name}
                className="form-control"
                placeholder="Enter name"
                onChange={(e) => handleChange(index, "name", e.target.value)}
              />
              <ShowError errorKey="Name" />
            </div>

            <div className="mt-3">
              <div className="label-form">
                Status <span className="text-danger">*</span>
              </div>
              <div className="form-check form-switch">
                <input
                  checked={category.status}
                  onChange={(e) => handleChange(index, "status", e.target.checked)}
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
              <div className="label-form">Description</div>
              <textarea
                className="form-control"
                value={category.description}
                onChange={(e) => handleChange(index, "description", e.target.value)}
                style={{ height: "100px" }}
                placeholder="Enter description"
                id="floatingTextarea2"
              />
              <ShowError errorKey="Description" />
            </div>
          </div>

          <div className="col-12 mt-3">
            <div className="label-form">Parent Category</div>
            <select
              className="form-select"
              value={category.parentId}
              onChange={(e) => handleChange(index, "parentId", e.target.value)}
            >
              <option value="">Select Parent Category</option>
              {categories
              .filter(cat => cat.Status !==0)
              .map((cat) => (
                <option key={cat.Id} value={cat.Id}>
                  {"-".repeat(cat.Level) + " " + cat.Name}
                </option>
              ))}
            </select>
            <ShowError errorKey="ParentCategory" />
          </div>

          {form === "add" && (
            <div className="col-12 mt-3 d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => removeCategory(index)}
                disabled={categoriesList.length === 1}
              >
                - Remove
              </button>
            </div>
          )}
        </div>
      ))}

      {form === "add" && (
        <div className="col-12 mt-3 d-flex justify-content-end">
          <button type="button" className="btn btn-outline-primary " onClick={addNewCategory}>
            + Add More
          </button>
        </div>
      )}

      <div className="group-btn mt-3">
        <button
          onClick={() => dispatch(setShowModal(false))}
          type="button"
          className="btn btn-outline-secondary"
        >
          Cancel
        </button>
        {form === "add" ? (
          <button
            onClick={addNew}
            type="button"
            className="btn btn-outline-primary"
          >
            Save All
          </button>
        ) : (
          <button
            onClick={save}
            type="button"
            className="btn btn-outline-primary"
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryAdd;
