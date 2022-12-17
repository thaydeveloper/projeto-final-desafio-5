import "./styles.css";
import CloseIcon from "../../assets/icons/close.svg";
import PasswordInput from "../PasswordInput";
import { useContext, useEffect, useState } from "react";
import instance from "../../services/instance";
import { getItem } from "../../services/storage";
import { GlobalContext } from "../../providers/globalProvider";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string, ref } from "yup";
import { IMaskInput } from "react-imask";


const schema = object({
  nome: string()
    .required("Este campo deve ser preenchido")
    .trim()
    .matches(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/, {
      message: "Somente letras",
    }),
  email: string()
    .trim()
    .required("Este campo deve ser preenchido")
    .matches(
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi,
      { message: "Formato de e-mail invalido" }
    ),
  senha: string()
    .required("Este campo deve ser preenchido")
    .trim()
    .min(6, "Minimo 6 caracteres"),
  senhaComfirmada: string()
    .required("Este campo deve ser preenchido")
    .trim()
    .oneOf([ref("senha"), null], "As senhas não coincidem"),
});

function ModalEditRegistration() {
  const {
    handleGetProfile,
    updateForm,
    setUpdateForm,
    setShowEditModal,
    setShowEditConfirmed,
    setShowUserModal,
  } = useContext(GlobalContext);

  const token = getItem("token");
  const [CPFError, setCPFError] = useState({
    invalidCPF: false,
    emptyCPF: false,
  });
  

  const { register, handleSubmit:hadleOnSubmit,control,  formState: { errors } } = useForm({resolver:yupResolver(schema)});

  function onlyNumber(value) {
    if (value === null) return
    return value.replace(/\D/g, "");
  }

  async function handleEditUser(data) {
    setCPFError({
      invalidCPF: false,
      emptyCPF: false,
    });
    
    if (!updateForm.cpf) {
        setCPFError({ ...CPFError, emptyCPF: true });
        return
        }

   
    if(updateForm.cpf.length < 11){
        setCPFError({ invalidCPF: true , emptyCPF: false });
        return
    }if(updateForm.cpf.length === 11){setCPFError({ invalidCPF: false , emptyCPF: false })}
    
    
    try {

  
      await instance.put(
        "/usuario",
        {
          nome: data.nome,
          email: data.email,
          senha: data.senha,
          cpf: updateForm.cpf,
          telefone: Number(onlyNumber(updateForm.telefone)),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      handleGetProfile(token);
      setShowEditModal(false);
      setShowUserModal(false);
      setShowEditConfirmed(true);

      setTimeout(() => {
        setShowEditConfirmed(false);
      }, 1300);

      setTimeout(() => {
        setUpdateForm({ ...updateForm, showConfirmedCard: true });
      });
    } catch (error) {
     console.log(error);
    }
  }

  useEffect(() => {
    handleGetProfile(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container-modal">
      <div className="modal">
        <img
          src={CloseIcon}
          alt="Fechar"
          className="closeBtn"
          onClick={() => setShowUserModal(false)}
        />
        <h1 className="size24 colorDarkGray" style={{ marginBottom: "32px" }}>
          Edite seu cadastro
        </h1>
        <form className="form-modal" onSubmit={hadleOnSubmit(handleEditUser)}>
          <div className="content-name-email">
            <label className="nunito size14" htmlFor="name">
              Nome*
            </label>

            <input
              className={errors?.nome ? "error input " : "input"}
              id="name"
              {...register("nome")}
              type="text"
              placeholder="Digite seu nome"
              value={updateForm.nome}
              onChange={(e) =>
                setUpdateForm({ ...updateForm, nome: e.target.value })
              }
            />
            {errors?.nome && (
              <span className="messageErro size16">
                {errors?.nome?.message}
              </span>
            )}

            <label className="nunito size14" htmlFor="email">
              E-mail*
            </label>

            <input
              className={errors?.email ? "error input " : "input"}
              type="email"
              placeholder="Digite seu e-mail"
              {...register("email")}
              value={updateForm.email}
              onChange={(e) =>
                setUpdateForm({ ...updateForm, email: e.target.value })
              }
            />
            {errors?.email && (
              <span className="messageErro size16">
                {errors?.email?.message}
              </span>
            )}
          </div>

          <div className="content-cpf-phone">
            <div className="content-cpf">
              <label className="nunito size14" htmlFor="cpf">
                CPF*
              </label>

              <IMaskInput
                mask="00000000000"
                className={
                  CPFError.emptyCPF || CPFError.invalidCPF ? "error input" : "input"
                }
                id="cpf"
                placeholder="Digite seu CPF"
                value={updateForm.cpf}
                onChange={(e) =>
                  setUpdateForm({ ...updateForm, cpf: e.target.value })
                }
                
              />
              {CPFError.emptyCPF ? (
                <span className="messageErro size16">Campo obrigatório</span>
              ) : (
                ""
              )}
              {CPFError.invalidCPF ? (
                <span className="messageErro size16">Precisa ter 11 Numeros</span>
              ) : (
                ""
              )}
            </div>
            <div className="content-phone">
              <label className="nunito size14" htmlFor="phone">
                Telefone
              </label>
              <Controller
                control={control}
                name="telefone"
                render={({ field }) => (
                  <IMaskInput
                    className={"input"}
                    {...field}
                    id="phone"
                    mask="(00)00000-0000"
                    placeholder="Digite o numero"
                    value={updateForm.telefone}
                onChange={(e) =>
                  setUpdateForm({ ...updateForm, telefone: e.target.value })
                } 
                  />
                )}
              />
              
            </div>
          </div>

          <div className="content-passwords">
            <label className="nunito size14" htmlFor="password">
              Nova Senha*
            </label>

            <PasswordInput
              id="password"
              placeholder="Senha"
              {...register("senha")}
              className={errors?.senha ? "error input " : "input"}
            />
            {errors?.senha && (
              <span className="messageErro size16">
                {errors?.senha?.message}
              </span>
            )}
            <label className="nunito size14" htmlFor="confirmedPassword">
              Confirmar Senha*
            </label>
            <PasswordInput
              id="confirmedPassword"
              placeholder="Confirme sua senha"
              className={errors?.senhaComfirmada ? "error input " : "input"}
              {...register("senhaComfirmada")}
            />
            {errors?.senhaComfirmada && (
              <span className="messageErro size16">
                {errors?.senhaComfirmada?.message}
              </span>
            )}
          </div>

          <button type="submit" className="button">
            Aplicar
          </button>
        </form>
      </div>
    </div>
  );
}

export default ModalEditRegistration;
