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
import RentableForm from '../RentableForm/RentableForm'
import axios from 'axios'

function PropertyDetails() {
    const [openModal, setOpenModal] = useState(false)
    const [openRentModal, setOpenRentModal] = useState(false)
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
    if(property){

        console.log(property)
    }
return (
        <>
            <Navbar />
            {/* {property && <Slider propertyImages={property.listing.propertyImages} />} */}
            {property && openModal && <MintModel setOpenModal={setOpenModal} property={property} />}
            {property && openRentModal && <RentableForm setOpenRentModal={setOpenRentModal} property={property} />}

            <p className='mintbtn' onClick={() => {
                setOpenModal(true);
            }}>Mint</p>
            
            <p className='mintbtn' onClick={() => {
                setOpenRentModal(true);
            }}>Rent Your Property</p>

           {id && <CenterNavbar id={id} />}
            <Footer />
        </>
    )
}

export default PropertyDetails