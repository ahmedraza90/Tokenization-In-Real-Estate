import axios from "axios";
import { ethers } from "ethers";
import {
  ERC721ABI, ERC72FACTORYABI,
  ERC72FACTORYContractAddress,
} from "../../Redux/constants/erc721ABI";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addProperty } from "../../Redux/actions/propertyActions";
import "./AddProperty.css";
import Spinner from "../../components/spinner/Spinner";
import SuccessModal from "../../components/success modal/SuccessModal";
import Navbar from "../../components/Navbar/Navbar";

function AddProperty() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const propertyAdd = useSelector((state) => state.propertyAdd);
  const { loading, error } = propertyAdd;

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, []);

  const [ownerName, setOwnerName] = useState("");
  const [numberOfSupplies, setNumberOfSupplies] = useState(0);
  const [propertyAddress, setPropertyAddress] = useState("");
  const [propertyPrice, setPropertyPrice] = useState(0);
  const [propertyImages, setPropertyImages] = useState([]);
  const [numberOfTokenPerWallet, setNumberOfTokenPerWallet] = useState(0);
  const [propertyDocuments, setPropertyDocuments] = useState([]);
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [size, setSize] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [postalcode, setPostalCode] = useState("");
  const [ETHpriceToUSD, setETHpriceToUSD] = useState(0);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [PricePerToken, setPricePerToken] = useState(null);
  const [successfull, setSuccessfull] = useState(false);
  const [transactionHash, setTransactionHash] = useState();
  

  
  const getEth = async () => {
    const { data } = await axios.get(
      "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD"
    );
    setETHpriceToUSD(data.RAW.ETH.USD.PRICE);
  };
  useEffect(() => {
    getEth();
  }, [PricePerToken]);

  const propertyDetails = useSelector(state => state.propertyDetails)
    const { property } = propertyDetails
    console.log(property);

    const createproperty= async ()=>{
      const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const address = accounts[0];
       let provider = new ethers.providers.Web3Provider(window.ethereum);
      let signer = provider.getSigner();
      const Contract = new ethers.Contract(
              ERC72FACTORYContractAddress,
              ERC72FACTORYABI,
              signer
            );
            const tx = await Contract.mint(`${property.Id}`,`${address}`,property?.TokenId);
    setTransactionHash(tx.hash);
    const receipt = await tx.wait();
    console.log(receipt);
    const events = receipt.events.filter((event) => event.event === "DaoAdd");
    console.log(events);
    const propertyEvent = events[0];
    console.log(propertyEvent);
    const propertyargs = propertyEvent.args[0];
    console.log(propertyargs);
    }
    useEffect(()=>{
if(property){
  createproperty();
}
    },[])

  const submitHandler = async (e) => {
    setUploading(true);
    console.log("geee")
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const formData = new FormData();
    const arr = [];
    for (let i = 0; i < propertyImages.length; i++) {
      arr.push(propertyImages[i]);
    }
    const arr1 = [];
    for (let i = 0; i < propertyDocuments.length; i++) {
      arr1.push(propertyDocuments[i]);
    }

    for (let i = 0; i < arr.length; i++) {
      formData.append("propertyImages", arr[i]);
    }
    for (let i = 0; i < arr1.length; i++) {
      formData.append("propertyDocuments", arr1[i]);
    }
    formData.append("ownerName", ownerName);
    formData.append("PropertyContractAddress", "CloneAddress");
    formData.append("OwnerWalletAddress", accounts[0]);
    formData.append("numberOfSupplies", numberOfSupplies);
    formData.append("propertyAddress", propertyAddress);
    formData.append("propertyPrice", propertyPrice);
    formData.append("beds", beds);
    formData.append("baths", baths);
    formData.append("country", country);
    formData.append("size", size);
    formData.append("city", city);
    formData.append("postalcode", postalcode);
    formData.append("isRentable", false);
    formData.append("Installment", 'noInstallement');
    let PricePerToken = (propertyPrice / ETHpriceToUSD).toString();
    // setPricePerToken(PricePerToken);
    console.log(PricePerToken);
    dispatch(
          addProperty(
            formData,
            PricePerToken,
            accounts[0],
            numberOfSupplies,
            numberOfTokenPerWallet
          )
    );
    setUploading(false);

  };
  
  return (
    <>
    <Navbar/>

      <div>
        {successfull && <SuccessModal />}
        {uploading && <Spinner />}
        {error && <div className="error">{message}</div>}


        <form className="property-form"  encType="multipart/form-data" style={{width:"100vw"}}>

          <div className="top-heading">
            <h1>Add Property</h1>
          </div>

          
          <div className="form-inputs" style={{display:"flex",width:"100%",justifyContent: "space-evenly"}}>
          <div className="form-styles">
            <label style={{ color: "lightgray", float: "left", marginBottom:"-21px",marginTop:"16px"}}>Enter Owner Name</label>
          <input
            type="text"
            name="ownerName"
            value={ownerName}
            className="inputs"
            required
            onChange={(e) => setOwnerName(e.target.value)}
            placeholder="Enter Owner Name"
          />
          <label  className="labels"> Enter Supplies</label>
          <input
            type="Number"
            name="numberOfSupplies"
            min={0}
            className="inputs"
            required
            onChange={(e) => setNumberOfSupplies(e.target.value)}
            placeholder="Enter Supplies"
          />
          <label  className="labels"> Enter property address</label>
          <input
            type="text"
            name="propertyAddress"
            value={propertyAddress}
            className="inputs"
            required
            onChange={(e) => setPropertyAddress(e.target.value)}
            placeholder="Enter property address"
          />

          <label className="labels"> Enter property Price</label>
          <input
            type="Number"
            name="propertyPrice"
            min={0}
            className="inputs"
            required
            onChange={(e) => setPropertyPrice(e.target.value)}
            placeholder="Enter property Price"
          />

          <label className="labels" > Enter Number of token per wallet</label>
          <input
            type="Number"
            name="NumberOfTokenPerWallet"
            className="inputs"
            min={0}
            required
            onChange={(e) => setNumberOfTokenPerWallet(e.target.value)}
            placeholder="Enter Number of token per wallet"
          />

          <label className="labels"> Select property images</label>
          <input
            type="file"
            id="image-file"
            label="Choose File"
            className="inputs"
            multiple
            onChange={(e) => setPropertyImages(e.target.files)}
          />
                     <label className="labels"> Select property documents</label>
          <input
            type="file"
            id="image-file"
            label="Choose File"
            className="inputs"
            multiple
            onChange={(e) => setPropertyDocuments(e.target.files)}
          />
</div>
          <div className="form-styles">
        
           <label className="labels"> Enter no of beds</label>
          <input
            type="number"
            name="beds"
            min={0}
            className="inputs"
            required
            onChange={(e) => setBeds(e.target.value)}
            placeholder="Enter no of beds"
          />
           <label className="labels"> Enter no of baths</label>
          <input
            type="number"
            name="baths"
            min={0}
            className="inputs"
            required
            onChange={(e) => setBaths(e.target.value)}
            placeholder="Enter no of baths"
          />

           <label className="labels"> Enter area in sqft</label>
          <input
            type="Number"
            name="size"
         placeholder="Enter area in sqft"
            min={0}
            className="inputs"
            required
            onChange={(e) => setSize(e.target.value)}
          />

           <label className="labels"> Enter country</label>
          <input
            type="text"
            name="country"
            value={country}
            placeholder="Enter country"
            className="inputs"
            required
            onChange={(e) => setCountry(e.target.value)}
          />

           <label className="labels"> Enter city</label>
          <input
            type="text"
            name="city"
            value={city}
            placeholder="Enter city"
            className="inputs"
            required
            onChange={(e) => setCity(e.target.value)}
          />
           <label className="labels"> Enter postal code</label>
          <input
            type="text"
            name="postalcode"
            value={postalcode}
            placeholder="Enter postal code"
            className="inputs"
            required
            onChange={(e) => setPostalCode(e.target.value)}
          />
</div>
</div>
          <br />
          <button
            className="logbtn"
            onClick={
              submitHandler
            }
          >
            Submit
          </button>
          <br />
        </form>
      </div>

    </>
  );
}

export default AddProperty;