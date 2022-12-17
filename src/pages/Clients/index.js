import "./styles.css";

import Menu from "../../components/Menu";
import Header from "../../components/Header";
import customerIcon from "../../assets/icons/customer.svg";
import customerIconPink from "../../assets/icons/customerPink.svg";
import FilterIcon from "../../assets/icons/filter.svg";
import orderIcon from "../../assets/icons/order.svg";
import addCharge from "../../assets/icons/charge.svg";
import searchIcon from "../../assets/icons/search.svg";
import { useContext, useEffect, useState } from "react";
import AddClientModal from "../../components/AddClientModal";
import { GlobalContext } from "../../providers/globalProvider";
import { getItem, removeItem } from "../../services/storage";
import ActionBox from "../../components/ActionBox";
import AddChargeModal from "../../components/AddChargeModal";
import { useNavigate } from "react-router-dom";
import instance from "../../services/instance";

function Clients() {
  const token = getItem("token");
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [showClientModal, setShowClientModal] = useState(false);

  const {
    actionBox,
    handleListClients,
    handleListCharges,
    listClients,
    setListClients,
    addChargeInfos,
    setAddChargeInfos,
    handleGetProfile,
    handleFormatClients,
    handleSort
  } = useContext(GlobalContext);

  function handleNavigate(id) {
    navigate(`/customerDetails/${id}`);
  }


  async function handleFilterClients(key) {
    const filter = getItem('filter')

    if (filter) {
      setListClients([])

      const { data: clients } = await instance.get("/cliente", {
        headers: { Authorization: `Bearer ${key}` },
      });

      const { data: charges } = await instance.get("/cobranca", {
        headers: { Authorization: `Bearer ${key}` },
      });

      const formatedCharges = clients.map((client) => {
        return handleFormatClients(charges, client)
      })

      const filtredClients = formatedCharges.filter((client) => {
        return client.status === filter
      })

      removeItem('filter')
      return setListClients(filtredClients)

    } else {
      return handleListClients(token)
    }
  }

  useEffect(() => {
    handleGetProfile(token);
    handleListCharges(token);
    handleFilterClients(token)
    document.title = "Página de clientes";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showClientModal]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <section className="clientsPage colorDarkGray">
      <Menu clientPageIcon={customerIconPink} />

      <section className="pageAndHeader">
        <Header title="Clientes" classNameTitle="colorMidGreen weight400" />

        <section className="clientsMain">
          <div className=" clientsActions">
            <div className="actionsTitles">
              <img
                className="actionsIcon"
                src={customerIcon}
                alt="Action icon"
              />
              <h1 className="weight600 size26">Clientes</h1>
            </div>

            <div className="actionsTypes">
              <button
                className="button actionButton"
                onClick={() => setShowClientModal(true)}
              >
                + Adicionar cliente
              </button>
              <img
                className="actionsIcon filterActionIcon"
                src={FilterIcon}
                alt="Filter icon"
              />

              <div className="inputAction">
                <input
                  placeholder="Pesquisa"
                  type="text"
                  className="resetedActionInput"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <img
                  className="inputActionIcon"
                  src={searchIcon}
                  alt="Search icon"
                />
              </div>
            </div>
          </div>

          <section className="clientsTable">
            <div className="clientsTableTitles">
              <div className="clientAndOrder">
                <img className="orderIcon" src={orderIcon} alt="Order Icon"
                  onClick={() => handleSort(listClients, setListClients, 'client')}
                />
                <h1 className="clientsTableTitle">Cliente</h1>
              </div>
              <h1 className="clientsTableTitle">CPF</h1>
              <h1 className="clientsTableTitle">E-mail</h1>
              <h1 className="clientsTableTitle">Telefone</h1>
              <h1 className="clientsTableTitle">Status</h1>
              <h1 className="clientsTableTitle">Criar Cobrança</h1>
            </div>

            {listClients.map((element) => {
              return (
                <div className="chargeClient" key={element.id}>
                  <span
                    className="clientData size14 weigth400 "
                    onClick={() => handleNavigate(element.id)}
                    style={{ cursor: "pointer" }}
                  >
                    {element.client}
                  </span>

                  <span className="clientData colorGray3 size14 weigth400">
                    {element.cpf}
                  </span>
                  <span className="clientData colorGray3 size14 weigth400">
                    {element.email}
                  </span>
                  <span className="clientData colorGray3 size14 weigth400">
                    {element.phone}
                  </span>

                  <div className="clientData">
                    <span
                      className={`clientDataStatus ${element.status === "Em dia"
                        ? "upToDateStatus"
                        : "overdueStatus"
                        } nunito weight600 size14`}
                    >
                      {element.status === "pendente"
                        ? "inadimplente"
                        : element.status}
                    </span>
                  </div>

                  <div className="clientData">
                    <div
                      className="addChargeBox"
                      onClick={() =>
                        setAddChargeInfos({
                          showCard: true,
                          id: element.id,
                          name: element.client,
                        })
                      }
                    >
                      <img
                        className="addChargeIcon"
                        src={addCharge}
                        alt="Add charge Icon"
                      />
                      <span className="addChargeSpan nunito colorPink weight600 size16">
                        Cobrança
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        </section>
      </section>

      {actionBox.showCard && <ActionBox message="Cadastro concluído com sucesso" />}

      {showClientModal && <AddClientModal setShowClientModal={setShowClientModal} />}

      {addChargeInfos.showCard && <AddChargeModal />}
    </section>
  );
}

export default Clients;
