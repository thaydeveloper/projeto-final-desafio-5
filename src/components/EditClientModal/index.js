import { useContext, useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { IMaskInput } from "react-imask";
import { useParams } from "react-router-dom";
import CloseIcon from "../../assets/icons/close.svg";
import customerIcon from "../../assets/icons/customer.svg";
import { GlobalContext } from "../../providers/globalProvider";
import instance from "../../services/instance";
import { getItem } from "../../services/storage";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";
import "./styles.css";

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
   
});

function EditClientModal({ setShowClientModal }) {
  const {
    handleListClients,
    handleGetProfile,
    detailCustomer,
    setDetailCustomer,
    handleDetailCustomer,
  } = useContext(GlobalContext);
  let { id } = useParams();
  const [cepError, setCepError] = useState(false);
  const [formErrors, setFormErrors] = useState({
    alreadyCPF: false,
    alreadyEmail: false,
    invalidEmail: false,
    invalidCPF: false,
    emptyFieldCpf: false,
    emptyFieldPhone: false,
  });
  const token = getItem("token");

  async function handleGetCEP() {
    if (detailCustomer.cep.length < 8) return;

    const url = `https://viacep.com.br/ws/${detailCustomer.cep}/json/`;
    fetch(url).then((response) =>
      response.json().then((data) => {
        if (data.erro) {
          return setCepError(true);
        }
        setCepError(false);
        setDetailCustomer({
          ...detailCustomer,
          bairro: data.bairro,
          cidade: data.localidade,
          uf: data.uf,
        });
      })
    );
    if (detailCustomer.cep.length < 8) {
      setCepError(false);
      setDetailCustomer({
        ...detailCustomer,
        bairro: "",
        cidade: "",
        uf: "",
      });
    }
  }

  const {
    register,
    handleSubmit: hadleOnSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  function onlyNumber(value) {
    if(value === null) return
    return value.replace(/\D/g, "");
  }

  async function handleAddClient(data) {
    
    setFormErrors({
      alreadyCPF: false,
      alreadyEmail: false,
      invalidEmail: false,
      invalidCPF: false,
      emptyFields: false,
    });

    if(!data.cpf){
      setFormErrors({...formErrors,emptyFieldCpf: true});
      return
    }
    if(!data.tel){
      setFormErrors({...formErrors,emptyFieldPhone: true});
      return

    }

    try {
      await instance.put(
        `/cliente/${id}`,
        {
          nome: data.nome,
          email: data.email,
          cpf: onlyNumber(data.cpf),
          telefone: onlyNumber(data.tel),
          cep: data.cep,
          logradouro: detailCustomer.logradouro,
          complemento: detailCustomer.complemento,
          bairro: detailCustomer.bairro,
          cidade: detailCustomer.cidade,
          estado: detailCustomer.uf,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      handleListClients(token);
      setShowClientModal(false);
    } catch (error) {
      const message = error.response.data.mensagem;
      console.log(error);
      if (
        message === "Os campos nome, email, CPF e telefone são obrigatórios."
      ) {
        setFormErrors({
          emptyFields: true,
          alreadyCPF: false,
          alreadyEmail: false,
          invalidEmail: false,
          invalidCPF: false,
        });
      }if (message === "O cpf precisa ter 11 caracteres") {
        setFormErrors({
          invalidEmail: true,
          alreadyEmail: false,
          alreadyCPF: false,
          emptyFields: false,
          invalidCPF: true,
        });
      }else if (
        message === "Já existe outro cliente cadastrado com esse CPF"
      ) {
        setFormErrors({
          alreadyCPF: true,
          emptyFields: false,
          alreadyEmail: false,
          invalidEmail: false,
          invalidCPF: false,
        });
      } else if (message === "E-mail já cadastrado") {
        setFormErrors({
          alreadyEmail: true,
          alreadyCPF: false,
          emptyFields: false,
          invalidEmail: false,
          invalidCPF: false,
        });
      } else if (message === "O campo email precisa ter um formato válido.") {
        setFormErrors({
          invalidEmail: true,
          alreadyEmail: false,
          alreadyCPF: false,
          emptyFields: false,
          invalidCPF: false,
        });
      } else {
        setFormErrors({
          invalidCPF: false,
          invalidEmail: false,
          alreadyEmail: false,
          alreadyCPF: false,
          emptyFields: false,
        });
      }
    }
  }

  useEffect(() => {
    handleGetProfile(token);
    handleDetailCustomer(token, id);
    document.title = "Editar cliente";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container-modal">
      <div className="modal" style={{ width: "570px" }}>
        <div className="addChargeTitles">
          <div style={{ display: "flex" }}>
            <img
              src={customerIcon}
              alt="Add charge icon"
              style={{ marginRight: "16px" }}
            />
            <h1 className="size24 colorDarkGray">Editar cliente</h1>
          </div>
          <img
            src={CloseIcon}
            alt="close"
            onClick={() => setShowClientModal(false)}
            style={{ cursor: "pointer" }}
          />
        </div>

        <form className="form-modal" onSubmit={hadleOnSubmit(handleAddClient)}>
          <div className="inputAndLabel">
            <label className="nunito size14" htmlFor="name">
              Nome*
            </label>

            <input
              className={errors?.nome ? "error input " : "input"}

              {...register('nome')}
              id="name"
              type="text"
              placeholder="Digite o nome"
              value={detailCustomer.nome}
              onChange={(e) =>
                setDetailCustomer({ ...detailCustomer, nome: e.target.value })
              }
            />
            {errors?.nome && (
              <span className="messageErro size16">
                {errors?.nome.message}
              </span>
            )}
          </div>
          <div className="inputAndLabel">
            <label className="nunito size14" htmlFor="email">
              Email*
            </label>
            <input
              className={errors?.email || formErrors.alreadyEmail
                  ? "error input"
                  : "input"}
              {...register('email')}
              id="email"
              type="text"
              placeholder="Digite o email"
              value={detailCustomer.email}
              onChange={(e) =>
                setDetailCustomer({ ...detailCustomer, email: e.target.value })
              }
            />
            {formErrors.alreadyEmail && 
              <span className="invalidSpan nunito">Email já cadastrado</span>
            }
            {errors?.email && (
              <span className="messageErro size16">
                {errors?.email?.message}
              </span>
            )}
            {formErrors.alreadyEmail && (
              <span className="messageErro size16">Email ja cadastrado</span>
            )}
          </div>

          <div
            className="inputAndLabel"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <div>
              <label className="nunito size14" htmlFor="cpf">
                CPF*
              </label>
              { <Controller
                control={control}
                name="cpf"
                render={({ field }) => (
                  <IMaskInput
                    className={formErrors.invalidCPF||formErrors.alreadyCPF||formErrors.emptyFieldCpf
        
                        ? "error input"
                        : "input"
                    }
                    {...field}
                    id="cpf"
                    mask="000.000.000-00"
                    placeholder="Digite o CPF"
                  />
                )}
              />}
              
              {formErrors.invalidCPF ? (
                <span className="messageErro size16">CPF inválido</span>
              ) : formErrors.alreadyCPF ? (
                <span className="messageErro size16">CPF já cadastrado</span>
              ) : formErrors.emptyFieldCpf ? (
                <span className="messageErro size16">
                  Campo Obrigatório
                </span>
              ) : (
                ""
              )}
            </div>
            <div>
              <label className="nunito size14" htmlFor="phone">
                Telefone*
              </label>
              <Controller
                control={control}
                name="tel"
                render={({ field }) => (
                  <IMaskInput
                    className={formErrors.emptyFieldPhone ? "error input" : "input"}
                    {...field}
                    id="phone"
                    mask="(00)00000-0000"
                    placeholder="Digite o numero"
                  />
                )}
              />
              
              {formErrors.emptyFieldPhone && (
                <span className="messageErro size16">
                  Campo Obrigatório
                </span>
              )}
            </div>
          </div>
          <div className="inputAndLabel">
            <label className="nunito size14" htmlFor="address">
              Endereço
            </label>
            <input
              className="input"
              id="address"
              type="text"
              placeholder="Digite o endereço"
              value={detailCustomer.logradouro}
              onChange={(e) =>
                setDetailCustomer({
                  ...detailCustomer,
                  logradouro: e.target.value,
                })
              }
            />
          </div>
          <div className="inputAndLabel">
            <label className="nunito size14" htmlFor="address">
              Complemento
            </label>
            <input
              className="input"
              id="address"
              type="text"
              placeholder="Digite o complemento"
              value={detailCustomer.complemento}
              onChange={(e) =>
                setDetailCustomer({
                  ...detailCustomer,
                  complemento: e.target.value,
                })
              }
            />
          </div>
          <div
            className="inputAndLabel"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <div style={{ width: "228px" }}>
              <label className="nunito size14" htmlFor="cep">
                CEP
              </label>

              <Controller
                control={control}
                name="cep"
                render={({ field }) => (
                  <IMaskInput
                    className="input"
                    {...field}
                    mask="00000000"
                    id="cep"
                    placeholder="Digite o CEP"
                    onKeyUp={(e) => handleGetCEP(e)}
                  />
                )}
              />

              {cepError && (
                <span className="invalidSpan nunito">Cep inválido</span>
              )}
            </div>
            <div style={{ width: "235px" }}>
              <label className="nunito size14" htmlFor="district">
                Bairro
              </label>
              <input
                className="input"
                id="district"
                type="text"
                placeholder="Digite o bairro"
                value={detailCustomer.bairro}
                onChange={(e) =>
                  setDetailCustomer({
                    ...detailCustomer,
                    district: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div
            className="inputAndLabel"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <div style={{ minWidth: "300px" }}>
              <label className="nunito size14" htmlFor="city">
                Cidade
              </label>
              <input
                className="input"
                id="city"
                type="text"
                placeholder="Digite a cidade"
                value={detailCustomer.cidade}
                onChange={(e) =>
                  detailCustomer({ ...detailCustomer, cidade: e.target.value })
                }
              />
            </div>
            <div style={{ maxWidth: "160px" }}>
              <label className="nunito size14" htmlFor="uf">
                UF
              </label>
              <input
                style={{ maxWidth: "160px" }}
                className="input"
                id="uf"
                type="text"
                placeholder="Digite a UF"
                value={detailCustomer.uf}
                onChange={(e) =>
                  detailCustomer({ ...detailCustomer, uf: e.target.value })
                }
              />
            </div>
          </div>
          <button type="submit" className="button">
            Aplicar
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditClientModal;
