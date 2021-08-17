import React from 'react';
import {TextField} from "@shopify/polaris";

function AudioFormItem({ onFileChange, id, url, title }) {
  function handleTitleChange(value) {
    onFileChange({ id, url, title: value })
  }

  return (
    <>
      <TextField
        label="Title"
        value={title}
        onChange={handleTitleChange}
      />
      <span>{url}</span>
    </>
  );
}

export default AudioFormItem;
