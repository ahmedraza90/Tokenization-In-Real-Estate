import React from 'react'
import axios from "axios";
import { ethers } from "ethers";
import "./RentableForm.css"
import Spinner from "../../components/spinner/Spinner";
import SuccessModal from "../../components/success modal/SuccessModal";
import { useState, useEffect } from "react";

function RentableForm({setOpenRentModal,property}) {
    console.log(property)
    const [message, setMessage] = useState("");
    const [uploading, setUploading] = useState(false);
    const [successfull, setSuccessfull] = useState(false);
    const [show, setShow] = useState(false)
    const [error, setError] = useState("")
     const [biddingTime, setBiddingTime] = useState();
     const [startingBid, setStartingBid] = useState();
     const [rentableDurationMonths, setRentableDurationMonths] = useState("Not Set");

     const submitHandler=()=>{
        console.log("Modal submit")
     }
  return (
    <>
{<div>
  <div className="mintModalBackground">


<div>
  {successfull && <SuccessModal />}
  {uploading && <Spinner />}
  {error && <div className="error">{message}</div>}

<center>
  <form className="mintModalContainer" encType="multipart/form-data" style={{width:"60vw"}}>
  <div className="mintModaltitleCloseBtn">
      <button
        onClick={() => {
          setOpenRentModal(false);
        }}
      >
        X
      </button>
    </div>
    <div className="top-heading">
      <h1>Rent Auction Details</h1>
    </div>
    {/* <input type="datetime-local" id="birthdaytime" name="birthdaytime"> */}
    
    <div className="form-inputs" style={{display:"flex",width:"100%",justifyContent: "space-evenly"}}>
    <div className="form-styles">
      <label style={{ color: "lightgray", float: "left", marginBottom:"-21px",marginTop:"16px"}}>Bidding End Time (Date and Time)</label>
    <input
      type="datetime-local"
      name="BiddingTime"
      value={biddingTime}
      className="inputs"
      required
      onChange={(e) => setBiddingTime(e.target.value)}
    //   placeholder="Enter Owner Name"
    />
    <label  className="labels"> Enter Starting Bid</label>
    <input
      type="Number"
      name="StartingBid"
      min={0}
      className="inputs"
      required
      onChange={(e) => setStartingBid(e.target.value)}
      placeholder="Enter Starting Bid"
    />
    <label  className="labels"> Rent Duration </label>
    <input
      type="text"
      name="rentableDurationMonths"
      value={rentableDurationMonths}
      className="inputs"
      required
      onChange={(e) => setRentableDurationMonths(e.target.value)}
      placeholder="Rent Duration"
    />


</div>
</div>
    <br />
    <center>
    <button
      className="logbtn"
      onClick={
        submitHandler
      }
    >
      Submit
    </button>
    </center>
    <br />
  </form>
  </center>
</div>
</div>
</div>}
    
    </>
  )
}

export default RentableForm

{/* <div>
{show ? <div> <MintSuccess count={count}/> </div>: 
<div className="mintModalBackground">
  <div className="mintModalContainer">
    <div className="mintModaltitleCloseBtn">
      <button
        onClick={() => {
          setOpenModal(false);
        }}
      >
        X
      </button>
    </div>
    <div className="mintModaltitle">
      <p>Enter No of tokens you want to buy and price of 1 token</p>
    </div>
    <div className="mintModalbody">
      <p>
        <b>TOKEN STOCK </b>: <span style={{fontSize:"20px", fontWeight:"bold"}}> <u> {property.TotalSupplies} </u> </span>{" "}
      </p>
      <p>
        <b>Price of One Token </b>: <span style={{fontSize:"20px", fontWeight:"bold"}}> {property.PricePerToken} $</span>{" "}
      </p>
      <h5>
        {property.numberOfSupplies - property.TotalSupplies} / {property.numberOfSupplies} minted
      </h5>
      <p>
      <button className={count !==0 ? 'decBtnActive': 'decBtnNotActive'} onClick={() => setCount(count - 1)} >
        -
      </button>
      <span className="tokenValue"> <b> {count} </b></span>

      <button
        className={count !== parseInt(property.TotalSupplies) ? 'incBtnActive':'incBtnNotActive' }
        onClick={() => setCount(count + 1)}
      >
        +
      </button>
      </p>
    </div>
    <div className="mintModalfooter">
      {parseInt(property.TotalSupplies) === 0 ? <p style={{fontSize:"large", backgroundColor:"crimson", borderRadius:"20px", padding:"10px", color:"white"}}>All tokens are minted</p>:
      <button className={count === 0 ? "noevent":"mintModalcalculateBtn"} onClick={Mint}>
        Mint
      </button>
      }
    </div>
  </div>
</div>
}
</div> */}