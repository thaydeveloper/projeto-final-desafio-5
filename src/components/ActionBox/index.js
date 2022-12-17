import checkIcon from '../../assets/icons/checkCircle.svg'
import failIcon from '../../assets/icons/closeCircleRed.svg'
import closeIcon from '../../assets/icons/close.svg'
import closeIconFail from '../../assets/icons/closeRed.svg'
import './styles.css'
import { useContext } from 'react'
import { GlobalContext } from '../../providers/globalProvider'

function ActionBox() {
    const { actionBox, setActionBox } = useContext(GlobalContext)
    return (
        <div className='actionBox' style={{ backgroundColor: actionBox.type === 'warning' ? 'var(--color-error-background)' : '' }}>
            <img className='actionBoxImage' src={actionBox.type === 'warning' ? failIcon : checkIcon} alt='Check icon' />
            <span className='actionBoxSpan size16 nunito weight400' style={{ color: actionBox.type === 'warning' ? 'var(--color-red-error)' : '' }}>{actionBox.message}</span>
            <img className='actionBoxImageClose' src={actionBox.type === 'warning' ? closeIconFail : closeIcon} alt='Check icon' onClick={() => setActionBox({
                showCard: false,
                message: '',
                type: '',
            })} />
        </div>
    )
}

export default ActionBox;