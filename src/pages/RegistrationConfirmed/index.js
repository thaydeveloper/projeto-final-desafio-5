import { useEffect } from "react";
import { Link } from "react-router-dom";
import registrationConfirmedGreen from "../../assets/register/registrationConfirmedGreen.svg";
import registrationOkGreen from "../../assets/register/registrationOkGreen.svg";
import registrationStepLineGray from "../../assets/register/registrationStepLineGray.svg";
import registrationStepLineGreen from "../../assets/register/registrationStepLineGreen.svg";
import Steps from "../../components/Steps";
import "./styles.css";

function RegistrationConfirmed() {

  useEffect(() => {
    document.title = 'Cadastro confirmado'
  })

  return (
    <section className="confirmedPage fullSize">

      <Steps
        imageOne={registrationOkGreen}
        imageTwo={registrationOkGreen}
        imageThree={registrationOkGreen}
      />

      <div className="containerConfirmed centerAlign verticalAlign">
        <div className="confirmedInfos centerAlign verticalAlign">

          <img
            src={registrationConfirmedGreen}
            alt="Registration Confirmed Green"
            style={{ marginBottom: "24px" }}
          />

          <h1 className="size24 colorDarkGray">Cadastro realizado com sucesso!</h1>
        </div>

        <Link to="/login" className="button">Ir para Login</Link>

        <div className="stepsLines">

          <img src={registrationStepLineGray} alt="Registration step line gray" />
          <img src={registrationStepLineGray} alt="Registration step line gray" />
          <img src={registrationStepLineGreen} alt="Registration step line green" />

        </div>
      </div>
    </section>
  );
}

export default RegistrationConfirmed;
