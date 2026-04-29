import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        //adding value to refreshToken in DB
        user.refreshToken = refreshToken
        //saving that value in DB
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    //get user details from Client/Frontend
    const { email, username, password } = req.body

    //validation of data
    if ([email, username, password].some((field) => { field?.trim() === "" })) {
        throw new ApiError(400, "field is required !!") //new -> creates a new object from that class
    }

    //check if user already exists: email
    const existedUser = await User.findOne({email})
    if (existedUser) {
        throw new ApiError(409, "user with this username or email already existed")
    }

    //create user object - create entry in DB
    const user = await User.create({
        username: username,
        email: email,
        password: password,
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken" //remove password and refreshToken fields from response
    )

    //check for user creation
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    //return response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully !!")
    )
})

const loginUser = asyncHandler(async (req, res) => {
    //take data from client
    const { email, password } = req.body

    //username or email
    if (!email) {
        throw new ApiError(400, "email required")
    }


    //find the user
    const user = await User.findOne({ email })
    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    //check password
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user crediantials")
    }

    //generate access and refresh token 
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {
                user: loggedInUser, accessToken, refreshToken
            },
                "User logged in Successfully"
            )
        )

})

export {
    registerUser,
    loginUser,
}