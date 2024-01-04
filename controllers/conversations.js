import { Request, Response, NextFunction } from "express";
import Conversations from "../models/conversation";
import successResponse from "../helpers/successResponse";
import { UserSchemaType } from "src/models/user";

exports.getConversations = async (req, res, next) => {
  try {
    const { id } = req.body;
    const conversations = await Conversations.find({ organisation: id }).sort({
      _id: -1,
    });
    successResponse(res, conversations);
  } catch (error) {
    next(error);
  }
};

exports.getConversation = async (req, res, next) => {
    try {
      const id = req.params.id;
      const conversation = await Conversations.findById(id)
        .populate('collaborators')
        .sort({ _id: -1 });
  
      if (!conversation) {
        return res.status(400).json({
          name: 'not found',
        });
      }
  
      const collaborators = [...conversation.collaborators];
      const currentUserIndex = conversation.collaborators.findIndex(
        coworker => coworker._id.toString() === req.user.id
      );
  
      conversation.collaborators.splice(currentUserIndex, 1);
  
      const name = conversation.collaborators[0]?.username || conversation.name;
  
      successResponse(res, {
        ...conversation.toObject(),
        name,
        collaborators,
      });
    } catch (error) {
      next(error);
    }
  };