import React, {useEffect, useState} from 'react';
import {Form, FormLayout, TextField, Button} from "@shopify/polaris";
import gql from "graphql-tag";
import {useMutation} from "react-apollo";
import AudioFormItem from "./AudioFormItem";

const UPDATE_METAFIELDS = gql`
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

  const [productUpdate] = useMutation(UPDATE_METAFIELDS)

  useEffect(() => {
    if (initFiles) {
      if (metaFieldValue.length > 0) {
        const oldFiles = metaFieldValue.filter(oldFile => !!initFiles.find(newFile => newFile.id === oldFile.id))
        const newFiles = initFiles.filter(file => !metaFieldValue.find(prevFile => prevFile.id === file.id))
        setMetafieldValue([...oldFiles, ...newFiles])
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

  async function handleSubmit() {
    await productUpdate({ variables: {
        input: {
          id: collectionId,
          metafields: [
            {
              id: metafieldId,
              value: JSON.stringify(metaFieldValue)
            }
          ]
        }
      }
    })
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
          />
        ))}
        <Button submit>Save</Button>
      </FormLayout>
    </Form>
  );
}

export default AudioForm;
