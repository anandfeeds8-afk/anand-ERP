import { useState } from "react";
import {
  Button,
  CircularProgress,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import { Download, Eye, FileBox, SquarePen, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { DataGrid } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import { formatRupee } from "../../utils/formatRupee.js";
import { usePlantheadOrder } from "../../hooks/usePlanthead.js";
import { downloadFile } from "../../utils/downloadFile.js";
import { useTheme } from "../../context/ThemeContext";

const DispatchedOrders = () => {
  const { resolvedTheme } = useTheme();
  const [singleOrderId, setSingleOrderId] = useState(null);
  const [openView, setOpenView] = useState(false);
  const [openInvoice, setOpenInvoice] = useState(false);

  const {
    singleOrderFromPlanthead,
    singleOrderLoading,
    dispatchedOrdersInPlanthead,
    dispatchedOrdersInPlantheadLoading,
  } = usePlantheadOrder(singleOrderId);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const handleView = (id) => {
    setSingleOrderId(id);
    setOpenView(true);
  };

  const totalBeforeDiscount =
    singleOrderFromPlanthead?.totalAmount /
    (1 - singleOrderFromPlanthead?.discount / 100);

  const ProductsCell = ({ items }) => {
    return (
      <div className="w-full">
        <table className="w-full">
          <thead className="bg-blue-50 dark:bg-blue-950">
            <tr>
              <th className="text-left font-normal">Product</th>
              <th className="text-right font-normal">Qty (in bags)</th>
            </tr>
          </thead>
          <tbody>
            {items?.map((p, i) => (
              <tr
                key={i}
                className={
                  i % 2 === 0
                    ? "bg-white dark:bg-gray-900"
                    : "bg-gray-50 dark:bg-gray-950"
                }
              >
                <td className="text-left">{p.product?.name}</td>
                <td className="text-right">{p.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const columns = [
    {
      field: "orderId",
      headerName: "Order ID",
      flex: 1,
      minWidth: 80,
      maxWidth: 100,
    },
    {
      field: "product",
      headerName: "Product",
      flex: 1,
      minWidth: 250,
      renderCell: (params) => (
        <div className="w-full h-full">
          <ProductsCell items={params.row.product} />
        </div>
      ),
    },
    { field: "party", headerName: "Party", flex: 1, minWidth: 100 },
    { field: "date", headerName: "Date", flex: 1, minWidth: 100 },
    { field: "quantity", headerName: "Quantity", flex: 1, minWidth: 100 },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "advanceAmount",
      headerName: "Advance Amount",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <span className={`${params.value !== "₹0" && "text-green-700"}`}>
          {params.value}
        </span>
      ),
    },
    {
      field: "dueAmount",
      headerName: "Due Amount",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <span className={`${params.value !== "₹0" && "text-red-600"}`}>
          {params.value}
        </span>
      ),
    },
    {
      field: "orderStatus",
      headerName: "Status",
      flex: 1,
      minWidth: 100,
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
          <Tooltip title="View order details" enterDelay={500} placement="top">
            <Eye
              color="blue"
              className="hover:bg-blue-100 active:scale-95 transition-all p-1.5 rounded-lg"
              size={30}
              onClick={() => handleView(params.row.id)}
            />
          </Tooltip>
          <Tooltip
            title="View Dispatch Documents"
            enterDelay={500}
            placement="top"
          >
            <FileBox
              strokeWidth={2.1}
              color="green"
              className="hover:bg-green-200 active:scale-95 transition-all p-1.5 rounded-lg"
              size={30}
              onClick={() => {
                setSingleOrderId(params.row.id);
                if (!singleOrderLoading && singleOrderFromPlanthead) {
                  setOpenInvoice(true);
                }
              }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const rows = dispatchedOrdersInPlanthead?.map((order) => ({
    id: order._id,
    orderId: `#${order.orderId}`,
    party: order?.party?.companyName,
    date: format(order?.createdAt, "dd MMM yyyy"),
    product: order?.items,
    quantity: order?.items?.map((p) => `${p.quantity} bags`).join(", "),
    totalAmount: formatRupee(order.totalAmount),
    advanceAmount: formatRupee(order.advanceAmount),
    dueAmount: formatRupee(order.dueAmount),
    orderStatus: order.orderStatus,
  }));

  if (dispatchedOrdersInPlantheadLoading || singleOrderLoading)
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
        disableColumnResize={false}
        getRowHeight={() => "auto"}
        sx={{
          width: "100%",
          borderRadius: "6px",
          borderColor: resolvedTheme === "dark" ? "transparent" : "#e5e7eb",
          backgroundColor: resolvedTheme === "dark" ? "#0f172a" : "#fff",
          color: resolvedTheme === "dark" ? "#e5e7eb" : "#111827",

          // 🔹 Header Row Background
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor:
              resolvedTheme === "dark"
                ? "#1e293b !important"
                : "#f9fafb !important",
            color: resolvedTheme === "dark" ? "#f1f5f9" : "#000",
          },

          // 🔹 Header Cell
          "& .MuiDataGrid-columnHeader": {
            backgroundColor:
              resolvedTheme === "dark"
                ? "#1e293b !important"
                : "#f9fafb !important",
            color: resolvedTheme === "dark" ? "#9ca3af" : "#000",
          },

          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "600",
            textTransform: "uppercase",
            fontSize: "12px",
          },

          // ❌ Remove blue outline when cell is active/focused
          "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
            outline: "none !important",
          },

          // 🔹 Hover row (lighter shade)
          "& .MuiDataGrid-row:hover": {
            backgroundColor:
              resolvedTheme === "dark"
                ? "rgba(59,130,246,0.1)"
                : "rgba(59,130,246,0.05)",
            transition: "background-color 0.2s ease-in-out",
          },

          // 🔹 Pagination buttons
          "& .MuiTablePagination-root": {
            color: resolvedTheme === "dark" ? "#e5e7eb" : "#111827",
          },

          "& .MuiPaginationItem-root": {
            borderRadius: "6px",
            color: resolvedTheme === "dark" ? "#e5e7eb" : "#111827",
          },

          "& .MuiPaginationItem-root.Mui-selected": {
            backgroundColor: resolvedTheme === "dark" ? "#1e40af" : "#2563eb",
            color: "#fff",
          },

          "& .MuiPaginationItem-root:hover": {
            backgroundColor: resolvedTheme === "dark" ? "#1e3a8a" : "#dbeafe",
          },

          // ✅ Add these styles for multi-line rows:
          "& .MuiDataGrid-cell": {
            display: "flex",
            alignItems: "center",
            padding: "8px",
            lineHeight: "normal",
            overflowY: "auto",

            scrollbarColor: "#80808040 transparent",
            scrollbarWidth: "thin",
            scrollbarGutter: "stable",

            borderColor: resolvedTheme === "dark" ? "#374151" : "#e5e7eb",
            backgroundColor: resolvedTheme === "dark" ? "#0f172a" : "#fff",
            color: resolvedTheme === "dark" ? "#9ca3af" : "#000",

            "&::-webkit-scrollbar": {
              width: "4px",
              height: "4px",
            },

            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#80808080",
              borderRadius: "4px",
            },

            "&::-webkit-scrollbar-button:single-button": {
              display: "none",
              width: "0px",
              height: "0px",
              background: "transparent",
              border: "none",
            },

            "&::-webkit-scrollbar-button": {
              display: "none",
              width: 0,
              height: 0,
              background: "transparent",
            },
          },

          "& .MuiDataGrid-row": {
            maxHeight: "100px !important",
            minHeight: "50px !important",
          },
        }}
      />

      {/* --- View Order Modal --- */}
      {openView && (
        <div className="transition-all bg-gradient-to-b from-black/20 to-black/60 backdrop-blur-sm w-full z-50 h-screen absolute top-0 left-0 flex items-center justify-center">
          <div className="bg-white relative lg:p-7 p-5 rounded-lg lg:max-w-[60%] lg:min-w-[50%] lg:max-h-[95%] w-[95%] max-h-[95%] overflow-auto">
            <div className="lg:mb-5 mb-2">
              <div className="flex items-center justify-between">
                <p className="lg:text-xl text-base font-bold">
                  Order Details - #{singleOrderFromPlanthead?.orderId}
                </p>
                <IconButton size="small" onClick={() => setOpenView(false)}>
                  <CloseIcon />
                </IconButton>
              </div>
            </div>

            {/* products table */}
            <div className="relative overflow-x-auto mb-5 max-h-52">
              <table className="w-full lg:text-sm text-xs text-left text-gray-500 overflow-auto">
                <thead className="sticky top-0 bg-gray-100 text-gray-800 z-10">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Product Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Price/bag
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Quantity
                    </th>
                  </tr>
                </thead>
                <tbody className="lg:text-sm text-xs">
                  {singleOrderFromPlanthead?.items?.map((item) => (
                    <tr
                      key={item._id}
                      className="bg-white border-b border-gray-200"
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        {item?.product?.name}
                      </th>
                      <td className="px-6 py-4">{item?.product?.category}</td>
                      <td className="px-6 py-4">
                        {formatRupee(item?.product?.price)}
                      </td>
                      <td className="px-6 py-4">{item?.quantity} bags</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-7">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2 lg:text-sm text-xs">
                  <h1 className="font-semibold lg:text-base text-sm text-gray-800">
                    Order Information
                  </h1>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Placed By:
                    </span>
                    {singleOrderFromPlanthead?.placedBy?.name}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Placed Date:
                    </span>
                    {format(singleOrderFromPlanthead?.createdAt, "dd MMM yyyy")}
                  </div>
                </div>
                <div className="flex flex-col gap-2 lg:text-sm text-xs">
                  <h1 className="font-semibold lg:text-base text-sm text-gray-800">
                    Payment Information
                  </h1>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">Subtotal:</span>
                    {formatRupee(totalBeforeDiscount)}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Discount ({singleOrderFromPlanthead?.discount}%):
                    </span>
                    -
                    {formatRupee(
                      totalBeforeDiscount -
                        singleOrderFromPlanthead?.totalAmount
                    )}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Net Total:
                    </span>
                    {formatRupee(singleOrderFromPlanthead?.totalAmount)}
                  </div>
                  <div className="flex items-center justify-between font-semibold text-green-700">
                    <span className="text-gray-600 font-normal">
                      Advance Amount:
                    </span>
                    {formatRupee(singleOrderFromPlanthead?.advanceAmount)}
                  </div>
                  <div className="flex items-center justify-between font-semibold text-red-700">
                    <span className="text-gray-600 font-normal">
                      Due Amount:
                    </span>
                    {formatRupee(singleOrderFromPlanthead?.dueAmount)}
                  </div>
                  {singleOrderFromPlanthead?.advanceAmount > 0 && (
                    <div className="flex items-center justify-between font-semibold text-red-700">
                      <span className="text-gray-600 font-normal">
                        Advance Confirmation:
                      </span>
                      {singleOrderFromPlanthead?.advancePaymentStatus ===
                        "Approved" && (
                        <span className="text-green-700 font-semibold bg-green-100 p-0.5 px-2 rounded-full lg:text-xs text-[10px]">
                          Confirmed
                        </span>
                      )}
                      {singleOrderFromPlanthead?.advancePaymentStatus ===
                        "SentForApproval" && (
                        <span className="text-indigo-700 font-semibold bg-indigo-100 p-0.5 px-2 rounded-full lg:text-xs text-[10px]">
                          Sent For Confirmation
                        </span>
                      )}
                      {singleOrderFromPlanthead?.advancePaymentStatus ===
                        "Pending" && (
                        <span className="text-yellow-700 font-semibold bg-yellow-100 p-0.5 px-2 rounded-full lg:text-xs text-[10px]">
                          Pending
                        </span>
                      )}
                      {singleOrderFromPlanthead?.advancePaymentStatus ===
                        "Rejected" && (
                        <span className="text-red-700 font-semibold bg-red-100 p-0.5 px-2 rounded-full lg:text-xs text-[10px]">
                          Rejected
                        </span>
                      )}
                    </div>
                  )}
                  {singleOrderFromPlanthead?.duePaymentStatus && (
                    <div className="flex items-center justify-between font-semibold text-red-700">
                      <span className="text-gray-600 font-normal">
                        Due Confirmation:
                      </span>
                      {singleOrderFromPlanthead?.duePaymentStatus ===
                        "Approved" && (
                        <span className="text-green-700 font-semibold bg-green-100 p-0.5 px-2 rounded-full lg:text-xs text-[10px]">
                          Confirmed
                        </span>
                      )}
                      {singleOrderFromPlanthead?.duePaymentStatus ===
                        "SentForApproval" && (
                        <span className="text-indigo-700 font-semibold bg-indigo-100 p-0.5 px-2 rounded-full lg:text-xs text-[10px]">
                          Sent For Confirmation
                        </span>
                      )}
                      {singleOrderFromPlanthead?.duePaymentStatus ===
                        "Pending" && (
                        <span className="text-yellow-700 font-semibold bg-yellow-100 p-0.5 px-2 rounded-full lg:text-xs text-[10px]">
                          Pending
                        </span>
                      )}
                      {singleOrderFromPlanthead?.duePaymentStatus ===
                        "Rejected" && (
                        <span className="text-red-700 font-semibold bg-red-100 p-0.5 px-2 rounded-full lg:text-xs text-[10px]">
                          Rejected
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Advance Payment Mode:
                    </span>
                    {singleOrderFromPlanthead?.paymentMode}
                  </div>
                  {singleOrderFromPlanthead?.duePaymentMode && (
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-gray-600 font-normal">
                        Due Payment Mode:
                      </span>
                      {singleOrderFromPlanthead?.duePaymentMode}
                    </div>
                  )}
                  {singleOrderFromPlanthead?.dueAmount !== 0 && (
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-gray-600 font-normal">
                        Due Date:
                      </span>
                      {format(singleOrderFromPlanthead?.dueDate, "dd MMM yyyy")}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2 lg:text-sm text-xs">
                  <h1 className="font-semibold lg:text-base text-sm text-gray-800">
                    Order Status
                  </h1>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Order Status:
                    </span>
                    {singleOrderFromPlanthead?.orderStatus === "Delivered" ? (
                      <span className="text-green-700 bg-green-100 p-0.5 px-2 rounded-full lg:text-xs text-[10px]">
                        {singleOrderFromPlanthead?.orderStatus}
                      </span>
                    ) : singleOrderFromPlanthead?.orderStatus ===
                      "Cancelled" ? (
                      <span className="text-red-700 bg-red-100 p-0.5 px-2 rounded-full lg:text-xs text-[10px]">
                        {singleOrderFromPlanthead?.orderStatus}
                      </span>
                    ) : (
                      <span className="text-gray-700 bg-gray-200 p-0.5 px-2 rounded-full lg:text-xs text-[10px]">
                        {singleOrderFromPlanthead?.orderStatus}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Payment Status:
                    </span>
                    {singleOrderFromPlanthead?.paymentStatus ===
                      "PendingDues" && (
                      <span className="text-red-700 bg-red-100 p-0.5 px-2 rounded-full lg:text-xs text-[10px]">
                        Pending Dues
                      </span>
                    )}
                    {singleOrderFromPlanthead?.paymentStatus === "Paid" && (
                      <span className="text-green-700 bg-green-100 p-0.5 px-2 rounded-full lg:text-xs text-[10px]">
                        Paid
                      </span>
                    )}
                    {singleOrderFromPlanthead?.paymentStatus ===
                      "ConfirmationPending" && (
                      <span className="text-yellow-700 bg-yellow-100 p-0.5 px-2 rounded-full lg:text-xs text-[10px]">
                        Confirmation Pending
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Invoice Generated:
                    </span>
                    {singleOrderFromPlanthead?.invoiceGenerated ? (
                      <span className="text-green-800 bg-green-100 p-0.5 px-2 rounded-full lg:text-xs text-[10px]">
                        Yes
                      </span>
                    ) : (
                      <span className="text-red-700 bg-red-100 p-0.5 px-2 rounded-full lg:text-xs text-[10px]">
                        No
                      </span>
                    )}
                  </div>
                  {singleOrderFromPlanthead?.dueInvoiceGenerated && (
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-gray-600 font-normal">
                        Due Invoice Generated:
                      </span>
                      {singleOrderFromPlanthead?.dueInvoiceGenerated ? (
                        <span className="text-green-800 bg-green-100 p-0.5 px-2 rounded-full lg:text-xs text-[10px]">
                          Yes
                        </span>
                      ) : (
                        <span className="text-red-700 bg-red-100 p-0.5 px-2 rounded-full lg:text-xs text-[10px]">
                          No
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 lg:text-sm text-xs">
                  <h1 className="font-semibold lg:text-base text-sm text-gray-800">
                    Shipping Details
                  </h1>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">Address:</span>
                    {singleOrderFromPlanthead?.shippingAddress}
                  </div>
                </div>

                {/* assigned warehouse */}
                <div className="flex flex-col gap-2 lg:text-sm text-xs">
                  <h1 className="font-semibold lg:text-base text-sm text-gray-800">
                    Assigned Plant
                  </h1>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">Plant:</span>
                    {singleOrderFromPlanthead?.assignedWarehouse ? (
                      <div className="flex flex-col items-center">
                        <p>
                          {singleOrderFromPlanthead?.assignedWarehouse?.name}
                        </p>
                        <p className="text-xs font-normal text-gray-600">
                          (
                          {
                            singleOrderFromPlanthead?.assignedWarehouse
                              ?.location
                          }
                          )
                        </p>
                      </div>
                    ) : (
                      <span className="text-red-700 bg-red-100 p-0.5 px-2 rounded-full lg:text-xs text-[10px]">
                        Not Assigned
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-gray-600 font-normal">
                      Plant Approval:
                    </span>
                    {singleOrderFromPlanthead?.approvedBy ? (
                      <span className="text-green-700 font-semibold bg-green-100 p-0.5 px-2 rounded-full lg:text-xs text-[10px]">
                        Approved
                      </span>
                    ) : (
                      <span className="text-red-700 font-semibold bg-red-100 p-0.5 px-2 rounded-full lg:text-xs text-[10px]">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* notes  */}
            <div className="flex flex-col gap-2 lg:text-sm text-xs mt-5">
              <h1 className="font-semibold lg:text-base text-sm text-gray-800">
                Notes
              </h1>
              <div className="bg-yellow-50 rounded-lg p-3 w-full">
                <p className="break-words whitespace-normal">
                  {singleOrderFromPlanthead?.notes}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Open Dispatch Details Modal */}
      {openInvoice && (
        <div className="transition-all bg-gradient-to-b from-black/20 to-black/60 backdrop-blur-sm w-full z-50 h-screen absolute top-0 left-0 flex items-center justify-center">
          <div className="bg-white relative lg:p-7 p-5 rounded-lg lg:max-w-[60%] lg:min-w-[50%] lg:max-h-[95%] md:w-[80%] w-[95%] max-h-[95%] overflow-auto">
            <div className="mb-5">
              <div className="flex items-center justify-between">
                <p className="lg:text-xl text-base font-bold">
                  Dispatch Details
                </p>
                <div className="flex items-center gap-5">
                  <Tooltip
                    title="Download Dispatch Docs"
                    enterDelay={500}
                    placement="top"
                  >
                    <Download
                      color="blue"
                      className="hover:bg-blue-200 active:scale-95 transition-all p-1.5 rounded-lg"
                      size={30}
                      onClick={() =>
                        downloadFile(
                          singleOrderFromPlanthead?.dispatchInfo?.dispatchDocs,
                          "dispatch-docs"
                        )
                      }
                    />
                  </Tooltip>
                  <IconButton
                    size="small"
                    onClick={() => setOpenInvoice(false)}
                  >
                    <CloseIcon />
                  </IconButton>
                </div>
              </div>
            </div>

            <div className="rounded-lg shadow mb-5">
              {singleOrderFromPlanthead?.dispatchInfo?.dispatchDocs?.endsWith(
                ".pdf"
              ) ? (
                <iframe
                  src={singleOrderFromPlanthead?.dispatchInfo?.dispatchDocs}
                  className="w-full h-96"
                  title="Dispatch Documents PDF"
                />
              ) : (
                <Tooltip title="Click to view invoice in new tab" followCursor>
                  <a
                    href={singleOrderFromPlanthead?.dispatchInfo?.dispatchDocs}
                    target="_blank"
                  >
                    {(
                      <img
                        src={
                          singleOrderFromPlanthead?.dispatchInfo?.dispatchDocs
                        }
                        className="w-full h-full object-contain"
                        alt="Dispatch Documents"
                      />
                    ) || (
                      <p className="p-5  text-gray-600 text-center">
                        Loading...
                      </p>
                    )}
                  </a>
                </Tooltip>
              )}
            </div>

            <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 lg:gap-7 gap-5">
              <div className="flex flex-col gap-2 lg:text-sm text-xs">
                <h1 className="font-semibold lg:text-base text-sm text-gray-800">
                  Dispatched By
                </h1>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">Name:</span>
                  {singleOrderFromPlanthead?.dispatchInfo?.dispatchedBy?.name}
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">Email:</span>
                  {singleOrderFromPlanthead?.dispatchInfo?.dispatchedBy?.email}
                </div>
              </div>
              <div className="flex flex-col gap-2 lg:text-sm text-xs">
                <h1 className="font-semibold lg:text-base text-sm text-gray-800">
                  Dispatched Details:
                </h1>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">
                    Dispatched on:
                  </span>
                  {format(
                    singleOrderFromPlanthead?.dispatchInfo?.dispatchDate,
                    "dd MMM yyyy"
                  )}
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-600 font-normal">
                    Transport Company:
                  </span>
                  {singleOrderFromPlanthead?.dispatchInfo?.transportCompany}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DispatchedOrders;
