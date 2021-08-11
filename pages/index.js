import React, {useState} from "react";
import { Page } from "@shopify/polaris";
import {ResourcePicker, TitleBar} from "@shopify/app-bridge-react";
import ProductForm from "./components/ProductForm";

const Index = () => {
  const [open, setOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState();

  function handleSelection(resources) {
   const product = resources.selection[0];
   setSelectedProductId(product.id);
  }

    return (
    <Page>
      <TitleBar
        title='Select Product'
        primaryAction={{
          content: 'Select Product',
          onAction: () => setOpen(true),
        }}
      />
      {!selectedProductId ?
        (
          <ResourcePicker
            allowMultiple={false}
            resourceType="Product"
            showVariants={false}
            open={open}
            onSelection={(resources) => handleSelection(resources)}
            onCancel={() => setOpen(false)}
          />
        ) : (
          <ProductForm id={selectedProductId}/>
        )
      }
    </Page>
  );
}

export default Index;
