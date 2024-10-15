import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { topProducts } from "@src/data/top-products";
import TopProduct from "./TopProduct";
import "./TopProduct.scss"

const TopProducts = () => {
  return (
    <Paper  >
      <Typography variant="h5" px={3} mb={1.25} >
        Top Products
      </Typography>

      <Box sx={{ overflow: "auto" }}>
        <Table aria-label="top products table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Popularity</TableCell>
              <TableCell>Sales</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topProducts && topProducts.length > 0 ? (
              topProducts.map((product) => (
                <TopProduct key={product.id} product={product} />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No products sold
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );
};

export default TopProducts;
