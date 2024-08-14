import React, { useState, useRef } from "react";
import axios from "axios";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { ThreeDots } from "react-loader-spinner";
import TypewriterEffect from "./components/TypewriterEffect";
import { Cursor } from "react-simple-typewriter";
import AnimatedNumbers from "react-animated-numbers";
const baseURL = "https://webhook.site/c5e33fe2-9b7b-433e-bd01-b03728c2aa6f";

function App() {
  const [loginValue, setLoginValue] = useState("");
  const [answerValue, setAnswerValue] = useState();
  const [lifePoints, setLifePoints] = useState(0);

  const [currentQuestion, setCurrentQuestion] = useState("from state");

  const [modalOpen, setModalOpen] = useState("login");
  const [loadingSpinner, setLoadingSpinner] = useState(false);

  const modalRef = useRef();
  const loginModalRef = useRef();

  const [post, setPost] = useState([""]);

  const [loaded, setLoaded] = useState(false);
  const [showCursorState, setShowCursorState] = useState(false);

  function handleContinueClick() {
    modalRef.current?.showModal();
  }

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

    loginModalRef.current?.showModal();
    setModalOpen("login");
  }, []);

  function handleSendLogin() {
    const userAgent = navigator.userAgent.toLowerCase();
    const userPerficientMail = loginValue.toLowerCase();

    let loginObjectToSendPost = {
      index: 0,
      hash: userPerficientMail + userAgent,
      perficientEmail: userPerficientMail,
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
            .post(baseURL, loginObjectToSendPost)

            .then((response) => {
              /* console.log(response.data); */ //here i should receive the current id of the user and the content of the text

              setModalOpen("main");
              setLifePoints(2000);
              setPost([...post, response.data]);
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
  function handleSendAnswer() {
    const userAgent = navigator.userAgent.toLowerCase();
    const userPerficientMail = loginValue.toLowerCase();
    let answerObjectToPost = {
      id: 1,
      answer: answerValue,
      perficientEmail: userPerficientMail,
      hash: userPerficientMail + userAgent,
    };
    setModalOpen("answer");
    const fetchAnswerData = async () => {
      setLoadingSpinner(true);
      axios.post(baseURL, answerObjectToPost).then((response) => {
        console.log(response.status, response.data);
        if (response.status == 200) {
          /* setLoadingSpinner(false); */
          //si devuelve 400 sigue el modal, salga un texto rojo que diga que esta mal
          modalRef.current?.close();

          setPost([
            ...post,
            "Look, I was gonna go easy on you not to hurt your feelingsBut I'm only going to get this one chance(Six minutes, six minutes)Something's wrong, I can feel itJust a feeling I've gotLike something's about to happenBut I don't know whatIf that means, what I think it means, we're in troubleBig trouble. And if he is as bananas as you sayI'm not taking any chancesYou were just what the doctor ordered I'm beginning to feel like a Rap God, Rap GodAll my people from the front to the back nod, back nodNow who thinks their arms are long enough to slap box, slap box?They said I rap like a robot, so call me rap-botBut for me to rap like a computer must be in my genesI got a laptop in my back pocketMy pen'll go off when I half-cock itGot a fat knot from that rap profitMade a living and a killing off itEver since Bill Clinton was still in officeWith Monica Lewinski feeling on his nutsackI'm an MC still as honestBut as rude and as indecent as all hellSyllables, skill-a-holic (Kill 'em all with)This flippity, dippity-hippity hip-hopYou don't really wanna get into a pissing matchWith this rappity-rapPacking a mack in the back of the Acbackpack rap, crap, yap-yap, yackety-yackand at the exact same timeI attempt these lyrical acrobat stunts while I'm practicing thatI'll still be able to break a motherfuckin' tableOver the back of a couple of faggots and crack it in halfOnly realized it was ironicI was signed to Aftermath after the factHow could I not blow? All I do is drop  bombsFeel my wrath of attackRappers are having a rough time periodHere's a Maxi-Pad It's actually disastrously bad For the wack while I'm masterfully constructing this masterpiece yeah",
          ]);
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
      bg-slate-500"
      >
        <p className="">
          Life points:☕
          {lifePoints}
        </p>
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
        className="p-24 border bg-[#121212] rounded-2xl backdrop:bg-black/50"
      >
        {modalOpen == "answer" && (
          <SnackbarProvider
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          />
        )}
        <h1 className="text-[#b3b3b3] text-center text-xl">
          {/* esto me lo manda gustavo: */}
          {currentQuestion}
        </h1>

        <div className="grid ">
          <input
            placeholder="Enter your answer"
            className="flex m-auto mt-4 rounded-md p-1.5 w-64  "
            type="text"
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
        <button
          id="closeModal"
          onClick={() => {
            modalRef.current?.close();
            setModalOpen(main);
          }}
          className="bg-[#b3b3b3] p-3 m-4 rounded hover:bg-[#535353]"
        >
          Close modal
        </button>
        <button
          id="sendAnswer"
          onClick={() => handleSendAnswer()}
          className="bg-[#b3b3b3] p-3 m-4 rounded hover:bg-[#535353]"
        >
          Send Answer
        </button>
      </dialog>

      {/* Login modal */}

      <dialog
        id="loginModal"
        ref={loginModalRef}
        className="z-10 p-24 border bg-[#121212] rounded-2xl backdrop:bg-black/50 "
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
        className="absolute  min-h-screen w-2/4 bg-[#121212] p-6 text-center transform -translate-x-1/2  border  left-1/2 border-slate-400 top-32 pb-24 px-16"
      >
        <div id="" className="p-4">
          <p>Capitulo 1</p>
        </div>
        {loaded &&
          post.map((element) => {
            return (
              <>
                <TypewriterEffect
                  handleContinueClick={handleContinueClick}
                  words={element}
                  isFast={true}
                  key={element}
                />
              </>
            );
          })}
        {showCursorState && (
          <p className="text-left">
            <Cursor />
          </p>
        )}

        {showCursorState && (
          <a className="cursor-pointer" onClick={handleContinueClick}>
            Click here to continue
          </a>
        )}
      </div>
    </>
  );
}

export default App;
