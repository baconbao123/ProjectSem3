import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  setLoading,
  setShowModal,
  setToast,
} from "@src/Store/Slinces/appSlice.ts";
import $axios from "@src/axios.ts";
import Cookies from "js-cookie";
import dayjs from "dayjs";
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
import CloseIcon from "@mui/icons-material/Close";
import { Editor, EditorTextChangeEvent } from "primereact/editor";


interface AuthorAddProps {
  loadDataTable: () => void;
  id?: any;
  form: string;
}

const AuthorAdd: React.FC<AuthorAddProps> = ({ loadDataTable, form, id }) => {
  const [name, setName] = useState("");
  const [biography, setBiography] = useState<string>(""); // State cho nội dung editor
  const [birth, setBirth] = useState("");
  const [status, setStatus] = useState(false);
  const [error, setError] = useState<{ [key: string]: string }>({});
  const [item, setItem] = useState<any>({});
  const dispatch = useDispatch();

  useEffect(() => {
    if (form === "edit") {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = () => {
    dispatch(setLoading(true));

    $axios
      .get(`Author/${id}`)
      .then((res) => {
        if (res.data.data && res.data.data.Author) {
          const author = res.data.data.Author;
          setName(author.Name || "");
          setBiography(author.Biography || "");
          setBirth(
            author.Birth ? dayjs(author.Birth).format("YYYY-MM-DD") : ""
          );
          setStatus(author.Status ? true : false);
          setItem(author);
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(
          setToast({
            status: "error",
            message: "Error",
            data: "Failed to load author data",
          })
        );
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

  const validate = (): boolean => {
    const newError: { [key: string]: string } = {};

    if (!name.trim()) {
      newError["name"] = "Name is required";
    }

    

    // Status là boolean, không cần validation trừ khi bạn có quy tắc cụ thể

    setError(newError);
    return Object.keys(newError).length === 0;
  };

  const addNew = () => {
    if (!validate()) return;

    const formattedBirth = birth ? dayjs(birth).format("YYYY-MM-DD") : "";

    const dataForm = {
      Name: name,
      Biography: biography, // Gửi nội dung từ editor
      DateOfBirth: formattedBirth || undefined,
      Status: status ? 1 : 0,
    };

    dispatch(setLoading(true));
    $axios
      .post("Author", dataForm)
      .then((res) => {
        loadDataTable();
        dispatch(
          setToast({
            status: "success",
            message: "Success",
            data: "Add new Author successful",
          })
        );
        dispatch(setShowModal(false));
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.data?.Errors) {
          const serverErrors: { [key: string]: string } = {};
          for (const key in err.response.data.Errors) {
            if (err.response.data.Errors.hasOwnProperty(key)) {
              serverErrors[key.toLowerCase()] = err.response.data.Errors[key][0];
            }
          }
          setError(serverErrors);
        }
        dispatch(
          setToast({
            status: "error",
            message: "Error",
            data: "Something went wrong",
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
      Name: name,
      Biography: biography, // Lưu nội dung từ editor
      DateOfBirth: birth ? dayjs(birth).format("YYYY-MM-DD") : undefined,
      Status: status ? 1 : 0,
      Version: item.Version,
    };

    dispatch(setLoading(true));
    $axios
      .put(`Author/${id}`, dataForm)
      .then((res) => {
        loadDataTable();
        dispatch(
          setToast({
            status: "success",
            message: "Success",
            data: "Edit Author successful",
          })
        );
        dispatch(setShowModal(false));
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.data?.Errors) {
          const serverErrors: { [key: string]: string } = {};
          for (const key in err.response.data.Errors) {
            if (err.response.data.Errors.hasOwnProperty(key)) {
              serverErrors[key.toLowerCase()] = err.response.data.Errors[key][0];
            }
          }
          setError(serverErrors);
        }
        if (err.response?.data?.type === "reload") {
          dispatch(
            setToast({
              status: "error",
              message: "Error",
              data: err.response.data.message,
            })
          );
        } else {
          dispatch(
            setToast({
              status: "error",
              message: "Error",
              data: "Something went wrong",
            })
          );
        }
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

  const ShowError: React.FC<{ errorKey: string }> = ({ errorKey }) => {
    return error[errorKey.toLowerCase()] ? (
      <div className="text-danger mt-1">{error[errorKey.toLowerCase()]}</div>
    ) : null;
  };

  return (
    <div className="container-fluid mt-3">
      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!error["name"]}
            helperText={error["name"]}
            fullWidth
            required
          />
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Date of Birth"
            type="date"
            value={birth}
            onChange={(e) => setBirth(e.target.value)}
           
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
        </Grid>

        {/* Biography */}
        <Grid item xs={12}>
          <div className="mb-2">
            <label className="label-form">Biography <span className="text-danger">*</span></label>
          </div>
          <Editor
            value={biography}
            onTextChange={(e: EditorTextChangeEvent) => setBiography(e.htmlValue || "")}
            style={{ height: "200px" }}
          />
         
        </Grid>

        {/* Status */}
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={status}
                onChange={(e) => setStatus(e.target.checked)}
                color="primary"
              />
            }
            label="Status"
          />
          {error["status"] && (
            <div className="text-danger mt-1">{error["status"]}</div>
          )}
        </Grid>

        {/* Buttons */}
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
            <Button
              variant="contained"
              color="primary"
              onClick={addNew}
              startIcon={<AddIcon />}
            >
              Add Author
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={save}
              startIcon={<AddIcon />}
            >
              Save Changes
            </Button>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default AuthorAdd;
