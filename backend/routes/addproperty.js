const express = require('express')
var mongoose = require('mongoose');
const Property = require('../models/Property')
const ListingTokens = require('../models/ListingTokens')
const Buyer = require('../models/Buyer')
const Auction = require('../models/Auction')
const { validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router()
const multer = require('multer')
const Rent = require('../models/Rent')



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
})

const upload = multer({ storage })
const Arrayupload = upload.fields([{ name: "propertyImages", maxCount: 10 }, { name: "propertyDocuments", maxCount: 10 }])




// fetch all properties GET /api/property/allproperties
router.get("/allproperties", async (req, res) => {
    const properties = await Property.find({ property: req.body._id })
    res.json(properties)
})


//api to add token for sell in listing table and buyer table
// route: /api/property/checkToken
router.post("/checkToken", fetchuser, async (req, res) => {

    try {
        console.log(req.body);
        listing = await ListingTokens.create({
            user: mongoose.Types.ObjectId(req.body.user),
            propertyId: mongoose.Types.ObjectId(req.body.propertyId),
            SellerWalletAddress: req.body.SellerWalletAddress,
            TotalSupplies: req.body.TotalSupplies,
            PricePerToken: req.body.PricePerToken,
        })
        await Buyer.findByIdAndUpdate(req.body.BuyerId, {quantity : req.body.RemainingTokens});
        res.json({ listing })
    } catch (error) {
        console.log(error)
    }

})
router.get("/P",(req,res)=>{
    res.json("server start")
})

//api to make bid by using propertyId
// route: /api/property/bid/:id
router.patch("/bid/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const properties = await Auction.findOne({ propertyId: id })
        if(!properties){
            return res.json("this property  isn't on auction")
        }

        let array = properties.users 
        if(array.find(obj => obj.userId === req.body.userId)){
            return res.json("you have already bid")
        }
        const updates = {
                    userId: req.body.user,
                    bidAmount: req.body.amount,
                }
        const options = { new: true, select: {users: { _id: 0 }} };

        const result = await Auction.findOneAndUpdate({propertyId:id}, { $push :{users: { $each: [req.body], $sort: { bidAmount: 1 } } }}, options);

        res.send(result)
    } catch (error) {
        console.log(error.message)
    }
})





//api to get complete information including(bids,higest bids, auction, tenant) specific property using  proeprtyId
router.get("/getProperty/:id", fetchuser, async (req, res) => {

})

router.patch("/update/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        const options = { new: true };

        const result = await Property.findByIdAndUpdate(id, updates, options);

        res.send(result)
    } catch (error) {
        console.log(error.message)
    }
})

// fetch all user specific properties GET /api/property/userproperties
router.get("/userproperties", fetchuser, async (req, res) => {
    try {
        const use = await Property.find({ user: req.user.id })
        res.json(use)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }


})
// fetch all properties by id GET /api/property/:id
router.get("/:id", async (req, res) => {
    try {
        console.log(req.params.id)
        const listing = await Property.findOne({ propertyId: req.params.id });
        console.log(listing)
        return res.json(listing)
    } catch (e) {
        return res.status(404).json('Product not found')
    }
})
router.get("/getTokenForSale/:propertyId", async (req, res) => {
    try {
        console.log(req.params.id)
        const listing = await ListingTokens.find({ propertyId: req.params.propertyId });
        console.log(listing)
        return res.json(listing)
    } catch (e) {
        return res.status(404).json('Product not found')
    }
})
router.post("/propertyTokens/:id", async (req, res) => {
    const listing = await ListingTokens.findOne({ _id: req.params.id });
    var a = parseInt(listing.TotalSupplies)
    console.log("a====", a)
    console.log("req.body.TotalSupplies====", typeof req.body.TotalSupplies)

    if (a != req.body.TotalSupplies) {
        req.body.TotalSupplies = a - req.body.TotalSupplies
        const options = { new: true };
        await ListingTokens.findByIdAndUpdate(req.params.id, { TotalSupplies: `${req.body.TotalSupplies}` }, options);
        return res.json("successfully updated")
    }
    else {
        await ListingTokens.findByIdAndRemove({ _id: id })
        res.json("deleted successfully")
    }


})

//checked **********************************************************************************

//api to get the all the bids of different properties including auction infromation made by specific user using  userId
//route: /getBids/:id
//user : tenant
router.get("/getBids/:id", async (req, res) => {
    try {
        console.log("kkk")
        const id = req.params.id;
        const properties = await Auction.find({ "users.userId": req.params.id })
        res.send(properties)

    } catch (error) {
        console.log(error.message)
    }
})

// // add property using route '/api/property/check' Auth required
// router.post('/check', fetchuser, Arrayupload, async (req, res) => {
//     console.log("_________________-",req.body)
//     // if there are errors return bad request and errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }
//     try {
//         const arrPropertyImages = []
//         for (let i = 0; i < req.files.propertyImages.length; i++) {
//             arrPropertyImages.push(req.files.propertyImages[i].originalname)
//         }
//         const arrPropertyDocuments = []
//         for (let i = 0; i < req.files.propertyDocuments.length; i++) {
//             arrPropertyDocuments.push(req.files.propertyDocuments[i].originalname)
//         }
//         let addProperty = await Property.create({
//             user: req.user.id,
//             ownerName: req.body.ownerName,
//             PropertyContractAddress: req.body.PropertyContractAddress,
//             OwnerWalletAddress: req.body.OwnerWalletAddress,
//             propertyAddress: req.body.propertyAddress,
//             propertyPrice: req.body.propertyPrice,
//             propertyImages: arrPropertyImages,
//             propertyDocuments: arrPropertyDocuments,
//             beds: req.body.beds,
//             baths: req.body.baths,
//             size: req.body.size,
//             country: req.body.country,
//             city: req.body.city,
//             postalcode: req.body.postalcode,
//             numberOfSupplies: req.body.numberOfSupplies,
//             isRentable : req.body.isRentable


//         })
//         res.json({ addProperty })
//     } catch (error) {
//         console.error(error.message)
//         res.status(500).send("internal server error")
//     }
// })
// add property using route '/api/property/check' Auth required
// route: /addProperty
router.post('/addProperty', async (req, res) => {
    console.log("_________________-",req.body)
    // if there are errors return bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        // const arrPropertyImages = []
        // for (let i = 0; i < req.files.propertyImages.length; i++) {
        //     arrPropertyImages.push(req.files.propertyImages[i].originalname)
        // }
        // const arrPropertyDocuments = []
        // for (let i = 0; i < req.files.propertyDocuments.length; i++) {
        //     arrPropertyDocuments.push(req.files.propertyDocuments[i].originalname)
        // }
        let addProperty = await Property.create({
            user: req.body.user,
            ownerName: req.body.ownerName,
            PropertyContractAddress: req.body.PropertyContractAddress,
            OwnerWalletAddress: req.body.OwnerWalletAddress,
            propertyAddress: req.body.propertyAddress,
            propertyPrice: req.body.propertyPrice,
            // propertyImages: arrPropertyImages,
            // propertyDocuments: arrPropertyDocuments,
            beds: req.body.beds,
            baths: req.body.baths,
            size: req.body.size,
            country: req.body.country,
            city: req.body.city,
            postalcode: req.body.postalcode,
            numberOfSupplies: req.body.numberOfSupplies,
            isRentable : req.body.isRentable


        })
        console.log(addProperty)
        res.json({ addProperty })
    } catch (error) {
        console.error(error.message)
        res.status(500).send("internal server error")
    }
})
// fetch all properties of specific user by userid 
// route = get-property-by-user/:id
router.get("/get-property-by-user/:id", async (req, res) => {
    try {
        console.log(req.params.id)
        const listing = await Property.find({ user: req.params.id }).lean();
        
        const final = await Promise.all(listing.map(async (property) => {
            if (property.inAuction) {
                const auction = await Auction.findOne({ propertyId: property._id });
                property.auction = auction;
            } else if (property.isRented){
                const tenant = await Rent.findOne({ propertyId: property._id }).populate('tenant');
                property.tenant = tenant;
            }
        return property;
        }));
        return res.json(final)
    } catch (e) {
        console.log(e)
        return res.status(404).json('Product not found')
    }
})

// fetch specifc properties by propertyId 
// route = get-property/:id
router.get("/get-property/:id", async (req, res) => {
    try {
        console.log(req.params.id)
        const listing = await Property.findOne({ _id: req.params.id }).lean();
        if (listing.inAuction) {
            const auction = await Auction.findOne({ propertyId: listing._id });
            listing.auction = auction;
        } else if (property.isRented){
            const tenant = await Rent.findOne({ propertyId: listing._id }).populate('tenant');
            listing.tenant = tenant;
        }
        return res.json(listing)
    } catch (e) {
        console.log(e)
        return res.status(404).json('Product not found')
    }
})


//api to start the auction by updating auction table and property table by using propertyId
// route: /startAuction/:id
router.post("/startAuction/:id", async (req, res) => {
    try {

        const id = req.params.id;
        //crdeating auction 
        const properties = await Property.findOne({ _id: id })
        console.log(properties)
        
        //isrented should be false here.....
        //inAuction should be false here.... 
        if(properties.isRented || properties.inAuction){
            return res.json("sorry it is already in auction")
        }
        const auction = await Auction.findOne({ propertyId: id })
        if(auction){
            return res.json("sorry it is already in auction")
        }
        console.log(properties)
         
        await Auction.create({
            propertyId: id,
            users : [], 
            startDate : req.body.startDate, //2002-12-09'
            endDate : req.body.endDate
        })

        //updating property table   
        const updates = req.body;
        const options = { new: true };

        const result = await Property.findByIdAndUpdate(id, {inAuction : true }, options);

        res.send("result")
    } catch (error) {
        console.log(error.message)
    }
})

module.exports = router