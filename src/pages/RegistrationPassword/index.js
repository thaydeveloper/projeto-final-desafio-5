import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import registrationStepLineGray from "../../assets/register/registrationStepLineGray.svg";
import registrationStepLineGreen from "../../assets/register/registrationStepLineGreen.svg";

import registrationOkGreen from "../../assets/register/registrationOkGreen.svg";
import registrationStepGreen from "../../assets/register/registrationStepGreen.svg";
import registrationNextGreen from "../../assets/register/registrationNextGreen.svg";

import PasswordInput from "../../components/PasswordInput";
import Steps from "../../components/Steps";

import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import {object, string,ref} from 'yup'


import "./styles.css";
import instance from "../../services/instance";
import { clear, getItem } from '../../services/storage'


const schema = object({
  senha: string().required('Este campo deve ser preenchido').trim().min(6,'Minimo 6 caracteres'),
  senhaComfirmada: string().required('Este campo deve ser preenchido').trim()
     .oneOf([ref('senha'), null], 'As senhas não coincidem')
});



function RegistrationPassword() {

  const { register, handleSubmit:hadleOnSubmit,  formState: { errors } } = useForm({resolver:yupResolver(schema)});

  const navigate = useNavigate()
 
  async function handleSubmit(data) {

    try {
      const nome = getItem("nome");
      const email = getItem("email");
      const senha = data.senha;
      await instance.post("/usuario", { nome, email, senha });
      navigate("/confirmedRegister");
      clear();
    } catch (error) {

    }
  }

  useEffect(() => {
    document.title = 'Cadastrar senha'
  })
  
  return (
    <section className="passwordPage fullSize">
      <Steps
        imageOne={registrationOkGreen}
        imageTwo={registrationStepGreen}
        imageThree={registrationNextGreen}
      />

      <div className="containerForm centerAlign verticalAlign">
        <form
          className="passwordForm verticalAlign centerAlign colorDarkGray nunito"
          onSubmit={hadleOnSubmit(handleSubmit)}
        >
          <h1 className="formH1 colorDarkGray size24 weight700">
            Escolha uma senha
          </h1>

          <div
            className="inputAndLabel verticalAlign"
            style={{ marginBottom: "2rem" }}
          >
            <label className="size14 label" htmlFor="password">
              Senha*
            </label>

            <PasswordInput
              placeholder="Senha"
              id="password"
              
              {...register('senha')}
              className={
                errors?.senha ? 'error input '
                  :
                  'input'
              }    
            />
            {errors?.senha && <span className='messageErro size16'>{errors?.senha?.message}</span>}
          </div>

          <div
            className="inputAndLabel verticalAlign"
            style={{ marginBottom: "4rem" }}
          >
            <label className="size14 label" htmlFor="password">
              Repita a senha*
            </label>

            <PasswordInput
              placeholder="Senha"
              className={
                errors?.senhaComfirmada ? 'error input '
                  :
                  'input'
              }

              {...register('senhaComfirmada')}           
            />
            {errors?.senhaComfirmada && <span className='messageErro size16'>{errors?.senhaComfirmada?.message}</span>}
          </div>

          <button
            className="button"
            type="submit"
            style={{ marginBottom: "1.5rem" }}
          >
            Finalizar Cadastro
          </button>

          <span className="formSpan size16">
            Já possui uma conta? Faça seu
            
            <Link to="/login" className="link colorPink nunito">
              Login
            </Link>
          </span>
        </form>

        <div className="stepsLines">
          <img
            src={registrationStepLineGray}
            alt="Registration step line gray"
          />
          <img
            src={registrationStepLineGreen}
            alt="Registration step line green"
          />
          <img
            src={registrationStepLineGray}
            alt="Registration step line gray"
          />
        </div>
      </div>
    </section>
  );
}

export default RegistrationPassword;
