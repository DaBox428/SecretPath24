import React, { forwardRef } from "react";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { ThreeDots } from "react-loader-spinner";
const LoginDialogue = forwardRef(
  (
    {
      handleSendLogin,
      modalOpen,
      setModalOpen,
      loginValue,
      setLoginValue,
      loadingSpinner,
    },
    loginModalRef
  ) => {
    return (
      <dialog
        id="loginModal"
        ref={loginModalRef}
        className="z-10 p-24 border bg-[#121212] rounded-2xl backdrop:bg-black/40 backdrop:backdrop-blur-sm overflow-hidden"
        onClose={(e) => {}}
        onKeyDown={(e) => {
          if (e.nativeEvent.key == "Escape") {
            e.preventDefault();
            loginModalRef.current?.showModal();
            setModalOpen(login);
          }
        }}
      >
        {/* toast si perficient mail esta mal */}
        {modalOpen == "login" && (
          <SnackbarProvider
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          />
        )}
        <h1 className="text-[#b3b3b3] text-center text-xl">Username:</h1>
        <input
          placeholder="Enter your perficient email... "
          className="flex m-auto mt-4 rounded-md p-1.5 w-64"
          type="email"
          value={loginValue}
          autoFocus
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              handleSendLogin();
            }
          }}
          onChange={(e) => {
            setLoginValue(e.target.value);
          }}
        />
        <br />
        <div className="  grid ">
          {loadingSpinner && (
            <div className="m-auto pb-4">
              <ThreeDots
                visible={true}
                height="40"
                width="40"
                color="#4fa94d"
                radius="9"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            </div>
          )}

          <button
            id="login"
            name="login"
            type="submit"
            autoFocus
            tabIndex={0}
            onClick={handleSendLogin}
            className="bg-[#b3b3b3] p-3 rounded hover:bg-[#535353]"
          >
            Log In
          </button>
        </div>
      </dialog>
    );
  }
);

export default LoginDialogue;
