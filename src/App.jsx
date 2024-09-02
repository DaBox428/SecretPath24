import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { ThreeDots } from "react-loader-spinner";
import TypewriterEffect from "./components/TypewriterEffect";
import { Cursor } from "react-simple-typewriter";
import { AnimatedCounter } from "react-animated-counter";

const baseURL = "http://localhost:27017";

function App() {
  const [loginValue, setLoginValue] = useState("");
  const [answerValue, setAnswerValue] = useState("");
  const [lifePoints, setLifePoints] = useState(0);

  const [isTyping, setIsTyping] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState("from state");

  const [modalOpen, setModalOpen] = useState("login");
  const [loadingSpinner, setLoadingSpinner] = useState(false);

  const modalRef = useRef();
  const loginModalRef = useRef();

  const [textContent, setTextContent] = useState([]);

  const [loaded, setLoaded] = useState(false);
  const [showCursorState, setShowCursorState] = useState(false);

  function handleContinueClick() {
    modalRef.current?.showModal();
  }
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    //ingresamos con direccion de correo
    //hash con agente y direccion de correo del usuairo
    //verificar que es perficient.com y hacer undescore

    //string fijo que corresponde a la persona
    //envio el string a backend, con direccion de correo y hash, y una variable
    //
    /*  {
      "index": 2, //ping pong, cuando mande la respuesta te devielvo esto,
      "content":"bla bla bla parrafo de la historia",
      "final_question": "insert your answer:" Titulo del modal, parrafo
  } */

    if (modalOpen == "login") {
      setLifePoints(0);
    }

    loginModalRef.current?.showModal();
    setModalOpen("login");
  }, []);

  // POST LOGIN
  function handleSendLogin() {
    const userAgent = navigator.userAgent.toLowerCase();
    const userPerficientMail = loginValue.toLowerCase();

    let loginObjectToSendPost = {
      index: 0,
      hash: userPerficientMail.trim() + userAgent.trim(),
      perficientEmail: userPerficientMail.trim(),
    };

    if (!userPerficientMail.includes("@perficient.com")) {
      enqueueSnackbar("Please enter a valid perficient email", {
        variant: "error",
      });
    } else {
      const fetchingLoginData = () => {
        try {
          setLoadingSpinner(true);
          axios
            .post("http://localhost:27017/login", loginObjectToSendPost)

            .then((response) => {
              setModalOpen("main");
              setLifePoints(2000);
              response.data.story.forEach((element) => {
                setTextContent((prevText) => [...prevText, element]);
              });

              setCurrentQuestion(response.data.currentQuestion);
              setShowCursorState(true);
              setLoadingSpinner(false);
              setLoaded(true);

              loginModalRef.current?.close();
            });
        } catch {}
      };

      fetchingLoginData();
    }
  }

  //POST ANSWER
  function handleSendAnswer() {
    const userAgent = navigator.userAgent.toLowerCase();
    const userPerficientMail = loginValue.toLowerCase();

    let answerObjectToPost = {
      id: 1,

      perficientEmail: userPerficientMail,
      hash: userPerficientMail.trim() + userAgent.trim(),
      answer: answerValue.toLowerCase().trim(),
    };
    setModalOpen("answer");
    const fetchAnswerData = async () => {
      setLoadingSpinner(true);
      axios.post(baseURL + "/answer", answerObjectToPost).then((response) => {
        if (response.status == 200) {
          /* setLoadingSpinner(false); */
          //si devuelve 400 sigue el modal, salga un texto rojo que diga que esta mal
          modalRef.current?.close();

          setTextContent((oldArray) => [...oldArray, response.data.newText]);
          setCurrentQuestion(response.data.newQuestion);
          setAnswerValue("");
          setLoadingSpinner(false);
        } else {
          setLoadingSpinner(false);
          enqueueSnackbar("Thats not the right answer", {
            variant: "error",
          });

          setLifePoints((currentLifepoints) => currentLifepoints - 10);
        }
      });
    };

    fetchAnswerData();
  }
  return (
    <>
      <div
        className="text-slate-300 fixed m-24 p-5 z-20 right-5 rounded-3xl px-8
      bg-slate-500 "
      >
        <div className="">
          Life ❤️ points:
          <AnimatedCounter
            value={lifePoints.toFixed(0)}
            color="white"
            fontSize="40px"
            decimalPrecision={0}
          />
        </div>
      </div>
      {modalOpen == "main" && (
        <SnackbarProvider
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        />
      )}
      <dialog
        id="answerModal"
        ref={modalRef}
        className="p-24 border bg-[#121212] rounded-2xl max-w-xl"
      >
        {modalOpen == "answer" && (
          <SnackbarProvider
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          />
        )}
        <h1
          className="text-[#b3b3b3] text-center text-2xl   justify-center flex-wrap"
          dangerouslySetInnerHTML={{ __html: currentQuestion }}
        ></h1>

        <div className="grid ">
          <input
            placeholder="Enter your answer"
            className="flex m-auto mt-4 rounded-md p-1.5 w-64  "
            type="text"
            maxLength={25}
            style={{ textTransform: "uppercase" }}
            value={answerValue}
            onChange={(e) => {
              setAnswerValue(e.target.value);
            }}
          />
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
        </div>
        <br />
        <div className=" flex  justify-center ">
          <a
            id="closeModal"
            onClick={() => {
              modalRef.current?.close();
              setModalOpen("main");
            }}
            className=" m-auto cursor-pointer"
          >
            Close modal
          </a>
          <button
            id="sendAnswer"
            onClick={() => handleSendAnswer()}
            className="bg-[#b3b3b3] p-3 m-4 rounded hover:bg-[#535353]"
          >
            Send Answer
          </button>
        </div>
      </dialog>

      {/* Login modal */}

      <dialog
        id="loginModal"
        ref={loginModalRef}
        className="z-10 p-24 border bg-[#121212] rounded-2xl "
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
        <h1 className="text-[#b3b3b3] text-center text-xl">Login:</h1>
        <input
          placeholder="Enter your perficient email... "
          className="flex m-auto mt-4 rounded-md p-1.5 w-64  "
          type="text"
          value={loginValue}
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
            onClick={() => handleSendLogin()}
            className="bg-[#b3b3b3] p-3 rounded hover:bg-[#535353]"
          >
            Login
          </button>
        </div>
      </dialog>

      <div
        id="page"
        className="absolute  min-h-screen w-2/4 bg-[#121212] p-6 text-center transform -translate-x-1/2  border  left-1/2 border-slate-400 top-4 pb-24 px-16 "
      >
        {/*  <div id="" className="p-4">
          <p>Capitulo 1</p>
        </div> */}
        {loaded &&
          textContent.map((element, index) => {
            if (textContent.length > index + 1) {
              return (
                <div
                  key={element}
                  dangerouslySetInnerHTML={{ __html: element }}
                  className="text-left"
                ></div>
              );
            } else {
              return (
                <div key={element}>
                  <TypewriterEffect
                    handleContinueClick={handleContinueClick}
                    words={element}
                    isFast={true}
                    key={element}
                    setIsTyping={setIsTyping}
                    isTyping={isTyping}
                  />
                </div>
              );
            }
          })}
        {showCursorState && (
          <p className="text-left">
            <Cursor />
          </p>
        )}

        {showCursorState && (
          <a
            id="continueButton"
            ref={messagesEndRef}
            className="cursor-pointer"
            onClick={handleContinueClick}
          >
            Click here to continue
          </a>
        )}
      </div>
    </>
  );
}

export default App;
