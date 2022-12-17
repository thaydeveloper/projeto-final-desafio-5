import { useContext, useState } from "react";
import CloseIcon from "../../assets/icons/close.svg";
import customerIcon from "../../assets/icons/customer.svg";
import { GlobalContext } from "../../providers/globalProvider";
import instance from "../../services/instance";
import { getItem } from "../../services/storage";
import { IMaskInput } from "react-imask";
import "./styles.css";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";

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

function AddClientModal({ setShowClientModal }) {
  const { handleListClients, actionBox, setActionBox } =
    useContext(GlobalContext);
  const [cepError, setCepError] = useState(false);
  const [formErrors, setFormErrors] = useState({
    alreadyCPF: false,
    alreadyEmail: false,
    invalidEmail: false,
    invalidCPF: false,
    emptyFields: false,
  });
  const token = getItem("token");
  const [addClientForm, setAddClientForm] = useState({
    name: "",
    email: "",
    cpf: "",
    address: "",
    complement: "",
    cep: "",
    district: "",
    city: "",
    uf: "",
  });

  async function handleGetCEP(e) {
    setCepError(false);

    if (e.target.value.length < 8) {
      return;
    }

    const url = `https://viacep.com.br/ws/${e.target.value}/json/`;
    fetch(url).then((response) =>
      response.json().then((data) => {
        if (data.erro) {
          return setCepError(true);
        }
        setCepError(false);
        setAddClientForm({
          ...addClientForm,
          district: data.bairro,
          city: data.localidade,
          uf: data.uf,
        });
      })
    );

    if (e.target.value.length < 9) {
      setCepError(false);
      setAddClientForm({
        ...addClientForm,
        district: "",
        city: "",
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
    if (value === null) return;
    return value.replace(/\D/g, "");
  }

  async function handleAddClient(data) {
    console.log(data.tel);

    setFormErrors({
      alreadyCPF: false,
      alreadyEmail: false,
      invalidEmail: false,
      invalidCPF: false,
      emptyFieldCpf: false,
      emptyFieldPhone: false,
    });

    if (!data.cpf) {
      setFormErrors({ ...formErrors, emptyFieldCpf: true });
      return;
    }
    if (!data.tel) {
      setFormErrors({ ...formErrors, emptyFieldPhone: true });
      return;
    }

    try {
      await instance.post(
        "/cliente",
        {
          nome: data.nome,
          email: data.email,
          cpf: onlyNumber(data.cpf),
          telefone: onlyNumber(data.tel),
          cep: data.cep,
          logradouro: data.endereco,
          complemento: data.complemento,
          bairro: addClientForm.district,
          cidade: addClientForm.city,
          estado: addClientForm.uf,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      handleListClients(token);
      setShowClientModal(false);

      setTimeout(() => {
        setActionBox({
          ...actionBox,
          showCard: true,
          message: "Cadastro concluído com sucesso!",
        });
      }, 1000);
      setTimeout(() => {
        setActionBox({ ...actionBox, showCard: false });
      }, 3000);

      return;
    } catch (error) {
      console.log(error);
      const message = error.response.data.mensagem;
      if (
        message === "Os campos nome, email, CPF e telefone são obrigatórios."
      ) {
        setFormErrors({
          emptyFields: false,
          alreadyCPF: false,
          alreadyEmail: false,
          invalidEmail: false,
          invalidCPF: false,
        });
      } else if (
        message === "Já existe cliente cadastrado com o CPF informado."
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
      }
      if (message === "O cpf precisa ter 11 caracteres") {
        setFormErrors({
          invalidEmail: true,
          alreadyEmail: false,
          alreadyCPF: false,
          emptyFields: false,
          invalidCPF: true,
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
            <h1 className="size24 colorDarkGray">Cadastro do cliente</h1>
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
              id="name"
              type="text"
              {...register("nome")}
              placeholder="Digite o nome"
            />
            {errors?.nome && (
              <span className="messageErro size16">
                {errors?.nome?.message}
              </span>
            )}
          </div>
          <div className="inputAndLabel">
            <label className="nunito size14" htmlFor="email">
              Email*
            </label>
            <input
              {...register("email")}
              className={
                errors?.email || formErrors.alreadyEmail
                  ? "error input"
                  : "input"
              }
              id="email"
              type="text"
              placeholder="Digite o email"
            />

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
              {
                <Controller
                  control={control}
                  name="cpf"
                  render={({ field }) => (
                    <IMaskInput
                      className={
                        formErrors.invalidCPF ||
                        formErrors.alreadyCPF ||
                        formErrors.emptyFieldCpf
                          ? "error input"
                          : "input"
                      }
                      {...field}
                      id="cpf"
                      mask="000.000.000-00"
                      placeholder="Digite o CPF"
                    />
                  )}
                />
              }
              {errors?.cpf && (
                <span className="messageErro size16">
                  {errors?.cpf?.message}
                </span>
              )}

              {formErrors.invalidCPF ? (
                <span className="messageErro size16">CPF inválido</span>
              ) : formErrors.alreadyCPF ? (
                <span className="messageErro size16">CPF já cadastrado</span>
              ) : formErrors.emptyFieldCpf ? (
                <span className="messageErro size16">
                  Este campo deve ser preenchido
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
                    className={
                      formErrors.emptyFieldPhone ? "error input" : "input"
                    }
                    {...field}
                    id="phone"
                    mask="(00)00000-0000"
                    placeholder="Digite o numero"
                  />
                )}
              />
              {formErrors.emptyFieldPhone && (
                <span className="messageErro size16">Campo Obrigatório</span>
              )}
            </div>
          </div>
          <div className="inputAndLabel">
            <label className="nunito size14" htmlFor="address">
              Endereço
            </label>
            <input
              className="input"
              {...register("endereco")}
              id="address"
              type="text"
              placeholder="Digite o endereço"
            />
          </div>
          <div className="inputAndLabel">
            <label className="nunito size14" htmlFor="address">
              Complemento
            </label>
            <input
              className="input"
              {...register("complemento")}
              id="address"
              type="text"
              placeholder="Digite o complemento"
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
                    mask="00000-000"
                    id="cep"
                    placeholder="Digite o CEP"
                    onKeyUp={(e) => handleGetCEP(e)}
                  />
                )}
              />

              {cepError && <span>Cep invalido</span>}
            </div>
            <div style={{ width: "235px" }}>
              <label className="nunito size14" htmlFor="district">
                Bairro
              </label>
              <input
                className="input"
                {...register("bairro")}
                id="district"
                type="text"
                placeholder="Digite o bairro"
                value={addClientForm.district}
                onChange={(e) =>
                  setAddClientForm({
                    ...addClientForm,
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
                {...register("cidade")}
                id="city"
                type="text"
                placeholder="Digite a cidade"
                value={addClientForm.city}
                onChange={(e) =>
                  setAddClientForm({ ...addClientForm, city: e.target.value })
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
                {...register("uf")}
                id="uf"
                type="text"
                placeholder="Digite a UF"
                value={addClientForm.uf}
                onChange={(e) =>
                  setAddClientForm({ ...addClientForm, uf: e.target.value })
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

export default AddClientModal;
