import express from "express";


const { Request, Response, NextFunction } = express;

import {Channel} from "../models/channel.js";
import successResponse from "../helpers/successResponse.js";

// @desc    create channel
// @route   POST /api/v1/channel/create
// @access  Private
export const createChannel = async (req, res, next) => {
  try {
    const { name, organisationId } = req.body;
    const channel = await Channel.create({
      name,
      collaborators: [req.user.id],
      organisation: organisationId,
    });
    successResponse(res, channel);
  } catch (error) {
    next(error);
  }
};

export const getChannels = async (req, res, next) => {
  try {
    const id = req.params.id;
    const channels = await Channel.find({ organisation: id })
      .populate({
        path: "organisation",
        populate: [{ path: "owner" }, { path: "coWorkers" }],
      })
      .populate("collaborators")
      .sort({ _id: -1 });

    successResponse(res, channels);
  } catch (error) {
    next(error);
  }
};

export const getChannel = async (req, res, next) => {
  try {
    const id = req.params.id;
    const channel = await Channel.findById(id)
      .populate("collaborators")
      .sort({ _id: -1 });

    if (!channel) {
      return res.status(400).json({
        name: "not found",
      });
    }

    const updatedChannel = {
      ...channel.toObject(),
      isChannel: true,
    };

    successResponse(res, updatedChannel);
  } catch (error) {
    next(error);
  }
};

export const updateChannel = async (req, res, next) => {
  try {
    const id = req.params.id;
    const channel = await Channel.findById(id);
    if (!channel) {
      return res.status(400).json({
        name: "not found",
      });
    }

    const updatedChannel = await Channel.findByIdAndUpdate(
      id,
      { $addToSet: { collaborators: req.body.userId } },
      {
        new: true,
      }
    );

    successResponse(res, updatedChannel);
  } catch (error) {
    next(error);
  }
};
