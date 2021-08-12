import React from 'react';
import {DropZone as PolarisDropzone, Stack, Thumbnail, Caption} from "@shopify/polaris";
import {useCallback, useState} from "react";
import {NoteMinor} from '@shopify/polaris-icons';
import {useMutation} from "react-apollo";
import gql from "graphql-tag";
import {xml2js} from "xml-js";
import { Query } from 'react-apollo';

const STAGED_UPLOADS_CREATE = gql`
  mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
    stagedUploadsCreate(input: $input) {
      stagedTargets {
        resourceUrl
        url
        parameters {
          name
          value
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const FILE_CREATE = gql`
  mutation fileCreate($files: [FileCreateInput!]!) {
    fileCreate(files: $files) {
      files {
        alt
        createdAt
      }
      userErrors {
        code
        field
        message
      }
    }
  }
`

const COLLECTION_UPDATE = gql`
  mutation collectionUpdate($input: CollectionInput!) {
    collectionUpdate(input: $input) {
      collection {
        id,
        title
      }
      job {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

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

const GET_FILE_BY_ALT = gql`
    query getFile($alt: String!) {
      file(alt: $alt) {
        url
      }
    }
`


export default function DropZone({collectionId, metafieldId}) {
  const [files, setFiles] = useState([]);

  const handleDropZoneDrop = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) =>
      uploadFile(acceptedFiles),
    [],
  );

  const [stagedUploadsCreate] = useMutation(STAGED_UPLOADS_CREATE);
  const [fileCreate] = useMutation(FILE_CREATE);
  const [productUpdate] = useMutation(UPDATE_METAFIELDS)

  async function uploadFile(files) {
    const file = files[0];
    let { data } = await stagedUploadsCreate({ variables: {
        "input": [
          {
            "resource": "FILE",
            "filename": file.name,
            "mimeType": file.type,
            "fileSize": file.size.toString(),
            "httpMethod": "POST"
          }
        ]
    }})

    console.log('stagesuploadscreate', data);

    const [{ url, parameters }] = data.stagedUploadsCreate.stagedTargets

    const formData = new FormData()

    parameters.forEach(({name, value}) => {
      formData.append(name, value)
    })

    formData.append('file', file)

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json'}
    })


    const parsed = await response.text();
    const jsoned = xml2js(parsed);

    console.log(jsoned);
    const uploadUrls = jsoned.elements.map(elem => {
      const match = elem.elements.find(subElem => subElem.name === 'Location');
      return decodeURIComponent(match.elements[0].text);
    })

    const createFileStuff = uploadUrls.map(url => ({ originalSource: url, contentType: 'IMAGE', alt: 'test-alt'}))

    const createFileRes = await fileCreate({ variables: { files: createFileStuff } })
    console.log(createFileRes);


    //
    //
    // console.log('collectionId:', collectionId);
    //
    // const anotherRes = await productUpdate({ variables: {
    //     "input": {
    //       "id": collectionId,
    //       "metafields": [
    //         {
    //           "id": metafieldId,
    //           "value": JSON.stringify({"url": uploadUrls[0]})
    //         }
    //       ]
    //     }
    //   }
    // })

    // console.log(anotherRes);
  }

  const fileUpload = !files.length && <PolarisDropzone.FileUpload allowMultiple={false} />;
  const uploadedFiles = files.length > 0 && (
    <Stack vertical>
      {files.map((file, index) => (
        <Stack alignment="center" key={index}>
          <div>
            {file.name} <Caption>{file.size} bytes</Caption>
          </div>
        </Stack>
      ))}
    </Stack>
  );

  return (
    <PolarisDropzone onDrop={handleDropZoneDrop}>
      <Query query={GET_FILE_BY_ALT} variables={{ alt: 'test-alt' }}>
        {({ data, loading, error }) => {
          if (data) {
            console.log('jee', data)
          }
          if (error) {
            console.log('shit', error);
          }
          return <div>jee</div>
        }}
      </Query>
      {uploadedFiles}
      {fileUpload}
    </PolarisDropzone>
  );
}
