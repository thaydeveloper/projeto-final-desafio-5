import { useContext, useEffect, useState } from "react";
import blankDocumentPink from "../../assets/icons/blankDocumentPink.svg";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import { GlobalContext } from "../../providers/globalProvider";
import { getItem, removeItem } from "../../services/storage";
import "./styles.css";
import searchIcon from "../../assets/icons/search.svg";
import blankIcon from "../../assets/icons/blankDocument.svg";
import filterIcon from "../../assets/icons/filter.svg";
import orderIcon from "../../assets/icons/order.svg";
import editIcon from "../../assets/icons/edit.svg";
import trashIcon from "../../assets/icons/redTrash.svg";
import DeleteCard from "../../components/DeleteCard";
import ActionBox from "../../components/ActionBox";
import EditChargeModal from "../../components/EditChargeModal";
import DetailChargeModal from "../../components/DetailChargeModal";
import instance from "../../services/instance";
import NotFoundSearch from "../../components/NotFoundSearch";

function Charges() {
  const token = getItem("token");
  const {
    handleGetProfile,
    handleListCharges,
    listCharges,
    deleteInfos,
    setDeleteInfos,
    actionBox,
    setCharge,
    charge,
    detailInfos,
    haldeShowDetailModal,
    setListCharges,
    handleFormatCharges,
    handleSort
  } =
    useContext(GlobalContext);
  const [searchValue, setSearchValue] = useState("");

  async function handleFilterCharges(key) {
    const filter = getItem('filter')

    if (filter) {
      setListCharges([])
      const { data: charges } = await instance.get("/cobranca", {
        headers: { Authorization: `Bearer ${key}` },
      });

      const formatedCharges = charges.map((charge) => {
        return handleFormatCharges(charge)
      })

      const filtredCharges = formatedCharges.filter((charge) => {
        return charge.status === filter
      })

      removeItem('filter')
      return setListCharges(filtredCharges)

    } else {
      return handleListCharges(token);
    }
  }



  async function handleSearchCharges(key) {
    // handleListCharges(token)
    let filterCharges = []


    const { data: charges } = await instance.get("/cobranca", {
      headers: { Authorization: `Bearer ${key}` },
    });

    const formatedCharges = charges.map((charge) => {
      return handleFormatCharges(charge)
    })


    if (Number(searchValue)) {
      filterCharges = formatedCharges.filter((charge) => {
        return charge.id === Number(searchValue)
      })

    } else {
      const inputValue = searchValue.toLowerCase()

      filterCharges = formatedCharges.filter((charge) => {
        return charge.name.toLowerCase().includes(inputValue)
      })
    }

    if (!searchValue) {
      return handleFilterCharges(token)
    }
    return setListCharges(filterCharges)

  }

  useEffect(() => {
    document.title = "Página de cobranças";
    handleGetProfile(token);
    handleFilterCharges(token)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="chargesPage colorDarkGray">
      <Menu chargePageIcon={blankDocumentPink} />
      <section className="pageAndHeader">
        <Header title="Cobranças" classNameTitle="colorMidGreen weight400" />
        <section className="chargesMain">
          <div className=" clientsActions">
            <div className="actionsTitles">
              <img className="actionsIcon" src={blankIcon} alt="Action icon" />
              <h1 className="weight600 size26">Cobranças</h1>
            </div>

            <div
              className="actionsTypes"
              style={{ width: "unset", gap: "16px" }}
            >
              <img
                className="actionsIcon filterActionIcon"
                src={filterIcon}
                alt="Filter icon"
              />
              <div className="inputAction">
                <input
                  placeholder="Pesquisa"
                  type="text"
                  className="resetedActionInput"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyUp={() => handleSearchCharges(token)}
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
            <div className="chargeTableHeader">
              <div className="orderTable">
                <img className="orderIcon" src={orderIcon} alt="Order Icon" onClick={() => handleSort(listCharges, setListCharges, 'name')} />
                <h1 className="chargeTableTitle nunito size16 weight700">
                  Cliente
                </h1>
              </div>
              <div className="orderTable">
                <img className="orderIcon" src={orderIcon} alt="Order Icon" onClick={() => handleSort(listCharges, setListCharges, 'id')} />
                <h1 className="chargeTableTitle nunito size16 weight700">
                  ID Cob.
                </h1>
              </div>
              <h1 className="chargeTableTitle nunito size16 weight700">
                Valor
              </h1>
              <div className="orderTable">
                <img className="orderIcon" src={orderIcon} alt="Order Icon" onClick={() => handleSort(listCharges, setListCharges, 'date')} />
                <h1 className="chargeTableTitle nunito size16 weight700">
                  Data de venc.
                </h1>
              </div>
              <div className="orderTable">
                <img className="orderIcon" src={orderIcon} alt="Order Icon" onClick={() => handleSort(listCharges, setListCharges, 'status')} />
                <h1 className="chargeTableTitle nunito size16 weight700">
                  Status
                </h1>
              </div>
              <h1 className="chargeTableTitle nunito size16 weight700">
                Descrição
              </h1>
              <div className="chargeTableTitle"> </div>
            </div>


            {listCharges.length ?

              <>
                {listCharges.map((element) => {
                  return (
                    <div className="chargeRow" key={element.id} >

                      <h1 className="chargeItem nunito size16 weight400" onClick={() => haldeShowDetailModal(element)}>{element.name}</h1>

                      <h1 className="chargeItem nunito size16 weight400" onClick={() => haldeShowDetailModal(element)}>{element.id}</h1>

                      <h1 className="chargeItem nunito size16 weight400" onClick={() => haldeShowDetailModal(element)}>
                        {(element.value / 100).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
                      </h1>

                      <h1 className="chargeItem nunito size16 weight400" onClick={() => haldeShowDetailModal(element)}>{element.expirationDate}</h1>

                      <div className=" chargeItem" onClick={() => haldeShowDetailModal(element)}>

                        <h1 className={` statusCharge nunito size16 weight700 ${element.status === "pendente"

                          ? "pendingStatus"
                          : element.status === "paga"
                            ? "upToDateStatus"
                            : "overdueStatus"
                          }`}
                          style={{ textTransform: "capitalize" }}
                          onClick={() => haldeShowDetailModal(element)}>{element.status}</h1>

                      </div>

                      <h1 className=" chargeItem nunito size16 weight400" onClick={() => haldeShowDetailModal(element)}
                      >{element.description.length > 15 ? element.description.slice(0, 20) : element.description} </h1>

                      <div
                        className="chargeTableTitle"
                        style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center", }}>

                        <div className="chargeAction" onClick={() => setCharge({ ...element, showCard: true, error: false })}>

                          <img
                            src={editIcon}
                            alt="Edit icon"
                            className="chargeActionImage"
                          />

                          <span className="actionChargeTitle weight600"> Editar</span>
                        </div>

                        <div className="chargeAction" onClick={() => setDeleteInfos({
                          showCard: true,
                          id: element.id,
                        })}>

                          <img
                            src={trashIcon}
                            alt="Delete icon"
                            className="chargeActionImage"
                          />

                          <span className="actionChargeTitle weight600" style={{ color: "var(--color-red-error)" }}> Excluir</span>

                        </div>

                      </div>

                    </div>
                  );
                })}
              </>
              : <NotFoundSearch />}


          </section>
        </section>
      </section>
      {actionBox.showCard && <ActionBox />}
      {deleteInfos.showCard && <DeleteCard />}
      {charge.showCard && <EditChargeModal />}
      {detailInfos.showCard && <DetailChargeModal />}
    </section>
  );
}

export default Charges;
