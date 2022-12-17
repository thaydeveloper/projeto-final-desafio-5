import './styles.css'
import logoutIcon from '../../assets/icons/logout.svg'
import editIcon from '../../assets/icons/edit.svg'
import { clear } from '../../services/storage'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import ModalEditRegistration from '../ModalEditRegistration'
import { GlobalContext } from '../../providers/globalProvider'

function UserModal() {
    const { showEditModal, setShowEditModal } = useContext(GlobalContext)
    const navigate = useNavigate()

    function handleLogout() {
        navigate('/login')
        clear();
    }

    return (
        <>
            <div className='containerUserModal'>
                <div className='userModalBox' onClick={() => setShowEditModal(true)}>
                    <img src={editIcon} alt='Edit Icon' className='userModalIcon' />
                    <span className='userModalSpan'>Editar</span>
                </div>

                <div className='userModalBox' onClick={() => handleLogout()}>
                    <img src={logoutIcon} alt='Logout Icon' className='userModalIcon' />
                    <span className='userModalSpan'>Logout</span>
                </div>
            </div >
            {showEditModal && <ModalEditRegistration />}
        </>
    )
}
export default UserModal;
