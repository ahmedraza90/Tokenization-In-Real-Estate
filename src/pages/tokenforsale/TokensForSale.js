import React from "react";
import './TokensForSale.css'
import TokenList from "./TokenList";
import Spinner from '../../components/spinner/Spinner'
import { useDispatch, useSelector } from 'react-redux'
import { getTokenForSale } from '../../Redux/actions/propertyActions'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
function TokensForSale() {
  const { id } = useParams()
  const dispatch = useDispatch()
  useEffect(() => {
      dispatch(getTokenForSale(id))
  }, [dispatch, id])

  const tokenDetails = useSelector(state => state.tokenDetails)
  const { loading, error, tokens } = tokenDetails
  return (
    <div>
      {loading && <Spinner />}
      <h2 className='financial-heading'>tokens for sale</h2>
      {tokens && tokens.length < 1 && <h4 style={{color:"white", textAlign:"center"}}>NO TOKENS AVAILABLE </h4>}
      {tokens && tokens .map((tokens) => (
        <TokenList key={tokens._id} tokens={tokens}/>
      ))
      }
    </div>
  )
}

export default TokensForSale