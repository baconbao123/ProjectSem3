import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  setLoading,
  setShowModal,
  setToast,
} from "@src/Store/Slinces/appSlice.ts";
import $axios from "@src/axios.ts";
import Cookies from "js-cookie";
import { Editor, EditorTextChangeEvent } from "primereact/editor";

interface FAQAdd {
  loadDataTable: any;
  id?: any;
  form: string;
}

const FAQAdd: React.FC<FAQAdd> = ({ loadDataTable, form, id }) => {
  const [faqList, setFAQList] = useState([
    {
      title: "",
      description: "",
      type: -1,
      status: false,
    },
  ]); // Mảng chứa các công ty cần thêm
  const [error, setError] = useState<any>({});
  const [item, setItem] = useState<any>({});
  const [FAQs, setFAQs] = useState<any[]>([]);
  const token = Cookies.get("token");
  const dispatch = useDispatch();

  useEffect(() => {
    if (form === "edit") {
      loadData();
    }
    loadFAQs(); // Load danh sách công ty cha
  }, []);

  const loadData = () => {
    dispatch(setLoading(true));
    $axios
      .get(`FAQ/${id}`)
      .then((res) => {
        if (res.data) {
          const faq = res.data;
          setFAQList([
            {
              title: faq.Title || "",
              description: faq.Description || "",
              type: faq.Type,
              status: faq.Status || false,
            },
          ]);
          setItem(faq);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

  const loadFAQs = () => {
    $axios
      .get("FAQ")
      .then((res) => {
        if (res.data) {
          setFAQs(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addNewFAQ = () => {
    setFAQList([
      ...faqList,
      { title: "", description: "", type: 1, status: false },
    ]);
  };

  const removeFAQ = (index: number) => {
    const newFAQList = [...faqList];
    newFAQList.splice(index, 1);
    setFAQList(newFAQList);
  };

  const handleChange = (index: number, field: string, value: any) => {
    const newFAQList = [...faqList];
    newFAQList[index] = { ...newFAQList[index], [field]: value };
    setFAQList(newFAQList);
  };

  const addNew = () => {
    setError({});
    dispatch(setLoading(true));
    const dataForm = faqList.map((faq) => ({
      Title: faq.title,
      Decription: faq.description || "",
      Type: faq.type || null,
      Status: faq.status ? 1 : 0,
    }));

    $axios
      .post("FAQ", dataForm)
      .then((res) => {
        loadDataTable();
        dispatch(
          setToast({
            status: "success",
            message: "Success",
            data: "Add new faq successful",
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
    setError({});
    const dataForm = {
      Title: faqList[0].title,
      Decription: faqList[0].description || "",
      Type: faqList[0].type,
      Status: faqList[0].status ? 1 : 0,
      Version: item.Version,
    };

    dispatch(setLoading(true));
    $axios
      .put(`FAQ/${id}`, dataForm)
      .then((res) => {
        loadDataTable();
        dispatch(
          setToast({
            status: "success",
            message: "Success",
            data: "Edit faq successful",
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
      {faqList.map((faq, index) => (
        <div className="row" key={index}>
          <div className="col-12">
                  <div className="">
                    <div className="label-form">
                      Groups FAQs <span className="text-danger">*</span>
                    </div>
                    <select
                      className="form-select"
                      value={faq.type}
                      onChange={(e) => handleChange(index, "type", e.target.value)}
                    >
                      <option value={-1}>Select Groups FAQs</option>
                      <option value={1}>Security</option>
                      <option value={2}>Warranty</option>
                      <option value={3}>Shipping</option>
                      <option value={4}> Return Policy</option>
                    </select>
                  </div>
                </div>
            <div className=" mt-3">
              <div className="label-form">
                Title <span className="text-danger">*</span>
              </div>
              <input
                value={faq.title}
                className="form-control"
                placeholder="Enter title"
                onChange={(e) => handleChange(index, "title", e.target.value)}
              />
              <ShowError errorKey="Name" />
            </div>
            <div className="col-12">
              <div>
                <label className="label-form">
                  Description <span className="text-danger">*</span>
                </label>
                <Editor
                  value={faq.description} // Update đúng description trong faqList
                  style={{ height: "200px" }}
                  onTextChange={(e: EditorTextChangeEvent) =>
                    handleChange(index, "description", e.htmlValue || "")
                  }
                />
                <ShowError errorKey="Description" />
              </div>
            </div>

            <div className="mt-3">
              <div className="label-form">
                Status <span className="text-danger">*</span>
              </div>
              <div className="form-check form-switch">
                <input
                  checked={faq.status}
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

          {form === "add" && (
            <div className="col-12 mt-3 d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => removeFAQ(index)}
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
              onClick={addNewFAQ}
            >
              Add New
            </button>
          </div>
        )}

        <div className="col-12 mt-3 d-flex justify-content-center">
          <button
            onClick={() => dispatch(setShowModal(false))}
            type="button"
            className="btn btn-outline-secondary mx-3"
          >
            Cancel
          </button>
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

export default FAQAdd;
