import React from "react";
import ProductsTable from "../../components/Planthead/ProductsTable";

const ProductsManagementPage = () => {
  return (
    <div>
      <h1 className="lg:text-3xl lg:font-bold mb-5">
        Product Management -{" "}
        <span className="text-gray-500">Central Warehouse</span>
      </h1>

      <div>
        <ProductsTable />
      </div>
    </div>
  );
};

export default ProductsManagementPage;
