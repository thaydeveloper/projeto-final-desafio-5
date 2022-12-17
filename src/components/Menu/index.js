import './styles.css'
import homeIcon from '../../assets/icons/home.svg'
import blankIcon from '../../assets/icons/blankDocument.svg'
import customerIcon from '../../assets/icons/customer.svg'
import { useNavigate } from 'react-router-dom'


function Menu({ ...props }) {
    const navigate = useNavigate()

    function handleNavigatePages(e) {
        navigate(`/${e}`)
    }
    return (
        <aside className="dashboardMenu">
            <div className="asideMenu">

                <div className={`iconMenu verticalAlign centerAlign ${props.homePageIcon ? 'selectedMenu' : ''}`} onClick={() => handleNavigatePages('home')}>
                    <img className="imageMenu" src={props.homePageIcon ? props.homePageIcon : homeIcon} alt='Home icon' />
                    <span className={`spanMenu size16 weight600 ${props.homePageIcon && 'colorPink'}`}>Home</span>
                </div>

                <div className={`iconMenu verticalAlign centerAlign ${props.clientPageIcon ? 'selectedMenu' : ''}`} onClick={() => handleNavigatePages('clients')}>
                    <img className="imageMenu" src={props.clientPageIcon ? props.clientPageIcon : customerIcon} alt='Clients icon' />
                    <span className={`spanMenu size16 weight600 ${props.clientPageIcon && 'colorPink'}`}>Clientes</span>
                </div>

                <div className={`iconMenu verticalAlign centerAlign ${props.chargePageIcon ? 'selectedMenu' : ''}`} onClick={() => handleNavigatePages('charges')}>
                    <img className='imageMenu' src={props.chargePageIcon ? props.chargePageIcon : blankIcon} alt='Charges icon' />
                    <span className={`spanMenu size16 weight600 ${props.chargePageIcon && 'colorPink'}`}>Cobranças</span>
                </div>

            </div>
        </aside>
    )
}

export default Menu;