import { createContext } from "react";
import instance from "../services/instance";
import { useState } from "react";
import { format } from "date-fns";
import { clear } from "../services/storage";
import { useNavigate } from "react-router-dom";
export const GlobalContext = createContext({});

export function GlobalProvider({ children }) {
  const [name, setName] = useState("");
  const [namePrefix, setNamePrefix] = useState("");
  const [updateForm, setUpdateForm] = useState([]);
  const [listClients, setListClients] = useState([]);
  const [listCharges, setListCharges] = useState([]);
  const [filtredCharges, setFiltredCharges] = useState([]);
  const [detailCustomer, setDetailCustomer] = useState([]);
  const [detailCustomerPage, setDetailCustomerPage] = useState([]);
  const [charge, setCharge] = useState([]);
  const [showEditConfirmed, setShowEditConfirmed] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [orderASC, setOrderASC] = useState(false);
  const navigate = useNavigate();

  const [detailInfos, setDetailInfos] = useState({
    charge: {},
    showCard: false,
  });

  const [actionBox, setActionBox] = useState({
    showCard: false,
    message: "",
    type: "",
  });

  const [deleteInfos, setDeleteInfos] = useState({
    showCard: false,
    id: "",
    status: "",
  });

  const [addChargeInfos, setAddChargeInfos] = useState({
    showCard: false,
    id: "",
    name: "",
  });

  async function handleGetProfile(key) {
    try {
      const response = await instance.get("/usuario", {
        headers: { Authorization: `Bearer ${key}` },
      });
      let prefix = "";

      const localName = response.data.nome.split(" ");
      for (const letter of localName) {
        prefix += letter[0];
      }

      setNamePrefix(prefix);

      setName(response.data.nome);

      setUpdateForm({
        ...response.data,
        confirmPassword: "",
        showConfirmedCard: false,
      });
    } catch (error) {
      return handleVerifyError(error);
    }
  }

  function handleVerifyError(error) {
    const message = error.response.data.mensagem;
    if (
      message === "Token expirado!" ||
      message === "Token Inválido" ||
      (message === "Erro interno do servidor." && error.response.status === 500)
    ) {
      navigate("/login");
      return clear();
    } else {
      return console.log(error);
    }
  }

  async function handleDetailCustomer(id, key) {
    try {
      const { data } = await instance.get(`/cliente/${id}`, {
        headers: { Authorization: `Bearer ${key}` },
      });
      if (data.cep === null) {
        setDetailCustomer({ ...data });
        setDetailCustomerPage({ ...data });
      } else {
        setDetailCustomerPage({
          ...data,
          cep: data.cep.length < 8 ? `0${data.cep}` : data.cep,
        });
        setDetailCustomer({
          ...data,
          cep: data.cep.length < 8 ? `0${data.cep}` : data.cep,
        });
      }
    } catch (error) {
      return handleVerifyError(error);
    }
  }

  async function handleListClients(key) {
    try {
      const { data: clients } = await instance.get("/cliente", {
        headers: { Authorization: `Bearer ${key}` },
      });

      const { data: charges } = await instance.get("/cobranca", {
        headers: { Authorization: `Bearer ${key}` },
      });

      setListClients(
        clients.map((element) => {
          return handleFormatClients(charges, element);
        })
      );
    } catch (error) {
      return handleVerifyError(error);
    }
  }

  async function handleListCharges(key) {
    try {
      const { data: charges } = await instance.get("/cobranca", {
        headers: { Authorization: `Bearer ${key}` },
      });

      setListCharges(
        charges.map((element) => {
          return handleFormatCharges(element);
        })
      );
    } catch (error) {
      return handleVerifyError(error);
    }
  }

  async function handleListChargesWithID(key, id) {
    try {
      const { data: charges } = await instance.get("/cobranca", {
        headers: { Authorization: `Bearer ${key}` },
      });

      const formatedCharges = charges.map((charge) => {
        return handleFormatCharges(charge);
      });

      setFiltredCharges(
        formatedCharges.filter((charge) => {
          return charge.clientID === Number(id);
        })
      );
    } catch (error) {
      console.log(error);
    }
  }

  function handleFormatClients(charges, client) {
    const findCharge = charges.find((charge) => {
      return charge.cliente_id === client.id && charge.situacao === "pendente";
    });

    return {
      id: client.id,
      client: client.nome,
      cpf: client.cpf,
      email: client.email,
      phone: client.telefone,
      status: findCharge === undefined ? "Em dia" : "inadimplente",
    };
  }

  function handleFormatCharges(charge) {
    const splitDate = charge.vencimento.split("T")[0].split("-");
    const expirationTimestamp = +new Date(
      splitDate[0],
      splitDate[1] - 1,
      splitDate[2]
    );

    return {
      id: charge.id,
      name: charge.nome,
      value: charge.valor,

      status:
        expirationTimestamp <= +new Date() && charge.situacao !== "pago"
          ? "vencida"
          : charge.situacao === "pago"
          ? "paga"
          : charge.situacao,
      expirationDate: format(expirationTimestamp, "dd/MM/yyyy"),
      description: charge.descricao,
      clientID: charge.cliente_id,
      unformatedExpirationDate: charge.vencimento,
    };
  }

  function handleSomeValues(listCharges) {
    return listCharges.reduce((accumulator, charge) => {
      return accumulator + charge.value;
    }, 0);
  }

  function handleList(list, status) {
    return list.filter((charge) => {
      return charge.status === status;
    });
  }

  function handleFormatCPF(listClients) {
    return listClients.map((client) => {
      return {
        ...client,
        cpf: `${client.cpf.slice(0, 3)}.${client.cpf.slice(
          3,
          6
        )}.${client.cpf.slice(6, 9)}-${client.cpf.slice(9)}`,
      };
    });
  }

  function haldeShowDetailModal(charge) {
    setDetailInfos({
      ...charge,
      showCard: true,
    });
  }

  function handleSort(list, setList, parameter) {
    const localList = [...list];

    setOrderASC(!orderASC);

    if (parameter === "date") {
      localList.sort((a, b) => {
        if (orderASC) {
          return (
            +new Date(a.unformatedExpirationDate) -
            +new Date(b.unformatedExpirationDate)
          );
        } else {
          return (
            +new Date(b.unformatedExpirationDate) -
            +new Date(a.unformatedExpirationDate)
          );
        }
      });
    } else if (
      parameter === "name" ||
      parameter === "client" ||
      parameter === "status"
    ) {
      localList.sort((a, b) => {
        let x = a[parameter].toUpperCase();
        let y = b[parameter].toUpperCase();

        if (orderASC) {
          return x === y ? 0 : x > y ? 1 : -1;
        } else {
          return x === y ? 0 : x > y ? -1 : 1;
        }
      });
    } else {
      localList.sort((a, b) => {
        if (orderASC) {
          return a[parameter] - b[parameter];
        } else {
          return b[parameter] - a[parameter];
        }
      });
    }
    setList(localList);
  }

  return (
    <GlobalContext.Provider
      value={{
        handleGetProfile,
        handleListClients,
        handleListCharges,
        handleDetailCustomer,
        handleListChargesWithID,
        handleFormatCharges,
        haldeShowDetailModal,
        handleFormatClients,
        handleSomeValues,
        handleList,
        handleFormatCPF,
        handleSort,
        handleVerifyError,

        setAddChargeInfos,
        setListClients,
        setUpdateForm,
        setActionBox,
        setListCharges,
        setDetailCustomer,
        setFiltredCharges,
        setDeleteInfos,
        setCharge,
        setDetailInfos,
        setShowEditConfirmed,
        setShowUserModal,
        setShowEditModal,

        name,
        namePrefix,
        updateForm,
        listClients,
        actionBox,
        addChargeInfos,
        listCharges,
        detailCustomer,
        deleteInfos,
        filtredCharges,
        detailCustomerPage,
        charge,
        detailInfos,
        showEditConfirmed,
        showUserModal,
        showEditModal,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
