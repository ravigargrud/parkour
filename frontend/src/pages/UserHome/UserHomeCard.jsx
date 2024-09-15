import { Heart } from "lucide-react";

const HomeCard = ({ parkingImg, price, address }) => {
    return (
        <div className="border-2 rounded-md p-4 flex flex-col">
            <img src={parkingImg} alt="parking" />

            <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                    <p className="text-2xl font-light">{address}</p>
                    <p className="text-gray-500">Low Crowd . 1.3km</p>
                </div>
                <div>
                    <p className="text-xl font-bold">Scooter(per/hr): {price[0]}</p>
                    <p className="text-xl font-bold">Car(per/hr): {price[1]}</p>
                    <p>Now</p>
                </div>
                <div className="flex align-top">
                    <Heart className="hover:text-red-500" />
                </div>
            </div>

            <button className="text-white bg-black py-2 rounded-lg w-2/3 mx-auto mt-8">Book your spot</button>
        </div>
    )
}

export default HomeCard;