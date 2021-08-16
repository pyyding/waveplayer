import React from 'react';
import {DropZone as PolarisDropzone, Stack} from "@shopify/polaris";
import {useCallback, useState} from "react";
import {useMutation} from "react-apollo";
import gql from "graphql-tag";
import * as fileStack from 'filestack-js';

const filestackClient = fileStack.init('AVFtohaytT4qYBZiDilhgz');

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

export default function DropZone({collectionId, metafieldId}) {
  const [files, setFiles] = useState([]);

  const handleDropZoneDrop = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) =>
      uploadFile(acceptedFiles),
    [],
  );

  const [productUpdate] = useMutation(UPDATE_METAFIELDS)

  async function uploadFile(files) {
    const res = await filestackClient.upload(files[0]);

    const anotherRes = await productUpdate({ variables: {
        "input": {
          "id": collectionId,
          "metafields": [
            {
              "id": metafieldId,
              "value": JSON.stringify({"url": res.url})
            }
          ]
        }
      }
    })
    setFiles([{ url: res.url }])
  }

  const fileUpload = !files.length && <PolarisDropzone.FileUpload allowMultiple={false} />;
  const uploadedFiles = files.length > 0 && (
    <Stack vertical>
      {files.map((file, index) => (
        <Stack alignment="center" key={index}>
          <div>
            {file.url}
          </div>
        </Stack>
      ))}
    </Stack>
  );

  return (
    <PolarisDropzone onDrop={handleDropZoneDrop}>
      {uploadedFiles}
      {fileUpload}
    </PolarisDropzone>
  );
}
