import { useContext, useEffect, useState } from "react";
import homeIconPink from "../../assets/icons/homePink.svg";
import overdueImage from "../../assets/icons/main/overdue.svg";
import paidImage from "../../assets/icons/main/paid.svg";
import pendingImage from "../../assets/icons/main/pending.svg";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import customerPaidIcon from "../../assets/icons/main/customerPaid.svg"
import customerOverdueIcon from "../../assets/icons/main/customerOverdue.svg"

import { GlobalContext } from "../../providers/globalProvider";
import { getItem, setItem } from "../../services/storage";
import "./styles.css";
import instance from "../../services/instance";
import { Link } from "react-router-dom";

function Home() {
  const {
    handleGetProfile,
    handleFormatCharges,
    handleFormatClients,
    handleSomeValues,
    handleList,
    handleFormatCPF,
    handleVerifyError
  } = useContext(GlobalContext);
  const token = getItem("token");

  const [upToDateCharges, setUpToDateCharges] = useState([])
  const [pendingCharges, setPendingCharges] = useState([])
  const [overdueCharges, setOverdueCharges] = useState([])
  const [defaulterClients, setDefaulterClients] = useState([])
  const [upToDateClients, setUpToDateClients] = useState([])

  const [mainInfos, setMainInfos] = useState({
    upToDate: 0,
    upToDateValue: 0,

    pending: 0,
    pendingValue: 0,

    overdue: 0,
    overdueValue: 0
  })
  async function handleListMain(key) {
    let defaulterClients = []
    let upToDateClients = []

    try {
      const { data: charges } = await instance.get("/cobranca", {
        headers: { Authorization: `Bearer ${key}` },
      });

      const { data: clients } = await instance.get("/cliente", {
        headers: { Authorization: `Bearer ${key}` },
      });

      const formatedClients = clients.map((client) => {
        return handleFormatClients(charges, client)
      })

      const formatedCharges = charges.map((charge) => {
        return handleFormatCharges(charge)
      })

      defaulterClients = handleList(formatedClients, 'inadimplente')

      defaulterClients = handleFormatCPF(defaulterClients)

      upToDateClients = handleList(formatedClients, 'Em dia')

      upToDateClients = handleFormatCPF(upToDateClients)

      const upToDateCharges = handleList(formatedCharges, 'paga')

      const upToDateValue = handleSomeValues(upToDateCharges)

      const pendingCharges = handleList(formatedCharges, 'pendente')

      const pendingValue = handleSomeValues(pendingCharges)

      const overdueCharges = handleList(formatedCharges, 'vencida')

      const overdueValue = handleSomeValues(overdueCharges)

      setUpToDateCharges(upToDateCharges.slice(0, 4))
      setPendingCharges(pendingCharges.slice(0, 4))
      setOverdueCharges(overdueCharges.slice(0, 4))
      setDefaulterClients(defaulterClients.slice(0, 4))
      setUpToDateClients(upToDateClients.slice(0, 4))

      setMainInfos({
        upToDate: upToDateCharges.length,
        upToDateValue: upToDateValue,

        pending: pendingCharges.length,
        pendingValue: pendingValue,

        overdue: overdueCharges.length,
        overdueValue: overdueValue,

        upToDateClients: upToDateClients.length,
        defaulterClients: defaulterClients.length
      })

    } catch (error) {
      return handleVerifyError(error)
    }
  }

  useEffect(() => {
    handleListMain(token)
    handleGetProfile(token);
    document.title = "Página Home";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="dashboardPage colorDarkGray">
      <Menu homePageIcon={homeIconPink} />

      <section className="pageAndHeader">
        <Header title={"Resumo de cobranças"} />

        <section className="dashboardMain">
          <div className="chargesTypes">
            <div className="summaryChargeCard  horizoltalAlign centerAlign">
              <img
                className="chargeIcon"
                src={overdueImage}
                alt="Overdue Charge"
              />

              <div className="chargeInfos centerAlign verticalAlign">
                <h2 className=" weight700 size18 ">Cobranças Vencidas</h2>
                <h3 className=" weight700 size24 ">{(mainInfos.overdueValue / 100).toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL",
                })}</h3>
              </div>
            </div>

            <div className="summaryChargeCard horizoltalAlign centerAlign">
              <img
                className="chargeIcon"
                src={pendingImage}
                alt="Pending Charge"
              />

              <div className="chargeInfos centerAlign verticalAlign">
                <h2 className=" weight700 size18 ">Cobranças Previstas</h2>
                <h3 className=" weight700 size24 ">{(mainInfos.pendingValue / 100).toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL",
                })}</h3>
              </div>
            </div>

            <div className="summaryChargeCard horizoltalAlign centerAlign">
              <img className="chargeIcon" src={paidImage} alt="Paid Charge" />

              <div className="chargeInfos centerAlign verticalAlign">
                <h2 className=" weight700 size18 ">Cobranças Pagas</h2>
                <h3 className=" weight700 size24 ">{(mainInfos.upToDateValue / 100).toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL",
                })}</h3>
              </div>
            </div>
          </div>

          <section className="summaryChargesContainer">
            <div className="summaryCharges">
              <div className="summaryHeader horizoltalAlign">
                <h1 className="resumeTitle  size18 weigth600"> Cobranças Vencidas</h1>

                <h2 className="amountBox overdueAmount weight800 size16">{mainInfos.overdue}</h2>
              </div>

              <div className="dataCharges">
                <div className="dataTitles">
                  <h3 className="dataTitle nunito weight700 size16">Cliente</h3>
                  <h3 className="dataTitle nunito weight700 size16">ID da cob.</h3>
                  <h3 className="dataTitle nunito weight700 size16">Valor</h3>
                </div>

                {overdueCharges.map((charge) => {
                  return (
                    <div className="charge" key={charge.id}>
                      <span className="chargeInfo size14 weigth400 ">{charge.name}</span>
                      <span className="chargeInfo size14 weigth400">{charge.id}</span>
                      <span className="chargeInfo size14 weigth400"> {(charge.value / 100).toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL",
                      })}</span>
                    </div>
                  )
                })}

                <Link to={'/charges'} onClick={() => setItem('filter', 'vencida')} className=" centerAlign chargeLink link colorPink">Ver Todos</Link>

              </div>
            </div>

            <div className="summaryCharges">
              <div className="summaryHeader horizoltalAlign">
                <h1 className="resumeTitle  size18 weigth600"> Cobranças Previstas </h1>

                <h2 className="amountBox anticipedAmount weight800 size16">{mainInfos.pending}</h2>

              </div>

              <div className="dataCharges">
                <div className="dataTitles">
                  <h3 className="dataTitle nunito weight700 size16">Cliente</h3>
                  <h3 className="dataTitle nunito weight700 size16">ID da cob. </h3>
                  <h3 className="dataTitle nunito weight700 size16">Valor</h3>
                </div>

                {pendingCharges.map((charge) => {
                  return (
                    <div className="charge" key={charge.id}>
                      <span className="chargeInfo size14 weigth400 ">{charge.name}</span>
                      <span className="chargeInfo size14 weigth400">{charge.id}</span>
                      <span className="chargeInfo size14 weigth400"> {(charge.value / 100).toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL",
                      })}</span>
                    </div>
                  )
                })}

                <Link to={'/charges'} onClick={() => setItem('filter', 'pendente')} className=" centerAlign chargeLink link colorPink">Ver Todos</Link>

              </div>
            </div>

            <div className="summaryCharges">
              <div className="summaryHeader horizoltalAlign">
                <h1 className="resumeTitle  size18 weigth600">Cobranças Pagas</h1>

                <h2 className="amountBox paidAmount weight800 size16">{mainInfos.upToDate}</h2>

              </div>

              <div className="dataCharges">
                <div className="dataTitles">
                  <h3 className="dataTitle nunito weight700 size16">Cliente</h3>
                  <h3 className="dataTitle nunito weight700 size16">ID da cob.</h3>
                  <h3 className="dataTitle nunito weight700 size16">Valor</h3>
                </div>

                {upToDateCharges.map((charge) => {
                  return (
                    <div className="charge " key={charge.id}>
                      <span className="chargeInfo size14 weigth400 ">{charge.name}</span>
                      <span className="chargeInfo size14 weigth400">{charge.id}</span>
                      <span className="chargeInfo size14 weigth400"> {(charge.value / 100).toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL",
                      })}</span>
                    </div>
                  )
                })}

                <Link to={'/charges'} onClick={() => setItem('filter', 'paga')} className=" centerAlign chargeLink link colorPink">Ver Todos</Link>

              </div>
            </div>
          </section>

          <section className="containerClientTypes">
            <div className="clientContainer">
              <div className="clientHeaderBox">
                <div className="horizoltalAlign" style={{ gap: '10px' }}>
                  <img src={customerOverdueIcon} alt='Customer paid icon' style={{ width: '24px' }} />

                  <h1 className="size18 weigth600">Clientes Inadimplentes</h1>

                </div>
                <h2 className="amountBox defaulterClientAmount"> {mainInfos.defaulterClients}</h2>
              </div>

              <div className="clientTypeHeader">
                <h1 className="clientTypeTitle nunito weight700 size16"> Cliente</h1>
                <h1 className="clientTypeTitle nunito weight700 size16"> ID do cliente </h1>
                <h1 className="clientTypeTitle nunito weight700 size16">CPF</h1>

              </div>

              <div className="defaulterCharges">

                {defaulterClients.map((client) => {
                  return (
                    <div className="charge" key={client.id}>
                      <span className="chargeInfo size14 weigth400 "> {client.client} </span>
                      <span className="chargeInfo size14 weigth400">{client.id}</span>
                      <span className="chargeInfo size14 weigth400">{client.cpf}</span>
                    </div>
                  )
                })}

                <Link to={'/clients'} onClick={() => setItem('filter', 'inadimplente')} className=" centerAlign chargeLink link colorPink">Ver Todos</Link>

              </div>
            </div>

            <div className="clientContainer">
              <div className="clientHeaderBox">
                <div className="horizoltalAlign" style={{ gap: '10px' }}>
                  <img src={customerPaidIcon} alt='Customer paid icon' style={{ width: '24px' }} />
                  <h1 className="size18 weigth600">Clientes Em dia</h1>
                </div>
                <h2 className="amountBox clientUpToDateAmount"> {mainInfos.upToDateClients}</h2>
              </div>

              <div className="clientTypeHeader">
                <h1 className="clientTypeTitle nunito weight700 size16"> Cliente</h1>
                <h1 className="clientTypeTitle nunito weight700 size16"> ID do cliente </h1>
                <h1 className="clientTypeTitle nunito weight700 size16">CPF</h1>
              </div>

              {upToDateClients.map((client) => {
                return (
                  <div className="charge" key={client.id}>
                    <span className="chargeInfo size14 weigth400 "> {client.client} </span>
                    <span className="chargeInfo size14 weigth400">{client.id}</span>
                    <span className="chargeInfo size14 weigth400">{client.cpf}</span>
                  </div>
                )
              })}

              <Link to={'/clients'} onClick={() => setItem('filter', 'Em dia')} className=" centerAlign chargeLink link colorPink">Ver Todos</Link>

            </div>
          </section>
        </section>
      </section>
    </section>
  );
}

export default Home;
