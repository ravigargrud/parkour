import PHONE from "../../assets/list/phone.png";
import LIGHTNING from "../../assets/list/lightning.png";
import VOUCHER from "../../assets/list/voucher.png";
import LOCK from "../../assets/list/lock.png";

const List = () => {
    return (
        <div>
            <ul className='h-full flex flex-col justify-between py-12 px-6 gap-10'>
                <li className='flex gap-8 items-center'>
                    <img src={PHONE} />
                    <div>
                        <p className='text-xl'>More Convenient</p>
                        <p className='mt-2'>Do it all from your mobile. Enter the app, find parking, and reserve. It’s that
                            easy. Oh, and if your plans change, update your reservation.</p>
                    </div>
                </li>
                <li className='flex gap-8 items-center'>
                    <img src={LIGHTNING} />
                    <div>
                        <p className='text-xl'>Faster</p>
                        <p className='mt-2'>Stop stressing, circling, or being late because we always have a spot for you.
                            With Parkour, reserve before you go out and always park on the first try.</p>
                    </div>
                </li>
                <li className='flex gap-8 items-center'>
                    <img src={VOUCHER} />
                    <div>
                        <p className='text-xl'>Cheaper</p>
                        <p className='mt-2'>No last-minute surprises here. Compare prices, choose the best parking you find, and save every time you park.</p>
                    </div>
                </li>
                <li className='flex gap-8 items-center'>
                    <img src={LOCK} className='' />
                    <div>
                        <p className='text-xl'>And safer</p>
                        <p className='mt-2'>Pay through the app, park only in verified car parks, and if you ever need help, contact us. </p>
                    </div>
                </li>
            </ul>
        </div>
    )
}

export default List;