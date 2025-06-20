

import Logo from "../../../../assets/images/logos/logo.png";
import { Link } from "react-router";
const FullLogo = () => {
  return (
    <Link to={"/"}>
      <img src={Logo} alt="logo" className="block h-30 center h-[50px] w-[50px" />
    </Link>
  );
};

export default FullLogo;
