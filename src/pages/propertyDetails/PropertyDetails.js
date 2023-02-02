import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import './PropertyDetails.css'
import CenterNavbar from '../../components/centerNavbar/CenterNavbar'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import { getTokenForSale, listPropertyDetails } from '../../Redux/actions/propertyActions'
import map from '../../assets/map.jpg'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Slider from '../../components/slider/Slider'
import MintModel from '../../components/mintModel/MintModel'
import axios from 'axios'

function PropertyDetails() {
    const [openModal, setOpenModal] = useState(false)
    const { id } = useParams()
    var [data, setData] = useState()
    // if (data == undefined) {
    //     axios.get(`http://localhost:8000/api/property/${id}`)
    //         .then((res) => {
    //             setData(res.data)
    //         })
    // }

    // console.log(data)
    // const propertyDetails = useSelector(state => state.propertyDetails)
    // const { loading, error, property } = propertyDetails
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(listPropertyDetails(id))
        
    }, [dispatch, id])

    const propertyDetails = useSelector(state => state.propertyDetails)
    const { loading, error, property } = propertyDetails
return (
        <>
            <Navbar />
            {property && <Slider propertyImages={property.propertyImages} />}
            {data && openModal && <MintModel setOpenModal={setOpenModal} property={property} />}

            <p className='mintbtn' onClick={() => {
                setOpenModal(true);
            }}>Mint</p>

            <CenterNavbar id={id} />
            <Footer />
        </>
    )
}

export default PropertyDetails