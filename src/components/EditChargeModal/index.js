import { useContext, useEffect } from "react";
import blankIcon from "../../assets/icons/blankDocument.svg";
import checkGreenCircle from "../../assets/icons/checkCircleGreen.svg";
import checkYellowCircle from '../../assets/icons/checkCircleYellow.svg'


import circleIcon from "../../assets/icons/circle.svg";
import closeIcon from "../../assets/icons/close.svg";
import { GlobalContext } from "../../providers/globalProvider";
import instance from "../../services/instance";
import { getItem } from "../../services/storage";
import "./styles.css";

function EditChargeModal() {
    const token = getItem("token");
    const { charge, setCharge, handleListCharges } = useContext(GlobalContext);

    async function handleEditCharge(e) {
        e.preventDefault();

        try {
            setCharge({ ...charge, error: false });
            await instance.put(
                `/cobranca/${charge.id}`,
                {
                    descricao: charge.description,
                    situacao: charge.status === "vencida" ? "pendente" : charge.status === 'paga' ? 'pago' : charge.status,
                    valor: Number(charge.value) * 100,
                    vencimento: charge.expirationDate,
                    cliente_id: charge.clientID,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCharge({ ...charge, showCard: false });
            handleListCharges(token);
        } catch (error) {
            setCharge({ ...charge, error: true });
            console.log(error);
        }
    }

    useEffect(() => {
        document.title = "Editar cobrança";
        setCharge({ ...charge, value: charge.value / 100, expirationDate: charge.unformatedExpirationDate.slice(0, 10) });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="container-modal colorDarkGray">
            <form
                className="modal"
                style={{ alignItems: "unset" }}
                onSubmit={handleEditCharge}
            >
                <div className="chargeModalHeader">
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <img
                            src={blankIcon}
                            alt="Blank icon"
                            style={{ marginRight: "24px" }}
                        />
                        <h1 style={{ margin: "0" }} className="size24">
                            Edição de Cobrança
                        </h1>
                    </div>
                    <img
                        src={closeIcon}
                        alt="Close icon"
                        style={{ cursor: "pointer" }}
                        onClick={() => setCharge({ ...charge, showCard: false })}
                    />
                </div>

                <div className="inputAndLabel">
                    <label className="nunito size14" htmlFor="name">
                        Nome:*
                    </label>
                    <input
                        className="input"
                        type="text"
                        placeholder="Digite o nome"
                        value={charge.name}
                    />
                </div>

                <div className="inputAndLabel">
                    <label className="nunito size14" htmlFor="name">
                        Descrição:*
                    </label>
                    <textarea
                        className={` input textarea nunito size18 ${charge.error && "invalidInput"
                            }`}
                        rows="5"
                        placeholder="Digite a descrição"
                        value={charge.description}
                        onChange={(e) =>
                            setCharge({ ...charge, description: e.target.value })
                        }
                    />
                    {charge.error && (
                        <span className="invalidSpan nunito">
                            Este campo deve ser preenchido
                        </span>
                    )}
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "16px",
                    }}
                >
                    <div className="inputAndLabel" style={{ width: "200px" }}>
                        <label className="nunito size14" htmlFor="name">
                            Vencimento:*
                        </label>
                        <input
                            style={{ width: "200px" }}
                            className={` input ${charge.error && "invalidInput"}`}
                            type="date"
                            placeholder="Data de Vencimento"
                            value={charge.expirationDate}
                            onChange={(e) =>
                                setCharge({ ...charge, expirationDate: e.target.value })
                            }
                        />
                        {charge.error && (
                            <span className="invalidSpan nunito">
                                Este campo deve ser preenchido
                            </span>
                        )}
                    </div>

                    <div className="inputAndLabel" style={{ width: "200px" }}>
                        <label className="nunito size14" htmlFor="name">
                            Valor:*
                        </label>
                        <input
                            style={{ width: "200px" }}
                            className={` input ${charge.error && "invalidInput"}`}
                            type="number"
                            placeholder="Digite o valor"
                            value={charge.value}
                            onChange={(e) => setCharge({ ...charge, value: e.target.value })}
                        />
                        {charge.error && (
                            <span className="invalidSpan nunito">
                                Este campo deve ser preenchido
                            </span>
                        )}
                    </div>
                </div>
                <div className={`chargeButtons ${charge.error && "invalidInput"}`}>
                    <div
                        className="chargeStatus"
                        onClick={() => setCharge({ ...charge, status: "pago" })}
                        style={{ marginBottom: "10px" }}
                    >
                        <img
                            src={
                                charge.status === "pago" || charge.status === "paga"
                                    ? checkGreenCircle
                                    : circleIcon
                            }
                            alt="Checked icon"
                        />
                        <span style={{ margin: "0" }} className="nunito size16 weight400">
                            Cobrança paga
                        </span>
                    </div>

                    <div
                        className="chargeStatus"
                        onClick={() => setCharge({ ...charge, status: "pendente" })}
                    >
                        <img
                            src={
                                charge.status === "pendente" || charge.status === "vencida"
                                    ? checkYellowCircle
                                    : circleIcon
                            }
                            alt="Checked icon"
                        />
                        <span style={{ margin: "0" }} className="nunito size16 weight400">
                            Cobrança Pendente
                        </span>
                    </div>
                </div>
                <div
                    className="centerAlign"
                    style={{ justifyContent: "space-between" }}
                >
                    <button
                        className="buttonType2"
                        type="button"
                        onClick={() => setCharge({ ...charge, showCard: false })}
                    >
                        Cancelar
                    </button>
                    <button className="button" type="submit">
                        Aplicar
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditChargeModal;
