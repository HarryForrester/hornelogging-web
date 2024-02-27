// SuccessAlert.js
import React, { useEffect } from 'react';
import { Toast } from 'react-bootstrap';
import { useAlertMessage } from '../AlertMessage';
import { formatDistanceToNow } from 'date-fns';


const SuccessAlert = () => {
    const { alertMessageState, setAlertMessageState } = useAlertMessage();

    const handleHide = (toastId) => {
      console.log("the toast id: ", toastId);
        setAlertMessageState((prevState) => ({
            ...prevState,
            toasts: prevState.toasts.map((toast) =>
                toast.id === toastId
                    ? {
                          ...toast,
                          show: false,
                      }
                    : toast
            ),
        }));

        // Set a timeout to remove the toast from the state after 5000 milliseconds (5 seconds)
        setTimeout(() => {
            setAlertMessageState((prevState) => ({
                ...prevState,
                toasts: prevState.toasts.filter((toast) => toast.id !== toastId),
            }));
        }, 5000);
    };

    /* useEffect(() => {
        // Cleanup function to remove hidden toasts from the state
        setAlertMessageState((prevState) => ({
            ...prevState,
            toasts: prevState.toasts.filter((toast) => toast.show),
        }));
    }, [alertMessageState.toasts, setAlertMessageState]);
 */
    return (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}>
            {alertMessageState.toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    bg={toast.background}
                    onClose={() => handleHide(toast.id)}
                    show={toast.show}
                >
                    <Toast.Header>
                        <strong className="me-auto">{toast.heading}</strong>
                        <small>{formatDistanceToNow(new Date(toast.id), {addSuffix: true})}</small>
                    </Toast.Header>
                    <Toast.Body style={{ color: toast.color }}>{toast.message}</Toast.Body>
                </Toast>
            ))}
        </div>
    );
};

export default SuccessAlert;
