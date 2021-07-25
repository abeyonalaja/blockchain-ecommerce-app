import React from "react";
import {ethers} from 'ethers';
import axios from "axios";

const API_URL = "http://localhost:4000";

const ITEMS = [
    {id: 1,
    price: ethers.utils.parseEther('100')},
    {id: 2,
        price: ethers.utils.parseEther('200')}
]



const Store = ({paymentProcessor, dai}) => {
    const buy = async (item) => {
        const response = await axios.get(`${API_URL}/api/getPaymentId/${item.id}`);
        const approveTx = await dai.approve(paymentProcessor.address, item.price);
        await approveTx.wait();

        const payTx = await paymentProcessor.pay(item.price, response.data.paymentId);
        await payTx.wait();

        await new Promise(resolve => setTimeout(resolve, 5000));

        const response2 = await axios.get(`${API_URL}/api/getItemUrl/${response.data.paymentId}`);

        console.log(response2.data)

    }
    return (
        <ul className="list-group">
            {ITEMS.map( (item) => {
                return(
                    <li className="list-group-item">
                        Buy item{item.id} - <span>100 DAI</span>
                        <button className="btn btn-primary float-right" onClick={() => buy(item)}>Buy</button>
                    </li>
                )
            } )}
        </ul>
    )
}

export default Store;