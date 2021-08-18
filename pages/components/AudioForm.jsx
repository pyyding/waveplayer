import React, {useEffect, useState} from 'react';
import {Form, FormLayout, Button} from "@shopify/polaris";
import gql from "graphql-tag";
import {useMutation} from "react-apollo";
import AudioFormItem from "./AudioFormItem";

const UPDATE_PRODUCT = gql`
  mutation productUpdate($input: ProductInput!) {
    productUpdate(input: $input) {
      product {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

function AudioForm({ files: initFiles, collectionId, metafieldId }) {
  const [metaFieldValue, setMetafieldValue] = useState([]);
  const [toDeleteIds, setToDeleteIds] = useState([]);

  const [productUpdate] = useMutation(UPDATE_PRODUCT)

  useEffect(() => {
    if (initFiles) {
      if (metaFieldValue.length > 0) {
        setMetafieldValue(prevState => {
          const oldFiles = prevState.filter(oldFile => !!initFiles.find(newFile => newFile.id === oldFile.id))
          const newFiles = initFiles.filter(file => !prevState.find(prevFile => prevFile.id === file.id))
          return [...oldFiles, ...newFiles]
        })
      } else {
        setMetafieldValue(initFiles);
      }
    }
  }, [initFiles])

  const replace = (array, index, item) => [...array.slice(0, index), item, ...array.slice(index + 1)];

  function handleFileChange(newFile) {
    const matchIndex = metaFieldValue.findIndex(file => file.id === newFile.id)

    if (matchIndex !== -1) {
      const newValue = replace(metaFieldValue, matchIndex, newFile);
      setMetafieldValue(newValue)
      return
    }
    setMetafieldValue([...metaFieldValue, newFile])
  }

  function getMetafieldPayload(id, value) {
    if (id) {
      return {
        id,
        value: JSON.stringify(value),
      }
    }
    return {
      namespace: 'my_fields',
      key: 'audio',
      value: JSON.stringify(value),
      type: 'json',
    }
  }

  async function handleSubmit() {
    const metafieldPayload = getMetafieldPayload(metafieldId, metaFieldValue)

    await productUpdate({ variables: {
      input : {
        id: collectionId,
        metafields: [metafieldPayload]
      }
    }})
    // todo delete from fileshack but use a hook
    // const deleteFiles = useDeleteFiles
    // await deleteFiles(toDeleteIds);
  }

  function handleDelete(id) {
    setMetafieldValue(metaFieldValue.filter(file => file.id !== id));
    setToDeleteIds([...toDeleteIds, id]);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormLayout>
        { metaFieldValue.map(file => (
          <AudioFormItem
            id={file.id}
            key={file.id}
            url={file.url}
            title={file.title}
            onFileChange={handleFileChange}
            onDelete={handleDelete}
          />
        ))}
        <Button submit>Save</Button>
      </FormLayout>
    </Form>
  );
}

export default AudioForm;
