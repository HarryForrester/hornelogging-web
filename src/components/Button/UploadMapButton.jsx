import React, { useState } from 'react';
import UploadPdfModal from '../Modal/UploadPdfModal';
import ErrorConfirmationModal from '../Modal/ErrorConfirmationModal';
import { SkidModalProvider, useSkidModal } from '../Modal/Skid/SkidModalContext';
import { Button } from 'react-bootstrap';
const UploadMapButton = () => {
  const { skidModalState, setSkidModalState } = useSkidModal();

  const handleClick = () => {
    setSkidModalState((prevState) => ({
      ...prevState,
      isUploadMapModalVisible: true
    }));
  };

  return (
    <>
      <Button variant="outline-secondary" onClick={handleClick}>
        <img src="/img/document.png" width="20" alt="Upload Document" />
        Upload Map
      </Button>

      <UploadPdfModal />
    </>
  );
};

export default UploadMapButton;
