import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";

import LOGO from "../../assets/logo.png";
import LOCATION_LOGO from "../../assets/location.png";
import USER_LOGO from "../../assets/user.png";
import HEART_LOGO from "../../assets/heart.png";
import UserContext from "../../store/user-context";

const Navbar = () => {
  const userCtx = useContext(UserContext);

  // Define the maximum length for the display name
  const maxLength = 20; // Adjust this value as needed

  // Function to truncate and add ellipsis
  const truncateDisplayName = (name) => {
    if (name && name.length > maxLength) {
      return name.slice(0, maxLength) + "...";
    }
    return name;
  };

  useEffect(() => {

  }, [userCtx.locationInfo])

  return (
    <div className="bg-custom-blue w-full text-white flex items-center justify-between py-4 px-4 fixed top-0 z-10 h-[85px]">
      <div className="flex flex-1 gap-6">
        <Link to="/user"><img src={LOGO} alt="logo" className="" /></Link>
        <div className="flex items-center justify-between gap-2">
          <img src={LOCATION_LOGO} alt="location pin" className="w-4 h-4" />
          <p>
            {userCtx.isLoading
              ? "User Location"
              : truncateDisplayName(userCtx.locationInfo.display_name)}
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-between mx-12">
        <Link to="/find">Find</Link>
        <Link to="/nearby">Nearby</Link>
        <Link to="/pricing">Pricing</Link>
        <Link to="/book">Book</Link>
      </div>

      <div className="flex justify-between items-center flex-1 gap-6">
        <Link to="/user/list-a-space" className="bg-white text-custom-blue px-8 py-2 rounded-lg font-bold flex-1 text-center">List a Space</Link>
        <Link to="/wishlisted-spaces">
          <img src={HEART_LOGO} alt="" />
        </Link>
        <Link to="/dashboard">
          {userCtx.user === null ? <Link to="/auth/login"><img src={USER_LOGO} alt="" /></Link> : <Link to="/user/dashboard"><img src={USER_LOGO} alt="" /></Link>}
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
