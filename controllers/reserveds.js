const Reserved = require('../models/Reserved');
const Campground = require('../models/Reserved');

//@desc     Get all reserved
//@route    Get /api/v1/reserved
//@access   Public
exports.getReserveds = async (req,res,next) => {
    let query;

    if(req.user.role !== 'admin') {
        query = Reserved.find({user:req.user.id}).populate({
            path: 'campground',
            select: 'name address tel'
        });
    } else {
        if(req.params.campgroundId) {
            console.log(req.params.campgroundId);
            query = Reserved.find({campground:req.params.campgroundId}).populate({
                path: "campground",
                select: "name address tel",
            });
        } else {
            query = Reserved.find().populate({
                path: 'campground',
                select: 'name address tel'
            });
        }
    }

    try {
        const reserveds = await query;

        res.status(200).json({
            success: true,
            count: reserveds.length,
            data: reserveds
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false, 
            message: "Cannot find Reserved"
        });
    }
};

//@desc     Get single reserved
//@route    Get /api/v1/reserveds/:id
//@access   Public
exports.getReserved = async (req,res,next) => {
    try {
        const reserved = await Reserved.findById(req.params.id).populate({
            path: 'campground',
            select: 'name description tel'
        });

        if(!reserved) {
            return res.status(404).json({success:false, message:`No reserved with the id of ${req.params.id}`});
        }

        res.status(200).json({
            success: true,
            data: reserved
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false, message:"Cannot find Reserved"});
    }
};

//@desc     Add reserved
//@route    POST /api/v1/campgrounds/:campgroundId/reserved
//@access   Private
exports.addReserved = async (req,res,next) => {
    try {
        req.body.campground = req.params.campgroundId;

        const campground = await Campground.findById(req.params.campgroundId);

        if(!campground) {
            return res.status(404).json({success:false, message:`No campground with the id of ${req.params.campgroundId}`});
        }

        req.body.user = req.user.id;
        const existedReserveds = await Reserved.find({user:req.user.id});
        if(existedReserveds.length >= 3 && req.user.role !== 'admin') {
            return res.status(400).json({success:false,message:`The user with ID ${req.user.id} has already made 3 Reserveds`});
        }

        const reserved = await Reserved.create(req.body);

        res.status(200).json({
            success:true,
            data: reserved
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false, message: "Cannot create Reserved"});
    }
};

//@desc     Update reserved
//@route    PUT /api/v1/reserveds/:id
//@access   Private
exports.updateReserved = async (req,res,next) => {
    try {
        let reserved = await Reserved.findById(req.params.id);

        if(!reserved) {
            return res.status(404).json({success:false, message:`No reserved with the id of ${req.params.id}`});
        }

        if(reserved.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({success:false,message:`User ${req.user.id} is not authorized to update this Reserved`});
        }

        reserved = await reserved.findByIdAndUpdate(req.params.id,req.body,{
            new: true,
            runValidators:true
        });

        res.status(200).json({
            success:true,
            data: reserved
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:"Cannot update Reserved"});
    }
};

//@desc     Delete reserved
//@route    DELETE /api/v1/reserveds/:id
//@access   Private
exports.deleteReserved = async (req,res,next) => {
    try {
        const reserved = await Reserved.findById(req.params.id);

        if(!reserved) {
            return res.status(404).json({success:false,message:`No reserved with the id of ${req.params.id}`});
        }

        if(reserved.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({success:false,message:`User ${req.user.id} is not authorized to delete this reserved`});
        }

        await reserved.deleteOne();

        res.status(200).json({
            success:true,
            data: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:"Cannot delete Reserved"});
    }
};