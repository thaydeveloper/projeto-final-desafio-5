import "./styles.css";
import arrowIcon from "../../assets/icons/arrowDown.svg";
import { useContext, useEffect } from "react";
import UserModal from "../UserModal";
import { GlobalContext } from "../../providers/globalProvider";
import EditConfirmedModal from '../../components/EditConfirmedModal'

function Header({ title, classNameTitle }) {
  const { name, namePrefix, showEditConfirmed, showUserModal, setShowUserModal } = useContext(GlobalContext);

  useEffect(() => {
    setShowUserModal(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <header className="containerHeader">
      <h1 className={`${classNameTitle} resumeTitle size26`}>{title}</h1>

      <div className="userInfos">
        <h1 className="userPrefix colorMidGreen nunito">{namePrefix}</h1>
        <span className="userName nunito colorMidGreen size18">{name}</span>
        <img
          src={arrowIcon}
          className="arrowUserModal"
          alt="Arrow icon Modal"
          onClick={() => setShowUserModal(!showUserModal)}
        />
        {showUserModal && <UserModal />}
        {showEditConfirmed && <EditConfirmedModal />}

      </div>
    </header>
  );
}

export default Header;
