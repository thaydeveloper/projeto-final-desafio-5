import { useContext, useEffect, useState } from 'react'
import blankIcon from '../../assets/icons/blankDocument.svg'
import checkGreenCircle from '../../assets/icons/checkCircleGreen.svg'
import checkYellowCircle from '../../assets/icons/checkCircleYellow.svg'


import circleIcon from '../../assets/icons/circle.svg'
import closeIcon from '../../assets/icons/close.svg'
import { GlobalContext } from '../../providers/globalProvider'
import instance from '../../services/instance'
import { getItem } from '../../services/storage'
import './styles.css'

function AddChargeModal() {
    const token = getItem('token')
    const { addChargeInfos, setAddChargeInfos } = useContext(GlobalContext)

    const [addChargeForm, setAddChargeForm] = useState({
        description: '',
        expirationDate: '',
        value: '',
        status: '',
        error: false
    })

    async function handleAddCharge(e) {
        e.preventDefault();

        try {
            setAddChargeInfos({ ...addChargeInfos, error: false })
            await instance.post('/cobranca', {
                descricao: addChargeForm.description,
                situacao: addChargeForm.status,
                valor: Number(addChargeForm.value) * 100,
                vencimento: addChargeForm.expirationDate,
                cliente_id: addChargeInfos.id
            }, { headers: { Authorization: `Bearer ${token}` } })
            setAddChargeInfos({ id: '', name: '', showCard: false })

        } catch (error) {
            setAddChargeForm({ ...addChargeForm, error: true })
            console.log(error)
        }
    }

    useEffect(() => {
        document.title = 'Adicionar cobrança'
    }, [])

    return (
        <div className='container-modal colorDarkGray'>
            <form className='modal' style={{ alignItems: 'unset' }} onSubmit={handleAddCharge}>
                <div className='chargeModalHeader'>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={blankIcon} alt='Blank icon' style={{ marginRight: '24px' }} />
                        <h1 style={{ margin: '0' }} className='size24'>Cadastro de cobrança</h1>
                    </div>
                    <img src={closeIcon} alt='Close icon' style={{ cursor: 'pointer' }} onClick={() => setAddChargeInfos({ ...addChargeInfos, showCard: false })} />
                </div>

                <div className='inputAndLabel'>
                    <label className="nunito size14" htmlFor="name">Nome:*</label>
                    <input
                        className='input'
                        type='text'
                        placeholder='Digite o nome'
                        value={addChargeInfos.name}
                    />
                </div>

                <div className='inputAndLabel'>
                    <label className="nunito size14" htmlFor="name">Descrição:*</label>
                    <textarea
                        className={` input textarea nunito size18 ${addChargeForm.error && 'invalidInput'}`}
                        rows="5"
                        placeholder='Digite a descrição'
                        value={addChargeForm.description}
                        onChange={(e) => setAddChargeForm({ ...addChargeForm, description: e.target.value })} />
                    {addChargeForm.error && <span className='invalidSpan nunito'>Este campo deve ser preenchido</span>}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }} >

                    <div className='inputAndLabel' style={{ width: '200px' }}>
                        <label className="nunito size14" htmlFor="name">Vencimento:*</label>
                        <input
                            style={{ width: '200px' }}
                            className={` input ${addChargeForm.error && 'invalidInput'}`}
                            type='date'
                            placeholder='Data de Vencimento'
                            value={addChargeForm.expirationDate}
                            onChange={(e) => setAddChargeForm({ ...addChargeForm, expirationDate: e.target.value })}
                        />
                        {addChargeForm.error && <span className='invalidSpan nunito'>Este campo deve ser preenchido</span>}
                    </div>

                    <div className='inputAndLabel' style={{ width: '200px' }}>
                        <label className="nunito size14" htmlFor="name">Valor:*</label>
                        <input
                            style={{ width: '200px' }}
                            className={` input ${addChargeForm.error && 'invalidInput'}`}
                            type='number'
                            placeholder='Digite o valor'
                            value={addChargeForm.value}
                            onChange={(e) => setAddChargeForm({ ...addChargeForm, value: e.target.value })}
                        />
                        {addChargeForm.error && <span className='invalidSpan nunito'>Este campo deve ser preenchido</span>}
                    </div>
                </div>
                <div className={`chargeButtons ${addChargeForm.error && 'invalidInput'}`}>

                    <div className='chargeStatus'
                        onClick={() => setAddChargeForm({ ...addChargeForm, status: 'pago' })}
                        style={{ marginBottom: '10px' }}
                    >

                        <img src={addChargeForm.status === 'pago' ? checkGreenCircle : circleIcon} alt='Checked icon' />
                        <span style={{ margin: '0' }} className='nunito size16 weight400'>Cobrança paga</span>
                    </div>

                    <div className='chargeStatus' onClick={() => setAddChargeForm({ ...addChargeForm, status: 'pendente' })}>
                        <img src={addChargeForm.status === 'pendente' ? checkYellowCircle : circleIcon} alt='Checked icon' />
                        <span style={{ margin: '0' }} className='nunito size16 weight400'>Cobrança Pendente</span>
                    </div>

                </div>
                <div className='centerAlign' style={{ justifyContent: 'space-between' }}>
                    <button className='buttonType2' type='button' onClick={() => setAddChargeInfos({ ...addChargeInfos, showCard: false })}>Cancelar</button>
                    <button className='button' type='submit'>Aplicar</button>
                </div>
            </form>
        </div>

    );
}

export default AddChargeModal;