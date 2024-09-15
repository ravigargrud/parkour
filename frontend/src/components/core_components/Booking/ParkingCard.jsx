import React from "react";
import CardComponent from "../../shad_ui/CardComponent"; // Import the reusable Card component
import Button from "../../custom_components/Button";
import { Link } from "react-router-dom";

const ParkingCard = ({ parkingData, className }) => {
  const processedLocation = parkingData.location.split(" ");

  const redirectToLocation = (location) => {
    const lat = location[0];
    const lng = location[1];
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, "_blank");
  };

  return (
    <CardComponent
      className={`absolute bottom-10 right-4 w-64 h-auto z-20 ${className}`}
      title={
        <div className="truncate">{parkingData.title}</div>
      }
      description={`${parkingData.location}`}
      footer={parkingData.price}
      content={<Link to={`/user/booking/?${parkingData.id}`} className="bg-[#00b302] hover:bg-[#00a101] text-white px-2 py-1 rounded-md w-full block text-center">Book now</Link>}
    >
      <Button
        className="btn btn-primary bg-[#00b302] hover:bg-[#00a101] text-white px-2 py-1 rounded-md w-full my-2"
        onClick={() => redirectToLocation(processedLocation)}
      >
        Get Directions
      </Button>
    </CardComponent>
  );
};

export default ParkingCard;
