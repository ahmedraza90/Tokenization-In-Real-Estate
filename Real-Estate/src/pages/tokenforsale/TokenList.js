import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser } from '@fortawesome/free-solid-svg-icons'
import './TokensForSale.css'
import Modal from '../../components/buyTokensModal/TokenModal'

export default function TokenList({tokens}) {
  const [modalOpen, setModalOpen] = useState(false);

  console.log(tokens)
 
  return (
    <>
    <p key={tokens._id} className='tokensforsale'>
           <FontAwesomeIcon icon={faCircleUser} className="userIcon" />
           <span>
             ID: {tokens.user}
           </span>

           <span>
            No of Tokens: {tokens.TotalSupplies}
           </span>

        <button className='buytokensbtn' onClick={() => {
            setModalOpen(true);
          }}>Buy Tokens</button>
          {modalOpen && <Modal setOpenModal={setModalOpen} property={tokens} />}
        </p>
    </>
  )
}
