import express from "express";
const { Request, Response, NextFunction } = express;
import Message from "../models/message.js";
import successResponse from "../helpers/successResponse.js";

// @desc    get messages
// @route   POST /api/v1/message
// @access  Private
export const getMessages = async (req, res, next) => {
  try {
    const channelId = req.query.channelId;
    const conversationId = req.query.conversation;
    const isSelf = req.query.isSelf;
    const organisation = req.query.organisation;

    if (channelId) {
      const channel = await Message.find({
        channel: channelId,
        organisation,
      }).populate(["sender", "reactions.reactedToBy", "threadReplies"]);
      successResponse(res, channel);
    } else if (conversationId) {
      let conversation;

      if (isSelf) {
        conversation = await Message.find({
          organisation,
          conversation: conversationId,
          isSelf,
        }).populate(["sender", "reactions.reactedToBy", "threadReplies"]);
      } else {
        conversation = await Message.find({
          organisation,
          conversation: conversationId,
        }).populate(["sender", "reactions.reactedToBy", "threadReplies"]);
      }
      successResponse(res, conversation);
    } else {
      res.status(400).json({});
    }
  } catch (error) {
    next(error);
  }
};

// @desc    get message
// @route   POST /api/v1/message
// @access  Private
export const getMessage = async(
  req,
  res,
  next
) =>{
  try {
    const id = req.params.id;

    if (id) {
      const message = await Message.findById(id).populate([
        "sender",
        "threadReplies",
        "reactions.reactedToBy",
      ]);
      successResponse(res, message);
    } else {
      res.status(400).json({
        name: "message not found",
      });
    }
  } catch (error) {
    next(error);
  }
}
