import './styles.css'
import checkedCircle from '../../assets/icons/checkCircleLeaked.svg'

function EditConfirmedModal() {

    return (
        <div className='container-modal'>

            <div className='modal confirmedEditModal centerAlign'>
                <img src={checkedCircle} alt='Edit Confirmed' className='confirmedEditImage' />
                <h1 className='size24'>Cadastro Alterado com sucesso!</h1>
            </div>

        </div>
    )

}

export default EditConfirmedModal;