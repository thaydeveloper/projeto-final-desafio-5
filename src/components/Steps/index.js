import './styles.css'
import registrationLineGreen from "../../assets/register/registrationLineGreen.svg";


function Steps({ imageOne, imageTwo, imageThree }) {
    return (
        <aside className="asideSteps">
            <div className="steps">
                <div className="linesAndCircles verticalAlign">
                    <img src={imageOne} alt="Registration Step 1" />
                    <img src={registrationLineGreen} alt="Registration Line Green" />
                    <img src={imageTwo} alt="Registration Step 2" />
                    <img src={registrationLineGreen} alt="Registration Line Green" />
                    <img src={imageThree} alt="Registration Step 3" />
                </div>

                <div className="verticalAlign textsSteps">
                    <div>
                        <h1 className=" colorMidGreen size18">Cadastre-se</h1>
                        <span className="spanStep size18 nunito colorGray2"> Por favor, escreva seu nome e e-mail</span>
                    </div>

                    <div>
                        <h1 className=" colorMidGreen size18">Escolha uma senha</h1>
                        <span className="spanStep size18 nunito colorGray2">Escolha uma senha segura</span>
                    </div>

                    <div>
                        <h1 className=" colorMidGreen size18">Cadastro realizado com sucesso</h1>
                        <span className="spanStep size18 nunito colorGray2">E-mail e senha cadastrados com sucesso</span>
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default Steps