// components/ConfirmationModal.jsx
import { useState, useCallback, useEffect } from "react";
import Modal from "react-modal";

let globalConfirm = null;

export const ConfirmationProvider = ({ children }) => {
  const [state, setState] = useState({
    isOpen: false,
    title: "",
    message: "",
    isDanger: false,
    isAlert: false,
    resolve: () => {},
  });

  const confirm = useCallback(
    ({ title = "Uwaga!", message, isDanger = false, isAlert = false }) => {
      return new Promise((resolve) => {
        setState({
          isOpen: true,
          title,
          message,
          isDanger,
          isAlert,
          resolve,
        });
      });
    },
    []
  );

  useEffect(() => {
    globalConfirm = confirm;
    return () => (globalConfirm = null);
  }, [confirm]);

  const handleClose = (result) => {
    setState((prev) => ({ ...prev, isOpen: false }));
    state.resolve(result);
  };

  return (
    <>
      {children}
      <Modal
        isOpen={state.isOpen}
        onRequestClose={() => handleClose(false)}
        contentLabel={state.title}
        className="modal w-[90vw] md:w-auto md:max-w-2/7 shadow-xl"
        overlayClassName="overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        appElement={document.getElementById("root")}
      >
        <h2 className="text-2xl font-semibold mb-2 dark:text-white">
          {state.title}
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-300">{state.message}</p>
        <div className="flex space-x-4">
          {!state.isAlert ? (
            <>
              <button
                type="button"
                onClick={() => handleClose(true)}
                className={`w-full ${
                  state.isDanger ? "button-reject" : "button-save"
                }`} // Dynamiczna klasa
              >
                Tak
              </button>
              <button
                type="button"
                onClick={() => handleClose(false)}
                className="w-full flex items-center bg-gray-200 sm:p-2 p-1.5 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 content-center justify-center"
              >
                Anuluj
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => handleClose(true)}
              className="w-full flex items-center bg-gray-200 sm:p-2 p-1.5 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 content-center justify-center"
              >
              OK
            </button>
          )}
        </div>
      </Modal>
    </>
  );
};

export const confirm = (options) => {
  if (!globalConfirm) throw new Error("ConfirmationProvider not initialized");
  return globalConfirm(options);
};
