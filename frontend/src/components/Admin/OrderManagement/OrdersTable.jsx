import { useState } from "react";
import { Button, CircularProgress, IconButton } from "@mui/material";
import { Eye, Mail, Phone, SquarePen, Trash2, User } from "lucide-react";
import { format } from "date-fns";
import { DataGrid } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import { formatRupee } from "../../../utils/formatRupee.js";
import { useAdminOrder } from "../../../hooks/useAdminOrders.js";

const OrdersTable = () => {
  const [singleOrderId, setSingleOrderId] = useState(null);
  const [openView, setOpenView] = useState(false);
  const {
    orders,
    singleOrder,
    ordersLoading,
    singleOrderLoading,
    approveWarehouse,
  } = useAdminOrder(singleOrderId);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const filteredOrders = orders?.filter(
    (order) => order.orderStatus === "WarehouseAssigned"
  );

  console.log("filteredOrders", filteredOrders);
  console.log("singleOrder", singleOrder);

  const handleView = (id) => {
    console.log(id);
    setSingleOrderId(id);
    setOpenView(true);
  };

  const handleUpdate = (id) => {
    console.log(id);
  };

  const handleDelete = (id) => {
    console.log(id);
  };

  const handleApprove = (id) => {
    console.log(id);
    approveWarehouse(id);
  };

  if (singleOrderLoading)
    return (
      <div className="flex items-center justify-center h-full w-full">
        <CircularProgress />
      </div>
    );

  const columns = [
    { field: "product", headerName: "Product", flex: 1, maxWidth: 150 },
    { field: "party", headerName: "Party", flex: 1, maxWidth: 150 },
    { field: "date", headerName: "Date", flex: 1, maxWidth: 150 },
    { field: "quantity", headerName: "Quantity", flex: 1, maxWidth: 150 },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      flex: 1,
      maxWidth: 150,
    },
    {
      field: "advanceAmount",
      headerName: "Advance Amount",
      flex: 1,
      maxWidth: 150,
      renderCell: (params) => (
        console.log(params.value),
        (
          <span className={`${params.value !== "₹0" && "text-green-700"}`}>
            {params.value}
          </span>
        )
      ),
    },
    {
      field: "dueAmount",
      headerName: "Due Amount",
      flex: 1,
      maxWidth: 150,
      renderCell: (params) => (
        console.log(params.value),
        (
          <span className={`${params.value !== "₹0" && "text-red-600"}`}>
            {params.value}
          </span>
        )
      ),
    },
    {
      field: "orderStatus",
      headerName: "Status",
      flex: 1,
      maxWidth: 150,
      renderCell: (params) => (
        <span
          className={`${
            params.value === "Cancelled"
              ? "text-red-800 bg-red-100 p-1 px-3 rounded-full"
              : params.value === "Delivered"
              ? "text-green-800 bg-green-100 p-1 px-3 rounded-full"
              : "text-gray-800 bg-gray-200 p-1 px-3 rounded-full"
          }`}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div className="flex items-center h-full gap-1">
          <Eye
            color="blue"
            className="hover:bg-blue-100 active:scale-95 transition-all p-1.5 rounded-lg"
            size={30}
            onClick={() => handleView(params.row.id)}
          />
          <SquarePen
            color="green"
            className="hover:bg-green-100 active:scale-95 transition-all p-1.5 rounded-lg"
            size={30}
            onClick={() => handleUpdate(params.row.id)}
          />
          <Trash2
            color="red"
            className="hover:bg-red-100 active:scale-95 transition-all p-1.5 rounded-lg"
            size={30}
            onClick={() => handleDelete(params.row.id)}
          />
        </div>
      ),
    },
  ];

  const rows = orders?.map((order) => ({
    id: order._id,
    party: order?.party?.companyName,
    date: format(order?.createdAt, "dd MMM yyyy"),
    product: order?.item?.name,
    quantity: `${order.quantity}kg`,
    totalAmount: formatRupee(order.totalAmount),
    advanceAmount: formatRupee(order.advanceAmount),
    dueAmount: formatRupee(order.dueAmount),
    orderStatus: order.orderStatus,
  }));

  if (ordersLoading)
    return (
      <div className="flex items-center justify-center h-full w-full">
        <CircularProgress />
      </div>
    );

  return (
    <div className="transition-all rounded-lg mt-5 max-w-full">
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
            maxWidth: "1210px",
          },
        }}
        disableColumnResize={false}
      />

      {/* --- View Order Modal --- */}
      {openView && (
        <div className="transition-all bg-black/30 backdrop-blur-sm w-full z-50 h-screen absolute top-0 left-0 flex items-center justify-center">
          <div className="bg-white relative p-7 rounded-lg w-[50%] h-[70%] overflow-auto">
            <div className="mb-5">
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold">Order Details</p>
                <IconButton size="small" onClick={() => setOpenView(false)}>
                  <CloseIcon />
                </IconButton>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-7">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2 text-sm">
                  <h1 className="font-semibold text-base text-gray-800">
                    Order Information
                  </h1>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Product Category:
                    </span>{" "}
                    {singleOrder?.item?.category}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Product Name:
                    </span>{" "}
                    {singleOrder?.item?.name}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">Quantity:</span>{" "}
                    {singleOrder?.quantity} kg
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Placed By:
                    </span>{" "}
                    {singleOrder?.placedBy?.name}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Placed Date:
                    </span>{" "}
                    {format(singleOrder?.createdAt, "dd MMM yyyy")}
                  </div>
                </div>
                <div className="flex flex-col gap-2 text-sm">
                  <h1 className="font-semibold text-base text-gray-800">
                    Payment Information
                  </h1>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Total Amount:
                    </span>
                    {formatRupee(singleOrder?.totalAmount)}
                  </div>
                  <div className="flex items-center justify-between font-semibold text-green-700">
                    <span className="text-gray-600 font-normal">
                      Advance Amount:
                    </span>{" "}
                    {formatRupee(singleOrder?.advanceAmount)}
                  </div>
                  <div className="flex items-center justify-between font-semibold text-red-700">
                    <span className="text-gray-600 font-normal">
                      Due Amount:
                    </span>{" "}
                    {formatRupee(singleOrder?.dueAmount)}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Payment Mode:
                    </span>{" "}
                    {singleOrder?.paymentMode}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">Due Date:</span>{" "}
                    {format(singleOrder?.dueDate, "dd MMM yyyy")}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2 text-sm">
                  <h1 className="font-semibold text-base text-gray-800">
                    Order Status
                  </h1>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Order Status:
                    </span>{" "}
                    {singleOrder?.orderStatus === "Delivered" ? (
                      <span className="text-green-700 bg-green-100 p-1 px-3 rounded-full text-xs">
                        {singleOrder?.orderStatus}
                      </span>
                    ) : (
                      <span className="text-gray-700 bg-gray-200 p-1 px-3 rounded-full text-xs">
                        {singleOrder?.orderStatus}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Payment Status:
                    </span>
                    {singleOrder?.paymentStatus === "Partial" && (
                      <span className="text-yellow-700 bg-yellow-100 p-1 px-3 rounded-full text-xs">
                        {singleOrder?.paymentStatus}
                      </span>
                    )}
                    {singleOrder?.paymentStatus === "Paid" && (
                      <span className="text-green-700 bg-green-100 p-1 px-3 rounded-full text-xs">
                        {singleOrder?.paymentStatus}
                      </span>
                    )}
                    {singleOrder?.paymentStatus === "Unpaid" && (
                      <span className="text-red-700 bg-red-100 p-1 px-3 rounded-full text-xs">
                        {singleOrder?.paymentStatus}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Invoice Generated:
                    </span>{" "}
                    {singleOrder?.invoiceGenerated === "true" ? (
                      <span className="text-green-700 bg-green-100 p-1 px-3 rounded-full text-xs">
                        Yes
                      </span>
                    ) : (
                      <span className="text-red-700 bg-red-100 p-1 px-3 rounded-full text-xs">
                        No
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 text-sm">
                  <h1 className="font-semibold text-base text-gray-800">
                    Notes
                  </h1>
                  <p className="bg-gray-100 rounded-lg p-3">
                    {singleOrder?.notes}
                  </p>
                </div>

                <div className="flex flex-col gap-2 text-sm">
                  <h1 className="font-semibold text-base text-gray-800">
                    Order Timeline
                  </h1>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Order Placed On:
                    </span>{" "}
                    {format(singleOrder?.createdAt, "dd MMM yyyy")}
                  </div>
                </div>
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between items-center">
                    <h1 className="font-semibold text-base text-gray-800">
                      Assigned Warehouse
                    </h1>
                    {singleOrder?.assignedWarehouse &&
                    singleOrder?.orderStatus === "WarehouseAssigned" ? (
                      <div className="flex gap-2 items-center">
                        <button
                          onClick={() => handleApprove(singleOrder?._id)}
                          className="text-green-800 hover:bg-green-200 active:scale-95 transition-all bg-green-100 p-1 px-2 rounded-full text-xs"
                        >
                          Approve
                        </button>
                        <button
                          // onClick={() => handleCancel(singleOrder?.id)}
                          className="text-red-800 hover:bg-red-200 active:scale-95 transition-all bg-red-100 p-1 px-2 rounded-full text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div>
                        <span className="text-green-700 bg-green-100 p-1 px-3 rounded-full text-xs">
                          Approved
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Warehouse:
                    </span>
                    {singleOrder?.assignedWarehouse ? (
                      <div className="flex flex-col items-center">
                        {singleOrder?.assignedWarehouse?.name}
                        <span className="text-xs font-normal text-gray-600">
                          ({singleOrder?.assignedWarehouse?.location})
                        </span>
                      </div>
                    ) : (
                      <span className="text-red-700 bg-red-100 p-1 px-3 rounded-full text-xs">
                        Not Assigned
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;
