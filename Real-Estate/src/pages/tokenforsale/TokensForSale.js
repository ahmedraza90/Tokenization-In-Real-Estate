import React,{useState} from "react";
import './TokensForSale.css'
import axios from "axios";
import TokenList from "./TokenList";
import Spinner from '../../components/spinner/Spinner'
import { useDispatch, useSelector } from 'react-redux'
import { getTokenForSale } from '../../Redux/actions/propertyActions'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
function TokensForSale() {
  const [tokens, setTokens] = useState(null)

  const propertyDetails = useSelector(state => state.propertyDetails)
  const { loading, error, property } = propertyDetails

  console.log(property.listing.TokenForSale)

  // useEffect(() => {
  //     dispatch(getTokenForSale(id))
  // }, [dispatch, id])

  // const tokenDetails = useSelector(state => state.tokenDetails)
  // const { loading, error, tokens } = tokenDetails
  // console.log(tokens)
  // if(tokens.length > 0){

  //   console.log(tokens)
  // }
  return (
    <div>
      {loading && <Spinner />}
      <h2 className='financial-heading'>tokens for sale</h2>
      {property && property.listing.TokenForSale < 1 && <h4 style={{color:"white", textAlign:"center"}}>NO TOKENS AVAILABLE </h4>}
      {property && property.listing.TokenForSale.map((tokens) => (
        <TokenList key={tokens._id} tokens={tokens}/>
      ))
      }
    </div>
  )
}

export default TokensForSale