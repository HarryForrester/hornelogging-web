function printBody(modalBody) {
  console.log('moday body:', modalBody);
  // Clone the entire modal content, including the scrollable parts
  const clonedContent = modalBody.cloneNode(true);

  // Create a new div element to hold the cloned content
  const printContent = document.createElement('div');
  printContent.appendChild(clonedContent);

  // Find all form elements with class names corresponding to their types
  const formElements = printContent.querySelectorAll(
    'input.form-control, select.form-control, input[type="checkbox"], input[type="radio"], input[type="text"], input[type="number"], textarea, [data-type="image"], [data-type="signature"]'
  );

  // Handle each form element based on its type
  formElements.forEach((formElement) => {
    const type = formElement.getAttribute('data-type');

    if (type === 'checkbox' || type === 'radio') {
      // Convert checkbox or radio input to a custom element representing its status
      const checkboxStatus = document.createElement('span');
      checkboxStatus.textContent = formElement.checked ? '☑' : '☐';
      formElement.parentNode.insertBefore(checkboxStatus, formElement.nextSibling);
      formElement.style.display = 'none'; // Hide the original checkbox or radio
    } else if (type === 'image' || type === 'signature') {
      // Handle image or signature elements (you can customize this part)
      // For example, display the type and a placeholder for the content
      const elementType = document.createElement('span');
      elementType.textContent = type === 'image' ? 'Image: ' : 'Signature: ';
      const placeholder = document.createElement('span');
      placeholder.textContent = 'Placeholder Text';
      formElement.parentNode.insertBefore(elementType, formElement);
      formElement.parentNode.insertBefore(placeholder, formElement.nextSibling);
      formElement.style.display = 'none'; // Hide the original input
    } else {
      // For other input elements (text, number, textarea, select), just display the value
      const valueSpan = document.createElement('span');
      valueSpan.textContent = formElement.value;
      formElement.parentNode.insertBefore(valueSpan, formElement.nextSibling);
      formElement.style.display = 'none'; // Hide the original input
    }
  });

  // Open a new window
  const printWindow = window.open('', '', 'height=500,width=800');

  // Write the content of the new div to the new window
  printWindow.document.write(`
    <html>
      <head>
        <title>Print Form</title>
        <style>
          /* Add your custom styles here */
          body {
            font-family: Arial, sans-serif; /* Set the font family to improve readability */
          }

          .form-control + span,
          select.form-control + span,
          input[type="checkbox"] + span,
          input[type="radio"] + span,
          textarea + span,
          [data-type="image"] + span,
          [data-type="signature"] + span {
            font-size: 15px; /* Set the font size to the desired size */
            /* Add any additional styles to customize the appearance of the value span */
            margin: 10px; /* Add right margin between input and value span */
          }

          /* Optionally, you can add spacing between elements as needed */
          .border {
            margin-bottom: 10px; /* Add bottom margin to each form container */
            border: 1px solid #ccc;
            padding: 10px;
          }

          /* Custom print styles to hide input elements and show input values when printing */
          @media print {
            .form-control,
            select.form-control,
            input[type="checkbox"],
            input[type="radio"],
            textarea,
            [data-type="image"],
            [data-type="signature"] {
              display: none; /* Hide the input elements in the printed version */
            }
            
            /* Handle scrolling in the printed document */
            body {
              overflow-y: auto;
            }
          }
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
      </body>
    </html>
  `);

  // Call the print function of the new window to trigger printing
  printWindow.print();
}

export default printBody;
