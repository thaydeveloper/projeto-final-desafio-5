import './styles.css'
import closeIcon from '../../assets/icons/close.svg'
import alertIcon from '../../assets/icons/alert.svg'
import { useContext } from 'react'
import { GlobalContext } from '../../providers/globalProvider'
import instance from '../../services/instance'
import { getItem } from '../../services/storage'

function DeleteCard() {
    const token = getItem('token')
    const { deleteInfos, setDeleteInfos, handleListCharges, setActionBox } = useContext(GlobalContext)


    function showActionBox(message, type) {
        setTimeout(() => {
            setActionBox({
                showCard: true,
                message: message,
                type: type,
            })
        }, 1000)
        setTimeout(() => {
            setActionBox({
                showCard: false,
                message: '',
                type: '',
            })
        }, 3000)
    }

    async function handleDeleteCharge(infos, key) {

        try {

            await instance.delete(`/cobranca/${infos.id}`, {
                headers: { Authorization: `Bearer ${key}` },
            })
            handleClose()
            handleListCharges(token)
            showActionBox('Cobrança excluída com sucesso!', false)
        } catch (error) {
            console.log(error)
            handleClose()
            showActionBox('Esta cobrança não pode ser excluída!', 'warning')
        }

    }

    function handleClose() {
        setDeleteInfos({
            showCard: false,
            id: '',
            status: ''
        })
    }

    return (
        <div className='container-modal colorDarkGray'>
            <div className='modal' style={{ width: '600px' }}>
                <img src={closeIcon} alt='Close icon' className='closeBtn' onClick={() => handleClose()} />
                <img src={alertIcon} alt='Close icon' className='' />
                <h1 className='size18 deleteH1'>Tem certeza que deseja excluir esta cobrança?</h1>
                <div className='deleteCardButtons centerAlign'>
                    <button className='cancelButton size18 nunito weight400' onClick={() => handleClose()}>Não</button>
                    <button className='confirmButton size18 nunito weight400' onClick={() => handleDeleteCharge(deleteInfos, token)}>Sim</button>
                </div>
            </div>
        </div>
    )
}

export default DeleteCard