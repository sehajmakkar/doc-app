import express from "express";
import userModel from "../models/user.model.js";
import doctorModel from "../models/doctor.model.js";
import appointmentModel from "../models/appointment.model.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import razorpay from "razorpay";

// register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Email is not valid",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // hashing user password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    // generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(201).json({
      success: true,
      token,
      // user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Email is not valid",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // check if user exists
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Password is incorrect",
      });
    }

    // generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get profile
const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId).select("-password");
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// update user profile
const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, email, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name && !phone && !email && !address && !dob && !gender) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      email,
      address: JSON.parse(address),
      dob,
      gender,
    });

    if (imageFile) {
      // upload image to cloudinary
      const result = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageUrl = result.secure_url;

      await userModel.findByIdAndUpdate(userId, {
        image: imageUrl,
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// book appointment
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;

    const docData = await doctorModel.findById(docId).select("-password");
    if (!docData.available) {
      return res.status(400).json({
        success: false,
        message: "Doctor is not available",
      });
    }

    let slots_booked = docData.slots_booked;

    // check if slot is already booked
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.status(400).json({
          success: false,
          message: "Slot is already booked",
        });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select("-password");

    delete docData.slots_booked;

    const appointment = await appointmentModel.create({
      userId,
      docId,
      slotDate,
      slotTime,
      userData,
      docData,
      amount: docData.fees,
      date: Date.now(),
    });

    // update doctor slots_booked
    await doctorModel.findByIdAndUpdate(docId, {
      slots_booked,
    });

    return res.status(201).json({
      success: true,
      appointment,
      message: "Appointment Booked Successfully",
    });
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get user appointments
const listAppointments = async (req, res) => {
  try{

    const { userId } = req.body;

    const appointments = await appointmentModel.find({ userId }).sort({ date: -1 });

    if(!appointments){
      return res.status(400).json({
        success: false,
        message: "No appointments found",
      });
    }

    return res.status(200).json({
      success: true,
      appointments,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const {userId, appointmentId } = req.body;

    const appointment = await appointmentModel.findById(appointmentId);

    // verify appointment
    if(appointment.userId !== userId){
      return res.status(400).json({
        success: false,
        message: "You are not authorized to cancel this appointment",
      });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    // update doctor slots_booked
    const { docId, slotDate, slotTime } = appointment;
    const docData = await doctorModel.findById(docId).select("-password");
    let slots_booked = docData.slots_booked;

    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        slots_booked[slotDate] = slots_booked[slotDate].filter((slot) => slot !== slotTime);
      }
    }

    await doctorModel.findByIdAndUpdate(docId, {
      slots_booked,
    });

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// APIs FOR RAZORPAY PAYMENT
// WILL IMPLEMENT AFTER I DO KYC.

// appointment payment using razorpay
// const razorpayInstance = new razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_SECRET,
// });
const paymentRazorpay = async (req, res) => {

  try {

    const {appointmentId} = req.body;

    const appointment = await appointmentModel.findById(appointmentId);

    if(!appointment || appointment.cancelled){
      return res.status(400).json({
        success: false,
        message: "Appointment not found or already cancelled",
      });
    }

    // creating options for razorpay payment
    const options = {
      amount: appointment.amount * 100,
      currency: process.env.CURRENCY,
      receipt: appointmentId,
    };

    // creating order
    const order = await razorpayInstance.orders.create(options);

    if(!order){
      return res.status(400).json({
        success: false,
        message: "Unable to create order",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });

  } catch(error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }

}

// verify payment razorpay
const verifyRazorpay = async (req, res) => {
  try {

    const {razorpay_order_id} = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if(orderInfo.status === "paid"){
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {
        payment: true,
      });

      return res.status(200).json({
        success: true,
        message: "Payment successful",
      });

    } else {
      return res.status(400).json({
        success: false,
        message: "Payment failed",
      });
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointments, cancelAppointment, paymentRazorpay, verifyRazorpay };