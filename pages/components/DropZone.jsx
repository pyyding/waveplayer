import React, {useEffect} from 'react';
import {DropZone as PolarisDropzone, Stack, Spinner} from "@shopify/polaris";
import {useCallback, useState} from "react";
import * as fileStack from 'filestack-js';
import AudioForm from "./AudioForm";

const filestackClient = fileStack.init('AVFtohaytT4qYBZiDilhgz');

export default function DropZone({collectionId, metafield}) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (metafield) {
      setFiles(JSON.parse(metafield.value))
    }
  }, [metafield])

  const handleDropZoneDrop = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) =>
      uploadFile(acceptedFiles),
    [],
  );

  async function uploadFile(newFiles) {
    setLoading(true)
    const res = await filestackClient.upload(newFiles[0]);

    const newFile = { id: res.handle, title: '', url: res.url};

    setFiles(prevState => ([...prevState, newFile]));
    setLoading(false)
  }

  return (
    <Stack vertical>
      { loading ? <Spinner/> : (
        <PolarisDropzone onDrop={handleDropZoneDrop}>
          <PolarisDropzone.FileUpload allowMultiple={false} />
        </PolarisDropzone>
      )}

      <AudioForm
        collectionId={collectionId}
        metafieldId={metafield.id}
        files={files}
      />
    </Stack>
  );
}
