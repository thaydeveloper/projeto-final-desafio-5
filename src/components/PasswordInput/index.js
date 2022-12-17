import { forwardRef, useState } from "react";
import eye from "../../assets/icons/eye.svg";
import eyeClosed from "../../assets/icons/eyeClosed.svg";
import "./styles.css";

function PasswordInputComponent(props,ref) {
  const [showPassword, setShowPassword] = useState(false);

  const {className,value,...orderProps}=props
  
  return (
    <div className={`${className} input horizoltalAlign minWidth`}>
      <input
        className="passwordInput"
        type={showPassword ? "text" : "password"}   
        value={value}
        ref={ref}   
        {...orderProps}
      />

      <img
        src={showPassword ? eye : eyeClosed}
        alt="Input eye"
        onClick={() => setShowPassword(!showPassword)}
      />
    </div>
  );
}
const PasswordInput = forwardRef(PasswordInputComponent)
export default PasswordInput;
