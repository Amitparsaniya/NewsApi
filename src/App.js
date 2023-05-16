import './App.css'
import {Routes,Route } from "react-router-dom";


import React from 'react'
import Weather from "./components/Weather";

const { User } = require("../models/postgres");
const bcrypt = require("bcrypt");

const {
  failure,
  logger,
  httpResponses,
  httpsStatusCodes,
  success,
} = require("../utils");
const { generateMailtranspoter } = require("../utils/helper");

const createUser = async (_, input, { __t }) => {
  try {
    const userdata = await User.findOne({ where: { email: input.email } });
    if (userdata) {
      return failure("USER_ALREADY_EXIST", 400);
    }
    const response = await User.create(input);
    return { data: response };
  } catch (error) {
    return failure(
      "FAILED_TO_CREATE_USER",
      httpsStatusCodes.INTERNAL_SERVER_ERROR,
      httpResponses.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

const getUser = async (_, input, { _t }) => {
  try {
    const user = await User.findByPk(input.id);
    if (!user) {
      return failure("USER_NOT_FOUND!", 400);
    }
    return { data: [user] };
  } catch (error) {
    return failure(
      "FAILED_TO_GET_USER",
      httpsStatusCodes.INTERNAL_SERVER_ERROR,
      httpResponses.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

const fetchUsers = async (_, __) => {
  try {
    const user = await User.findAll();
    return { data: user };
  } catch (error) {
    return failure(
      "FAILED_TO_GET_USER",
      httpsStatusCodes.INTERNAL_SERVER_ERROR,
      httpResponses.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

const updateUser = async (_, input, { _t }) => {
  try {
    const updatedata = await User.update(
      {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        gender: input.gender,
        password: input.password,
        phone_no: input.phone_no,
      },
      { where: { id: input.id }, returning: true, plain: true }
    );

    return { data: [updatedata[1].dataValues] };
  } catch (error) {
    return failure(
      "FAILED_TO_UPDATE_USER",
      httpsStatusCodes.INTERNAL_SERVER_ERROR,
      httpResponses.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

const deleteUser = async (_, input, { _t }) => {
  try {
    const user = await User.findByPk(input.id);
    if (!user) {
      return failure("USER_NOT_FOUND!", 400);
    }
    const deleteduser = await user.destroy();

    return deleteduser;
  } catch (error) {
    return failure(
      "FAILED_TO_DELETE_USER",
      httpsStatusCodes.INTERNAL_SERVER_ERROR,
      httpResponses.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

const loginUser = async (_, input) => {
  try {
    const { email, password } = input;
    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      return failure("USER_NOT_EXIST", 401);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return failure("EMAIL_PASSWORD_INCORRECT", 400);
    }
    console.log(isMatch);
    return success(
      "USER_LOGGEDIN_SUCCESSFULLY",
      user,
      200,
      "USER_LOGGEDIN_SUCCESSFULLY"
    );
  } catch (error) {
    return failure(
      "FAILED_TO_LOGIN_USER",
      httpsStatusCodes.INTERNAL_SERVER_ERROR,
      httpResponses.INTERNAL_SERVER_ERROR,
      error
    );
  }
};
const forgotPassword = async (_, input) => {
  try {
    const { email } = input;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return failure("USER_NOT_EXIST", 401);
    }

    const resetpassword = `http://localhost:5000/reset-password?id=${user.id}`;

    var transport = generateMailtranspoter;

    transport.sendMail({
      from: "mailto:amit.parasaniya@brainvire.com",
      to: user.email,
      subject: "Reset Password",
      html: ` 
    <p>Click here to reset your password</p>
    <a href="${resetpassword}">Change Password</a>`,
    });
    return success("EMAIL_SENT_TO_YOUR_EMAIL_SUCCESSFULLY");
  } catch (error) {
    return failure(
      "FAILED_TO_SEND_EMAIL",
      httpsStatusCodes.INTERNAL_SERVER_ERROR,
      httpResponses.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

const resetPassword = async (_, input) => {
  try {
    const { email, password } = input;
    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return failure("USER_NOT_EXIST", 401);
    }

    const hashPassword = await bcrypt.hash(password, 10);
    user.password = hashPassword;
    await user.save();
    return success("PASSWORD_UPDATE_SUCCESSFULLY");
  } catch (error) {
    return failure(
      "FAILED_TO_RESET_PASSWORD",
      httpsStatusCodes.INTERNAL_SERVER_ERROR,
      httpResponses.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

module.exports = {
  createUser,
  fetchUsers,
  getUser,
  updateUser,
  deleteUser,
  loginUser,
  forgotPassword,
  resetPassword,
};


export default function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Weather/>}/>
    </Routes>
    </>
  )
}


