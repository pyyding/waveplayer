import React from 'react';
import {TextField, Button} from "@shopify/polaris";

function AudioFormItem({ onFileChange, id, url, title, onDelete }) {
  function handleTitleChange(value) {
    onFileChange({ id, url, title: value })
  }

  function handleDelete() {
    onDelete(id);
  }

  return (
    <>
      <TextField
        label="Title"
        value={title}
        onChange={handleTitleChange}
      />
      <span>{url}</span>
      <Button onClick={handleDelete}>Delete</Button>
    </>
  );
}

export default AudioFormItem;
