import React, { useEffect, useState } from "react";
import { SquarePen } from "lucide-react";
import { Button, CircularProgress, TextField, Tooltip } from "@mui/material";
import { useForm } from "react-hook-form";
import { usePlantheadOrder } from "../../hooks/usePlanthead";
import { DataGrid } from "@mui/x-data-grid";

const ProductsTable = () => {
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productId, setProductId] = useState(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (productId) {
      const product = productsInPlanthead?.find(
        (product) => product.productId === productId
      );
      setSelectedProduct(product);
      setValue("quantity", product.quantity);
    }
  }, [productId]);

  console.log(selectedProduct);

  const {
    updateProductQuantity,
    isUpdatingProductQuantity,
    productsInPlanthead,
    productsInPlantheadLoading,
  } = usePlantheadOrder();

  const onUpdate = (data) => {
    data.productId = productId;
    console.log(data);
    updateProductQuantity(data);
    setOpenEdit(false);
  };

  if (productsInPlantheadLoading) return <CircularProgress />;

  const columns = [
    { field: "product", headerName: "Product", flex: 1 },
    { field: "category", headerName: "Category", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    { field: "quantity", headerName: "Quantity", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div className="flex items-center h-full gap-1">
          <Tooltip title="Update Quantity" placement="top" enterDelay={500}>
            <SquarePen
              color="green"
              className="hover:bg-green-100 active:scale-95 transition-all p-1.5 rounded-lg"
              size={30}
              onClick={() => {
                setProductId(params.row.id);
                setOpenEdit(true);
              }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const rows = productsInPlanthead?.map((product) => ({
    id: product.productId,
    product: product?.name,
    category: product?.category,
    description: product?.description,
    quantity: `${product.quantity} bags`,
  }));

  return (
    <div>
      <DataGrid
        rows={rows}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 20, 50, 100]}
        pagination
        autoHeight
        sx={{
          width: "100%",
          borderRadius: "8px",
          minWidth: "100%",
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
            backgroundColor: "none !important",
          },
          "& .MuiDataGrid-cell:focus-within": {
            outline: "none",
            backgroundColor: "none !important",
          },
          "& .MuiDataGrid-columnHeaders": {
            position: "sticky",
            top: 0,
            backgroundColor: "#fff",
            zIndex: 1,
          },
          "& .MuiDataGrid-virtualScroller": {
            overflowX: "auto !important",
            overflowY: "auto",
          },
          "& .MuiDataGrid-main": {
            maxWidth: "100%",
          },
        }}
        disableColumnResize={false}
      />

      {/* --- Edit Product Modal --- */}
      {openEdit && (
        <div className="transition-all bg-gradient-to-b from-black/20 to-black/60 backdrop-blur-sm w-full z-50 h-screen absolute top-0 left-0 flex items-center justify-center">
          <div className="bg-white p-7 rounded-lg w-[29rem]">
            <p className="text-xl font-semibold mb-7">
              Update Product Quantity
            </p>
            <form className="space-y-5" onSubmit={handleSubmit(onUpdate)}>
              <TextField
                size="small"
                fullWidth
                id="outlined-basic"
                label=" Category"
                variant="outlined"
                name="category"
                disabled
                value={selectedProduct?.category || ""}
              />
              <TextField
                size="small"
                fullWidth
                id="outlined-basic"
                label="Product Name"
                variant="outlined"
                disabled
                name="name"
                value={selectedProduct?.name || ""}
              />
              <TextField
                size="small"
                fullWidth
                id="outlined-basic"
                label="Description"
                variant="outlined"
                disabled
                name="description"
                value={selectedProduct?.description || ""}
              />
              <TextField
                error={!!errors.quantity}
                size="small"
                fullWidth
                id="outlined-basic"
                label="Quantity (in bags)"
                variant="outlined"
                type="number"
                {...register("quantity", {
                  required: { value: true, message: "Quantity is required" },
                })}
              />
              {errors.quantity && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.quantity.message}
                </span>
              )}
              <div className="flex items-center justify-end gap-3 mt-5">
                <Button
                  variant="outlined"
                  disableElevation
                  sx={{ textTransform: "none" }}
                  onClick={() => setOpenEdit(false)}
                >
                  Cancel
                </Button>
                <Button
                  loading={isUpdatingProductQuantity}
                  loadingPosition="start"
                  variant="contained"
                  disableElevation
                  sx={{ textTransform: "none" }}
                  type="submit"
                >
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsTable;
