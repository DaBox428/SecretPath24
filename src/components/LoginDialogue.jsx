import React, { forwardRef } from "react";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { ThreeDots } from "react-loader-spinner";
import { Switch } from "@mui/material";
import { US } from "country-flag-icons/react/3x2";
import { ES } from "country-flag-icons/react/3x2";
const LoginDialogue = forwardRef(
  (
    {
      handleSendLogin,
      modalOpen,
      setModalOpen,
      loginValue,
      setLoginValue,
      loadingSpinner,
      langChecked,
      setLangChecked,
      setPinValue,
      pinValue,
    },
    loginModalRef
  ) => {
    const handleChangeLanguage = () => {
      langChecked == "es" ? setLangChecked("en") : setLangChecked("es");
    };
    return (
      <dialog
        id="loginModal"
        ref={loginModalRef}
        className="z-10 p-24 border bg-[#121212] rounded-2xl backdrop:bg-black/40 backdrop:backdrop-blur-sm overflow-hidden min-w-96"
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

        <h1 className="text-[#b3b3b3] text-center text-xl m-auto min-w-48"></h1>

        <div id="inputs" className="flex flex-row pb-5">
          <input
            placeholder={
              langChecked == "es" ? "Nombre de Usuario..." : "Username..."
            }
            title={langChecked == "es" ? "Nombre de Usuario..." : "Username..."}
            className=" flex-auto m-auto mt-4 rounded-md p-1.5 lg:w-64 min-w-48 w-64"
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
          <input
            placeholder="PIN"
            className=" flex-auto m-auto mt-4 rounded-md p-1.5  w-20 ml-3"
            type="text"
            autoFocus
            value={pinValue}
            title={
              langChecked == "es"
                ? "Ingresa un PIN secreto..."
                : "Enter a secret PIN..."
            }
            maxLength={4}
            onKeyDown={(e) => {
              if (
                !/[0-9]|Backspace|Tab|Enter|Delete|ArrowLeft|ArrowRight/.test(
                  e.key
                )
              ) {
                e.preventDefault();
              }
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handleSendLogin();
              }
            }}
            onChange={(e) => {
              setPinValue(e.target.value);
            }}
          />
        </div>

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
            className="bg-[#b3b3b3] p-3 rounded hover:bg-[#535353] min-w-48"
          >
            {langChecked == "es" ? "Ingresar" : "Enter"}
          </button>
        </div>
        <div
          id="lang"
          className="pt-5 flex-row slate-200 m-auto bg-slate-500 rounded-2xl mt-5 pb-5 justify-evenly align-middle flex flex-wrap"
        >
          <div className="w-11 align-bottom flex">
            <US title="English" className="" />
          </div>
          <Switch
            checked={langChecked == "es" ? true : false}
            color="default"
            onChange={handleChangeLanguage}
            value="checkedA"
          />
          <div className="w-11 align-bottom flex">
            <ES title="Español" className="" />
          </div>
        </div>
      </dialog>
    );
  }
);

export default LoginDialogue;
