import React, { useState } from 'react';
import UploadPdfModal from '../Modal/UploadPdfModal';
import { useSkidModal } from '../Modal/Skid/SkidModalContext';
import { Button } from 'react-bootstrap';
const UploadMapButton = (_account) => {
  const { setSkidModalState } = useSkidModal();

  const handleClick = () => {
    setSkidModalState((prevState) => ({
      ...prevState,
      isUploadMapModalVisible: true
    }));
  };

  return (
    <>
      <Button variant="outline-secondary" onClick={handleClick} data-testid="upload_map_button">
        <img src="/img/document.png" width="20" alt="Upload Document" />
        Upload Map
      </Button>

      <UploadPdfModal _account={_account} />
    </>
  );
};

export default UploadMapButton;
