import React, {useState} from "react";
import { Page } from "@shopify/polaris";
import {ResourcePicker, TitleBar} from "@shopify/app-bridge-react";

const Index = () => {
  const [open, setOpen] = useState(false);
  function handleSelection(resources) {

  }

    return (
    <Page>
      <TitleBar
        primaryAction={{
          content: 'Select products',
          onAction: () => setOpen(true),
        }}
      />
      <ResourcePicker
        allowMultiple={false}
        resourceType="Product"
        showVariants={false}
        open={open}
        onSelection={(resources) => handleSelection(resources)}
        onCancel={() => setOpen(false )}
      />
    </Page>
  );
}

export default Index;
