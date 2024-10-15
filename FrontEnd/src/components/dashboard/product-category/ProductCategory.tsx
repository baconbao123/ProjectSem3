import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  TablePagination,
  TextField,
  SelectChangeEvent,
  styled,
} from "@mui/material";
import axios from "axios";
import $axios from "@src/axios";
import { Image } from "primereact/image";

// Định nghĩa kiểu Product
interface Product {
  Id: number;
  Name: string;
  ImageThumbPath: string;
  Code: string;
}

const CategoryProductTable: React.FC = () => {
  const [categories, setCategories] = useState<
    {
      Id: number;
      Name: string;
      Status: number;
      Level: number;
      Quantity: number;
    }[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Số lượng sản phẩm trên mỗi trang
  const baseUrl = import.meta.env.VITE_BASE_URL_LOCALHOST;

  useEffect(() => {
    // Gọi API để lấy dữ liệu category
    $axios
      .get("Common/category")
      .then((response) => {
        setCategories(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  useEffect(() => {
    // Gọi API để lấy danh sách sản phẩm theo category
    if (selectedCategory) {
      $axios
        .get(`Common/product/category?categoryId=${selectedCategory}`)
        .then((response) => {
          setProducts(response.data.data || []); // Đảm bảo mảng không bị undefined
          setTotalProducts(response.data.data.length);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
          setProducts([]); // Gán giá trị rỗng khi lỗi xảy ra
          setTotalProducts(0);
        });
    } else {
      // Lấy tất cả sản phẩm nếu không chọn category
      $axios
        .get("Common/product")
        .then((response) => {
          const allProducts = response.data.data || []; // Đảm bảo mảng không bị undefined
          setProducts(allProducts);
          setTotalProducts(allProducts.length);
        })
        .catch((error) => {
          console.error("Error fetching all products:", error);
          setProducts([]); // Gán giá trị rỗng khi lỗi xảy ra
          setTotalProducts(0);
        });
    }
  }, [selectedCategory]);

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSelectedCategory(event.target.value);
    setPage(0); // Reset trang về 0 khi thay đổi category
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset trang về 0 khi thay đổi số lượng sản phẩm trên mỗi trang
  };
  const CustomFormControl = styled(FormControl)(({ theme }) => ({
    width: "300px", // hoặc một giá trị khác tùy ý
    marginBottom: theme.spacing(2),
  }));
  const TableContainerStyled = styled(TableContainer)(({ theme }) => ({
    maxHeight: "400px", // Chiều cao cố định cho bảng
    overflowY: "auto", // Thêm cuộn dọc
  }));
  return (
    <div>
      <div className="row">
        <div className="col-6">
             <CustomFormControl>
            <TextField
              label="Select Category"
              select
              value={selectedCategory}
              onChange={handleCategoryChange}
              fullWidth
            >
              <MenuItem value="">All</MenuItem>
              {categories.length > 0 ? (
                categories
                  .filter((cat) => cat.Status !== 0)
                  .map((cat) => (
                    <MenuItem key={cat.Id} value={cat.Id.toString()}>
                      {"-".repeat(cat.Level) + " " + cat.Name}
                    </MenuItem>
                  ))
              ) : (
                <MenuItem disabled>No category.</MenuItem>
              )}
            </TextField>
          </CustomFormControl>
        </div>
         
          <div className="col-6">
          <Typography variant="h6" whiteSpace="nowrap" style={{color: 'var(--default-color)'}}>

              Quantity products: {products.length} / {totalProducts}
          </Typography>
          </div>
        
      </div>

      <TableContainerStyled component={Paper} style={{ marginTop: "20px" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Name product</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Image</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((product, index) => (
                <TableRow key={product.Id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{product.Code}</TableCell>
                  <TableCell>{product.Name}</TableCell>
                  <TableCell>{product.Quantity}</TableCell>
                  <TableCell>
                    {product.ImageThumbPath ? (
                      <img
                        src={`${baseUrl}${product.ImageThumbPath}`}
                        alt={product.Name}
                        className="image-product"
                        style={{ width: "70px", height: "70px" }}
                      />
                    ) : (
                      <div>-</div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No product.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainerStyled>

      <TablePagination
        component="div"
        count={totalProducts}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
};

export default CategoryProductTable;
