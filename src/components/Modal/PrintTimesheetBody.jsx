const printTimeSheetBody = (modalBody) => {
  // Check if the modal body element is available
  if (!modalBody) {
    console.error('Modal body element is not found.');
    return;
  }

  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    console.error('Failed to open print window.');
    return;
  }

  // Write the modal body content to the print window
  printWindow.document.write('<html><head><title>Print Time Sheet</title>');
  printWindow.document.write('<style>');
  // Add CSS styles for printing
  printWindow.document.write(`
      body {
        font-family: Arial, sans-serif;
      }
      h1 {
        font-size: 24px;
        margin-bottom: 20px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
      th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
      th {
        background-color: #f2f2f2;
      }
      .person-details {
        margin-bottom: 20px;
      }
      /* Styles for modal header */
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #f2f2f2;
        padding: 10px 20px;
        border-bottom: 1px solid #ddd; /* Add border bottom for separation */
        border: 1px solid #ddd; /* Add border */
        border-radius: 5px 5px 0 0;
      }
      .card-header > div {
        display: flex;
        align-items: center;
      }
      .card-header .timesheet-check {
        margin-right: 10px;
      }
      .card-header .text-end {
        text-align: right;
      }
      .card-header h6 {
        margin: 0;
        font-size: 18px; /* Adjust font size for the title */
      }
    `);
  printWindow.document.write('</style></head><body>');

  // Add a title for the printed page
  printWindow.document.write('<h1>Time Sheet</h1>');

  // Write the modal body content to the print window
  printWindow.document.write('<div class="modal-body">');
  printWindow.document.write(modalBody.innerHTML);
  printWindow.document.write('</div>');

  // Call the print function of the print window
  printWindow.document.write('</body></html>');
  printWindow.print();

  // Close the print window after printing
  printWindow.close();
};

export default printTimeSheetBody;
