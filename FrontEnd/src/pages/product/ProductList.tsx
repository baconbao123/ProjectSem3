import React, { useEffect, useState } from "react";
import MainLayOut from "@pages/common/MainLayOut.tsx";
import { useDispatch } from "react-redux";
import { setLoading, setShowModal, setToast } from "@src/Store/Slinces/appSlice.ts";
import Modal from "@pages/common/Modal.tsx";
import {
  Breadcrumbs,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import KeyboardDoubleArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowLeftOutlined";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import KeyboardDoubleArrowRightOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowRightOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined"; // Import Copy Icon
import HomeIcon from "@mui/icons-material/Home";
import Cookies from "js-cookie";
import $axios from "@src/axios.ts";
import { Image } from "primereact/image";
import Swal from "sweetalert2";
import _ from "lodash";
import ProductDetail from "./ProductDetail";
import { Link } from "react-router-dom";
import ProductAdd from "./ProductAdd";
import {checkPermission} from "@src/Service/common.ts";


type ShowComponent = "add" | "edit" | "copy" | "view" | "";

interface Product {
  Id: number;
  Name: string;
  Code: string;
  CompanyPartnerName: string;
  Quantity: number;
  BasePrice: number;
  SellPrice: number;
  Status: number;
  ImageThumbPath?: string;
  ProductImages?: Array<{ ImagePath: string }>;
  // Add other fields as necessary
}

const ProductList: React.FC = () => {
  const dispatch = useDispatch();

  // Define state with specific types
  const [field, setField] = useState<
    Array<{
      key: keyof Product | "No" | "Action";
      label: string;
      class: string;
      sortable?: boolean;
      sortValue?: "none" | "ascending" | "descending";
    }>
  >([]);
  const [data, setData] = useState<Product[]>([]);
  const [filterData, setFilterData] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState<number | "All">(15);
  const [itemFrom, setItemFrom] = useState<number>(1);
  const [itemTo, setItemTo] = useState<number>(15);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [componentTitle, setComponentTitle] = useState<string>("Add component");
  const [showComponent, setShowComponent] = useState<ShowComponent>("");
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [filter, setFilter] = useState<{ Name: string;Code: string, Status: number }>({
    Name: "",
    Status: -1,
  });
  const baseUrl = import.meta.env.VITE_BASE_URL_LOCALHOST;

  useEffect(() => {
    dispatch(setLoading(true));
    setField([
      { key: "No", label: "No", class: "th__no" },
      { key: "ImageThumbPath", label: "Image", class: "text-center" },
      {
        key: "Name",
        label: "Name",
        class: "width-300",
        sortable: true,
        sortValue: "none",
      },
      {
        key: "Code",
        label: "Product code",
        class: "",
        sortable: true,
        sortValue: "none",
      },
      { key: "CompanyPartnerName", label: "Company partner", class: "" },
      { key: "Quantity", label: "Quantity", class: "" },
      { key: "BasePrice", label: "Base price", class: "" },
      { key: "SellPrice", label: "Sell price", class: "" },
      {
        key: "Status",
        label: "Status",
        class: "width-100 ",
        sortable: true,
        sortValue: "none",
      },
      { key: "Action", label: "Action", class: "width-300 th__action " },
    ]);
    loadDataTable();
    dispatch(setLoading(false));
  }, []);

  useEffect(() => {
    switch (perPage) {
      case "All":
        setItemFrom(1);
        setItemTo(total);
        break;
      case 15:
        setItemFrom(1);
        setItemTo(15);
        break;
      case 25:
        setItemFrom(1);
        setItemTo(25);
        break;
      case 50:
        setItemFrom(1);
        setItemTo(50);
        break;
      default:
        break;
    }
    setCurrentPage(1);
  }, [perPage, total]);

  useEffect(() => {
    setTotal(filterData.length);
  }, [filterData]);

  useEffect(() => {
    setCurrentPage(Math.floor(itemTo / (perPage === "All" ? total : perPage)));
  }, [itemTo, perPage, total]);

  useEffect(() => {
    const result = data.filter((item) => {
      for (const key in filter) {
        const value = filter[key as keyof typeof filter];

        if (value === -1 || value === "") {
          continue;
        }

        if (key === "Status" && item[key as keyof Product] !== value) {
          return false;
        }

        if (key === "Name" && !item[key as keyof Product].toString().toLowerCase().includes((value as string).toLowerCase())) {
          return false;
        }
        if (key === "Code" && !item[key as keyof Product].toString().toLowerCase().includes((value as string).toLowerCase())) {
          return false;
        }
      }

      return true;
    });

    const sortTable = field.find((item) => item.sortValue !== "none");
    let sortResult: Product[] = [];

    if (sortTable) {
      sortResult = _.orderBy(
        result,
        [sortTable.key],
        [sortTable.sortValue === "ascending" ? "asc" : "desc"]
      );
    }

    setFilterData(sortTable ? sortResult : result);
  }, [filter, data, field]);

  const loadDataTable = () => {
    const token = Cookies.get("token");
    $axios
      .get("/Product")
      .then((res) => {
        setData(res.data.data);
        setFilterData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Component Handlers
  const handleComponentAdd: React.FC = () => {
    return <ProductAdd loadDataTable={loadDataTable} form="add" />;
  };

  const handleComponentEdit: React.FC = () => {
    return <ProductAdd loadDataTable={loadDataTable} form="edit" id={currentId!} />;
  };

  const handleComponentCopy: React.FC = () => {
    return <ProductAdd loadDataTable={loadDataTable} form="copy" id={currentId!} />;
  };

  const handleComponentDetail: React.FC = () => {
    return <ProductDetail id={currentId!} />;
  };

  const showModalAdd = () => {
    dispatch(setShowModal(true));
    setComponentTitle("Add Product");
    setShowComponent("add");
  };

  const showModalEdit = (item: Product) => {
    setCurrentId(item.Id);
    setComponentTitle("Edit Product");
    setShowComponent("edit");
    dispatch(setShowModal(true));
  };

  const showModalCopy = (item: Product) => {
    setCurrentId(item.Id);
    setComponentTitle("Copy Product");
    setShowComponent("copy");
    dispatch(setShowModal(true));
  };

  const showModalDetail = (item: Product) => {
    setCurrentId(item.Id);
    setComponentTitle("Product Details");
    setShowComponent("view");
    dispatch(setShowModal(true));
  };

  const deleteItem = (item: Product) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(setLoading(true));
        const token = Cookies.get("token");
        $axios
          .delete(`Product/${item.Id}`)
          .then((res) => {
            console.log("Delete response:", res);
            loadDataTable();
            dispatch(
              setToast({
                status: "success",
                message: "Delete product successful",
                data: "Success",
              })
            );
            dispatch(setShowModal(false));
          })
          .catch((err) => {
            console.log(err);
            dispatch(
              setToast({
                status: "error",
                message: "Something went wrong",
                data: "Error",
              })
            );
          })
          .finally(() => {
            dispatch(setLoading(false));
          });
      }
    });
  };

  // Render Functions
  const header: React.FC = () => {
    return (
      <div className="header-page">
        <Breadcrumbs separator="›" aria-label="breadcrumb" className="breadcrumb">
          <Link color="inherit" to="/">
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Link to="/product">Product</Link>
        </Breadcrumbs>
      </div>
    );
  };

  const search: React.FC = () => {
    const handleChangeStatus = (e: any) => {
      setFilter((prev) => ({ ...prev, Status: e.target.value }));
    };
    const handleChangeName = (e: any) => {
      setFilter((prev) => ({ ...prev, Name: e.target.value }));
    };
    const handleChangeCode = (e: any) => {
      setFilter((prev) => ({ ...prev, Code: e.target.value }));
    };
    return (
        <div className="search-container">
          <div>
            <input
                value={filter.Name}
                onChange={handleChangeName}
                className="form-control test-position"
                placeholder="Search name..."
            />
          </div>
          <div>
            <input
                value={filter.Code}
                onChange={handleChangeCode}
                className="form-control test-position"
                placeholder="Search code..."
            />
          </div>
          <Select
              className="search-form width-200 custom-form"
              value={filter.Status}
              onChange={handleChangeStatus}
              displayEmpty
          >
            <MenuItem value={-1}>
              <span className="placeholder-text">Select status</span>
            </MenuItem>
            <MenuItem value={1}>Active</MenuItem>
            <MenuItem value={0}>Disable</MenuItem>
          </Select>
        </div>
    );
  };

  const button: React.FC = () => {
    return (
        <div>
          {checkPermission('Product', 'create') ? (
              <button onClick={showModalAdd} className="btn btn-general">
                Add New
              </button>
          ) : ''}
        </div>
    );
  };

  const content: React.FC = () => {
    const handleChangePageSize = (e: any) => {
      setPerPage(e.target.value);
    };

    const setNextPage = () => {
      if (total - itemTo > 0) {
        setItemFrom(itemTo + 1);
        setItemTo(
          perPage === "All"
            ? total
            : Math.min(itemTo + (perPage as number), total)
        );
      }
    };

    const setPreviousPage = () => {
      if (itemFrom - (perPage as number) > 0) {
        setItemTo(itemFrom - 1);
        setItemFrom(itemFrom - (perPage as number));
      } else {
        setItemFrom(1);
        setItemTo(perPage === "All" ? total : perPage as number);
      }
    };

    const setFirstPage = () => {
      setItemFrom(1);
      setItemTo(perPage === "All" ? total : perPage as number);
    };

    const setLastPage = () => {
      setItemFrom(perPage === "All" ? 1 : Math.max(total - (perPage as number) + 1, 1));
      setItemTo(total);
    };

    const getSortValue = (value: string): "ascending" | "descending" | "none" => {
      switch (value.toLowerCase()) {
        case "none":
          return "ascending";
        case "ascending":
          return "descending";
        case "descending":
          return "none";
        default:
          return "none";
      }
    };

    const handleSortData = (key: keyof Product, value: "ascending" | "descending" | "none") => {
      if (value === "none") {
        const sortedData = _.orderBy(filterData, ["Id"], ["desc"]);
        setFilterData(sortedData);
      } else {
        const sortedData = _.orderBy(filterData, [key], [value === "ascending" ? "asc" : "desc"]);
        setFilterData(sortedData);
      }
    };

    const handleSort = (fieldItem: any) => {
      if (!fieldItem.sortable) return;

      const newSortValue = getSortValue(fieldItem.sortValue || "none");

      const updatedField = field.map((item) => ({
        ...item,
        sortValue: item.key === fieldItem.key ? newSortValue : "none",
      }));

      setField(updatedField);

      handleSortData(fieldItem.key as keyof Product, newSortValue);
    };

    // Determine the items to display based on pagination
    const displayedData = perPage === "All"
      ? filterData
      : filterData.slice(itemFrom - 1, itemTo);

    return (
      <div>
        <div className="table-container">
          <Table>
            <TableHead>
              <TableRow>
                {field.map((item) => (
                  <TableCell
                    key={item.key}
                    className={item.class}
                    aria-sort={item.sortable ? item.sortValue : undefined}
                    onClick={() => handleSort(item)}
                  >
                    <b>{item.label}</b>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody className="body-table">
              {displayedData.map((item, index) => {
                const imageThumbPath = item.ImageThumbPath || null;

                return (
                  <TableRow key={item.Id}>
                    {field.map((fieldItem) => {
                      if (fieldItem.key === "No") {
                        return (
                          <TableCell className={fieldItem.class} key="no">
                            {index + 1 + (currentPage - 1) * (perPage === "All" ? total : perPage)}
                          </TableCell>
                        );
                      }

                      if (fieldItem.key === "ImageThumbPath") {
                        return (
                          <TableCell className={fieldItem.class} key="image">
                            {imageThumbPath ? (
                              <Image
                                src={baseUrl + imageThumbPath}
                                alt={item.Name}
                                className="image-product"
                                height="70"
                                preview
                              />
                            ) : (
                              <div>No Image</div>
                            )}
                          </TableCell>
                        );
                      }

                      if (fieldItem.key === "Status") {
                        return (
                          <TableCell className={fieldItem.class} key="status">
                            {item.Status ? (
                              <div className="justify-content-center d-flex">
                                <div className="status-success">Active</div>
                              </div>
                            ) : (
                              <div className="justify-content-center d-flex">
                                <div className="status-disable">Disable</div>
                              </div>
                            )}
                          </TableCell>
                        );
                      }

                      if (fieldItem.key === "Action") {
                        return (
                          <TableCell className={fieldItem.class} key="action">
                            <span
                                className={`m-2 btn-icon p-1 ${checkPermission('Product', 'read') ? '' : 'btn-disable'}`}
                                onClick={() => checkPermission('Product', 'read') && showModalDetail(item)}
                            >
                              <RemoveRedEyeOutlinedIcon />
                            </span>
                            <span
                                className={`m-2 btn-icon p-1 ${checkPermission('Product', 'update') ? '' : 'btn-disable'}`}
                                onClick={() => checkPermission('Product', 'update') && showModalEdit(item)}
                            >
                              <EditOutlinedIcon />
                            </span>
                            <span
                                className={`m-2 btn-icon p-1 ${checkPermission('Product', 'delete') ? '' : 'btn-disable'}`}
                                onClick={() => checkPermission('Product', 'delete') && deleteItem(item)}
                            >
                              <DeleteOutlineOutlinedIcon />
                            </span>
                            {/* Nút Copy */}
                            <span
                                className={`m-2 btn-icon p-1 ${checkPermission('Product', 'update') ? '' : 'btn-disable'}`}
                                onClick={() => checkPermission('Product', 'update') && showModalCopy(item)}
                            >
                              <FileCopyOutlinedIcon />
                            </span>
                          </TableCell>
                        );
                      }

                      // Default case for other fields
                      return (
                        <TableCell className={fieldItem.class} key={fieldItem.key}>
                          {item[fieldItem.key as keyof Product] ? item[fieldItem.key as keyof Product] : '-'}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}

              {total === 0 && (
                <TableRow>
                  <TableCell className="text-center" colSpan={field.length}>
                    DATA NOT FOUND...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          <div className="footer-table">
            <div className="pagination">
              <span>Per page </span>
              <Select
                className="select-per-page"
                value={perPage}
                onChange={handleChangePageSize}
                displayEmpty
              >
                <MenuItem value={15}>15</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={"All"}>All</MenuItem>
              </Select>
              <span>Page {currentPage}</span>
              <KeyboardDoubleArrowLeftOutlinedIcon
                className="icon"
                onClick={setFirstPage}
              />
              <KeyboardArrowLeftOutlinedIcon className="icon" onClick={setPreviousPage} />
              {itemFrom}–{itemTo} of {total}
              <KeyboardArrowRightOutlinedIcon className="icon" onClick={setNextPage} />
              <KeyboardDoubleArrowRightOutlinedIcon className="icon" onClick={setLastPage} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const footer: React.FC = () => {
    return <div>{/* Optional Footer Content */}</div>;
  };

  return (
    <>
      <Modal
        content={
          showComponent === "add"
            ? handleComponentAdd
            : showComponent === "edit"
            ? handleComponentEdit
            : showComponent === "copy"
            ? handleComponentCopy
            : showComponent === "view"
            ? handleComponentDetail
            : ""
        }
        title={componentTitle}
      />

      <MainLayOut
        header={header}
        search={search}
        button={button}
        content={content}
        footer={footer}
      />
    </>
  );
};

export default ProductList;
