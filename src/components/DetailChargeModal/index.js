import { useContext } from 'react'
import { GlobalContext } from '../../providers/globalProvider'
import blankIcon from "../../assets/icons/blankDocument.svg";
import CloseIcon from "../../assets/icons/close.svg";


import './styles.css'

function DetailChargeModal() {
    const { detailInfos, setDetailInfos } = useContext(GlobalContext)

    return (
        <div className='container-modal'>
            <div className='modal' style={{ alignItems: 'unset', width: '600px' }}>

                <div className='DetailHeader'>

                    <div className='horizoltalAlign'>
                        <img
                            src={blankIcon}
                            alt="Blank icon"
                            style={{ marginRight: "24px" }}
                        />
                        <h1 className=' size24' >Detalhe da cobrança</h1>

                    </div>

                    <img
                        src={CloseIcon}
                        alt="Fechar"
                        className="closeBtnDetail"
                        onClick={() => setDetailInfos({ showCard: false })}
                    />
                </div>

                <div className='contentDetailName'>
                    <h1 className='size16 weight700 nunito ' style={{ marginBottom: '7px' }}>Nome</h1>
                    <span className='size16  weight400 detailInfo'>{detailInfos.name}</span>
                </div>

                <div className='contentDetailDescription'>
                    <h1 className='size16 weight700 nunito ' style={{ marginBottom: '7px' }}>Descrição</h1>
                    <span className='size16  weight400 detailInfo'>
                        {detailInfos.description}
                    </span>
                </div>

                <div className='expirationDateAndValueContent horizoltalAlign'>

                    <div className='contentDetailExpirationDate'>
                        <h1 className='size16 weight700 nunito' style={{ marginBottom: '7px' }}>Vencimento</h1>
                        <span className='size18  weight400 detailInfo'>{detailInfos.expirationDate}</span>
                    </div>

                    <div className='contentDetailValue'>
                        <h1 className='size16 weight700 nunito' style={{ marginBottom: '7px' }}>Valor</h1>
                        <span className='size18  weight400 detailInfo'>{(detailInfos.value / 100).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</span>
                    </div>

                </div>

                <div className='IDAndStatusContent horizoltalAlign'>

                    <div className='contentIDCharge'>
                        <h1 className='size16 weight700 nunito' style={{ marginBottom: '7px', whiteSpace: 'nowrap' }}>ID da cobrança</h1>
                        <span className='size18  weight400 detailInfo'>{detailInfos.id}</span>
                    </div>

                    <div className='contentDetailStatus'>
                        <h1 className='size16 weight700 nunito' style={{ marginBottom: '7px' }}>Status</h1>
                        <span className={`detailInfo statusCharge nunito size16 weight700 
                        ${detailInfos.status === "pendente"
                                ? "pendingStatus"
                                : detailInfos.status === "paga"
                                    ? "upToDateStatus"
                                    : "overdueStatus"
                            }`}
                            style={{ textTransform: "capitalize" }}>{detailInfos.status}</span>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default DetailChargeModal