import {
    ADD_PROPERTY_REQUEST,
    ADD_PROPERTY_SUCCESS,
    ADD_PROPERTY_FAIL,
    LIST_PROPERTY_REQUEST,
    LIST_PROPERTY_SUCCESS,
    LIST_PROPERTY_FAIL,
    PROPERTY_DETAILS_REQUEST,
    PROPERTY_DETAILS_SUCCESS,
    SEARCH_PROPERTY_FAIL,
    SEARCH_PROPERTY_SUCCESS,
    SEARCH_PROPERTY_REQUEST,
    GET_PROPERTY_TOKENS_FOR_SALE,
    GET_PROPERTY_TOKENS_FOR_SALE_SUCCESS
} from '../constants/propertyConstants'



import axios from 'axios'

var a = localStorage.getItem('userInfo')
if(a){
  var token = JSON.parse(a).authToken
}

// Add new property
export const addProperty = (formData,Pricepertoken,CloneOwner,numberOfSupplies,numberOfTokenPerWallet) => async (dispatch) => {

  const SellerWalletAddress = CloneOwner
  
  
 
  try {
    dispatch({
      type: ADD_PROPERTY_REQUEST
    })
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        "auth-token":token
      }
    }
    
    console.log("______________________________________________",token)
   
    const  {data}  = await axios.post('http://localhost:8000/api/property/check', formData , config)
        
    const propertyId = data.addProperty._id

    const testData = {
      Pricepertoken,SellerWalletAddress,numberOfSupplies,numberOfTokenPerWallet,propertyId
    }

    console.log("test data",testData)

    const newconfig = {
      headers: {
        'Content-Type': 'application/json',
        "auth-token":token
      }
    }
     const  data1  = await axios.post('http://localhost:8000/api/property/checkToken', testData,newconfig)

      let listingData = data1.data.listing
    dispatch({
      type: ADD_PROPERTY_SUCCESS,
      payload: data, listingData
      
    })
  } catch (error) {
    dispatch({
      type: ADD_PROPERTY_FAIL,
      payload: error.response.data
    })
  }
}



// Get All properties
export const getAllProperties = () => async (dispatch) => {
  try {
    dispatch({
      type: LIST_PROPERTY_REQUEST
    })
   
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const {data} = await axios.get("http://localhost:8000/api/property/allproperties",config)

    dispatch({
      type: LIST_PROPERTY_SUCCESS,
      payload: data,
    })

  } catch (error) {
    dispatch({
      type: LIST_PROPERTY_FAIL,
      payload: error.response.data
    })
  }
}

export const listPropertyDetails = (id) => async (dispatch) => {
  try {
    dispatch({
       type: PROPERTY_DETAILS_REQUEST 
      })

    const { data } = await axios.get(`http://localhost:8000/api/property/${id}`)

    dispatch({
      type: PROPERTY_DETAILS_SUCCESS,
      payload: data
    })
  } catch (error) {
    console.error("hello world")
  }
}

export const getTokenForSale = (propertyId) => async (dispatch) => {
  try {
    console.log("hellollollo")
    dispatch({
       type: GET_PROPERTY_TOKENS_FOR_SALE 
      })

    const { data } = await axios.get(`http://localhost:8000/api/property/getTokenForSale/${propertyId}`)
    // console.log(data)
    dispatch({
      type: GET_PROPERTY_TOKENS_FOR_SALE_SUCCESS,
      payload: data
    })
  } catch (error) {
    console.error("hello world")
  }
}

// Search properties 
export const SearchProperties = (key) => async (dispatch) => {
  try {
    dispatch({
       type: SEARCH_PROPERTY_REQUEST 
      })

    const { data } = await axios.get(`http://localhost:8000/search/${key}`)

    dispatch({
      type: SEARCH_PROPERTY_SUCCESS,
      payload: data
    })
  } catch (error) {
    dispatch({

      type: SEARCH_PROPERTY_FAIL,
      payload: error
    })
      // console.error("hello world")
  }
}