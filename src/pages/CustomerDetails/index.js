import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import customerIcon from "../../assets/icons/customer.svg";
import customerIconPink from "../../assets/icons/customerPink.svg";
import editIcon from "../../assets/icons/edit.svg";
import EditIcon from "../../assets/icons/editIcon.svg";
import orderIcon from "../../assets/icons/order.svg";
import trashIcon from "../../assets/icons/redTrash.svg";

import ActionBox from "../../components/ActionBox";
import AddChargeModal from "../../components/AddChargeModal";
import DeleteCard from "../../components/DeleteCard";
import DetailChargeModal from "../../components/DetailChargeModal";
import EditChargeModal from "../../components/EditChargeModal";
import EditClientModal from "../../components/EditClientModal";
import Header from "../../components/Header";
import Menu from "../../components/Menu";

import { GlobalContext } from "../../providers/globalProvider";
import { getItem } from "../../services/storage";

import "./styles.css";

function CustomerDetails() {
  const token = getItem("token");
  let { id } = useParams();

  const {
    charge,
    setCharge,
    detailCustomer,
    addChargeInfos,
    setAddChargeInfos,
    handleDetailCustomer,
    filtredCharges,
    handleListChargesWithID,
    deleteInfos,
    setDeleteInfos,
    actionBox,
    handleGetProfile,
    setFiltredCharges,
    detailCustomerPage,
    detailInfos,
    haldeShowDetailModal,
    handleSort
  } = useContext(GlobalContext);

  const [showClientModal, setShowClientModal] = useState(false);

  useEffect(() => {
    handleGetProfile(token);
    handleDetailCustomer(id, token);
    handleListChargesWithID(token, id);
    document.title = "Detalhamento do cliente";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showClientModal, addChargeInfos.showCard, deleteInfos.showCard, charge.showCard]);

  useEffect(() => {
    setCharge([])
    setFiltredCharges([]);
    handleDetailCustomer(id, token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="detailPage colorDarkGray">
      <Menu clientPageIcon={customerIconPink} />
      <section className="pageAndHeader">
        <Header
          title="Clientes > Detalhes do cliente"
          classNameTitle="colorMidGreen weight400"
        />

        <section className="detailMain">
          <div className="detailHeader horizoltalAlign">
            <img className="actionsIcon" src={customerIcon} alt="Action icon" />
            <h1 className="weight600 size26">{detailCustomerPage.nome}</h1>
          </div>
          <div className="cutomerInfos">
            <div
              className="horizoltalAlign"
              style={{ justifyContent: "space-between", marginBottom: "24px" }}
            >
              <h1 className="weight700 size18">Dados do Cliente</h1>
              <button
                className="editButton size18 weight400 colorMidGreen nunito"
                onClick={() => setShowClientModal(true)}
              >
                <img src={EditIcon} alt="Editar" /> Editar Cliente
              </button>
            </div>
            <div className="virtualCustomerData">
              <div className="contentVirtualData contentEmail">
                <h2
                  className="size18 weight700"
                  style={{ marginBottom: "10px" }}
                >
                  E-mail
                </h2>
                <span
                  className="size16 weight400 nunito"
                  style={{ margin: "0" }}

                >
                  {detailCustomerPage.email}
                </span>
              </div>
              <div className="contentVirtualData contentPhone">
                <h2
                  className="size18 weight700"
                  style={{ marginBottom: "10px" }}
                >
                  Telefone
                </h2>
                <span
                  className="size16 weight400 nunito"
                  style={{ margin: "0" }}
                >
                  {detailCustomerPage.telefone}
                </span>
              </div>
              <div className="contentVirtualData contentCPF">
                <h2
                  className="size18 weight700"
                  style={{ marginBottom: "10px" }}
                >
                  CPF
                </h2>
                <span
                  className="size16 weight400 nunito"
                  style={{ margin: "0" }}
                >
                  {detailCustomerPage.cpf}
                </span>
              </div>
            </div>
            <div className="contentCustomerData">
              <div className="customerData contentAddress">
                <h2
                  className="size18 weight700"
                  style={{ marginBottom: "10px" }}
                >
                  Endereço
                </h2>
                <span
                  className="size16 weight400 nunito"
                  style={{ margin: "0" }}
                >
                  {detailCustomerPage.logradouro}
                </span>
              </div>
              <div className="customerData contentDistrict">
                <h2
                  className="size18 weight700"
                  style={{ marginBottom: "10px" }}
                >
                  Bairro
                </h2>
                <span
                  className="size16 weight400 nunito"
                  style={{ margin: "0" }}
                >
                  {detailCustomerPage.bairro}
                </span>
              </div>
              <div className="customerData contentComplement">
                <h2
                  className="size18 weight700"
                  style={{ marginBottom: "10px" }}
                >
                  Complemento
                </h2>
                <span
                  className="size16 weight400 nunito"
                  style={{ margin: "0" }}
                >
                  {detailCustomerPage.complemento}
                </span>
              </div>
              <div className="customerData contentCEP">
                <h2
                  className="size18 weight700"
                  style={{ marginBottom: "10px" }}
                >
                  CEP
                </h2>
                <span
                  className="size16 weight400 nunito"
                  style={{ margin: "0" }}
                >
                  {detailCustomerPage.cep}
                </span>
              </div>
              <div className="customerData contentCity">
                <h2
                  className="size18 weight700"
                  style={{ marginBottom: "10px" }}
                >
                  Cidade
                </h2>
                <span
                  className="size16 weight400 nunito"
                  style={{ margin: "0" }}
                >
                  {detailCustomerPage.cidade}
                </span>
              </div>
              <div className="customerData contentUF">
                <h2
                  className="size18 weight700"
                  style={{ marginBottom: "10px" }}
                >
                  UF
                </h2>
                <span
                  className="size16 weight400 nunito"
                  style={{ margin: "0" }}
                >
                  {detailCustomerPage.estado}
                </span>
              </div>
            </div>
          </div>
          <div className="customerCharges">
            <div
              className="horizoltalAlign"
              style={{ justifyContent: "space-between", marginBottom: "24px" }}
            >
              <h1 className="weight700 size18">Cobranças do Cliente</h1>
              <button
                className="button actionButton"
                onClick={() =>
                  setAddChargeInfos({
                    showCard: true,
                    id: detailCustomer.id,
                    name: detailCustomer.nome,
                  })
                }
              >
                + Nova Cobrança
              </button>
            </div>

            <div className="chargeTableHeader">
              <div className="orderTable">
                <img className="orderIcon" src={orderIcon} alt="Order Icon" onClick={() => handleSort(filtredCharges, setFiltredCharges, 'id')} />
                <h1 className="chargeTableTitle nunito size16 weight700">
                  ID Cob.
                </h1>
              </div>
              <div className="orderTable">
                <img className="orderIcon" src={orderIcon} alt="Order Icon" onClick={() => handleSort(filtredCharges, setFiltredCharges, 'date')} />
                <h1 className="chargeTableTitle nunito size16 weight700">
                  Data de venc.
                </h1>
              </div>
              <h1 className="chargeTableTitle nunito size16 weight700">
                Valor
              </h1>
              <h1 className="chargeTableTitle nunito size16 weight700">
                Status
              </h1>
              <h1 className="chargeTableTitle nunito size16 weight700">
                Descrição
              </h1>
              <div className="chargeTableTitle"> </div>
            </div>

            {filtredCharges.map((element) => {
              return (
                <div className="chargeRow" key={element.id}>

                  <h1 className=" chargeItem nunito size16 weight400"
                    onClick={() => haldeShowDetailModal(element)} style={{ cursor: 'pointer' }}>
                    {element.id}
                  </h1>

                  <h1 className=" chargeItem nunito size16 weight400"
                    onClick={() => haldeShowDetailModal(element)}>
                    {element.expirationDate}
                  </h1>
                  <h1 className=" chargeItem nunito size16 weight400"
                    onClick={() => haldeShowDetailModal(element)}
                  >
                    {(element.value / 100).toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </h1>
                  <div className=" chargeItem"
                    onClick={() => haldeShowDetailModal(element)}
                  >
                    <h1
                      className={` statusCharge nunito size16 weight700 
                        ${element.status === "pendente"
                          ? "pendingStatus"
                          : element.status === "paga"
                            ? "upToDateStatus"
                            : "overdueStatus"
                        }`}
                      style={{ textTransform: "capitalize" }}
                    >
                      {element.status}
                    </h1>
                  </div>
                  <h1 className=" chargeItem nunito size16 weight400"
                    onClick={() => haldeShowDetailModal(element)}
                  >
                    {element.description.length > 15 ? element.description.slice(0, 20) : element.description}
                  </h1>
                  <div
                    className="chargeTableTitle"
                    style={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                    }}
                  >
                    <div className="chargeAction" onClick={() => setCharge({
                      ...element, showCard: true, error: false
                    })}>
                      <img
                        src={editIcon}
                        alt="Edit icon"
                        className="chargeActionImage"
                      />
                      <span className="actionChargeTitle weight600">
                        Editar
                      </span>
                    </div>
                    <div
                      className="chargeAction"
                      onClick={() =>
                        setDeleteInfos({
                          element,
                          showCard: true,
                          id: element.id,
                        })
                      }
                    >
                      <img
                        src={trashIcon}
                        alt="Delete icon"
                        className="chargeActionImage"
                      />
                      <span
                        className="actionChargeTitle weight600"
                        style={{ color: "var(--color-red-error)" }}
                      >
                        Excluir
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </section>

      {showClientModal && <EditClientModal setShowClientModal={setShowClientModal} />}
      {deleteInfos.showCard && <DeleteCard />}
      {actionBox.showCard && <ActionBox message="Edições do cadastro concluídas com sucesso" />}
      {charge.showCard && <EditChargeModal />}
      {addChargeInfos.showCard && <AddChargeModal />}
      {detailInfos.showCard && <DetailChargeModal />}
    </section>
  );
}

export default CustomerDetails;
