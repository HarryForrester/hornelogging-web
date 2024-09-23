import React, { useState } from 'react';
import UploadPdfModal from '../Modal/UploadPdfModal';
//import { useSkidModal } from '../Modal/Skid/SkidModalContext';
import { Button } from 'react-bootstrap';
const UploadMapButton = () => {
  //const { setSkidModalState } = useSkidModal();
  const [showModal, setShowModal] = useState(false);
  const handleClick = () => {
   /*  setSkidModalState((prevState) => ({
      ...prevState,
      isUploadMapModalVisible: true
    })); */
    setShowModal(true);
  };

  return (
    <>
      <Button variant="outline-secondary" onClick={handleClick} data-testid="upload_map_button">
        <img src="/img/document.png" width="20" alt="Upload Document" />
        Upload Map
      </Button>

      <UploadPdfModal show={showModal} setShow={setShowModal} />
    </>
  );
};

export default UploadMapButton;
