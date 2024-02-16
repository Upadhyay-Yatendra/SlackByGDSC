import express from "express";
const { Request, Response, NextFunction } = express;
import {Organisation} from "../models/organisation.js";
import successResponse from "../helpers/successResponse.js";
import {Channel} from "../models/channel.js";
import {Conversation} from "../models/conversation.js";
// import { UserSchemaType } from "../models/user.js";

// @desc    get organisation
// @route   GET /api/v1/organisation/:id
// @access  Private
export const getOrganisation = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (id) {
      let organisation = await Organisation.findById(id).populate([
        "coWorkers",
        "owner",
      ]);

      if (!organisation) {
        return res.status(400).json({
          name: "no organisation found",
        });
      }

      const channels = await Channel.find({
        organisation: id,
      }).populate("collaborators");

      const conversations = await Conversation.find({
        organisation: id,
      }).populate("collaborators");

      const conversationsWithCurrentUser = conversations.filter(
        (conversation) =>
          conversation.collaborators.some(
            (collaborator) => collaborator._id.toString() === req.user.id
          )
      );

      const updatedConversations = conversationsWithCurrentUser.map((convo) => {
        const currentUserIndex = convo.collaborators.findIndex(
          (coworker) => coworker._id.toString() === req.user.id
        );

        const collaborators = [...convo.collaborators];

        convo.collaborators.splice(currentUserIndex, 1);

        const name = convo.collaborators[0]?.username || convo.name;

        return {
          ...convo.toObject(),
          name,
          createdBy: convo.collaborators[0]?._id,
          collaborators,
        };
      });

      const currentUserIsCoWorker = organisation.coWorkers.some(
        (coworker) => coworker._id.toString() === req.user.id
      );

      let profile;
      if (currentUserIsCoWorker) {
        const currentUser = organisation.coWorkers.find(
          (coworker) => coworker._id.toString() === req.user.id
        );
        profile = currentUser;
      }

      const updatedOrganisation = {
        ...organisation.toObject(),
        conversations: updatedConversations,
        channels,
        profile,
      };

      successResponse(res, updatedOrganisation);
    }
  } catch (error) {
    next(error);
  }
};
// @desc    get organisation
// @route   POST /api/v1/organisation
// @access  Private
export const createOrganisation = async (req, res, next) => {
  try {
    const { name, id } = req.body;

    if (!name && !id) {
      const organisation = await Organisation.create({
        owner: req.user.id,
        coWorkers: [req.user.id],
      });

      successResponse(res, organisation);
    }

    if (name && id) {
      const organisation = await Organisation.findOneAndUpdate(
        { _id: id },
        { $set: { name } },
        { new: true }
      ).populate(["coWorkers", "owner"]);

      organisation.generateJoinLink();
      await organisation.save();
      successResponse(res, organisation);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    get organisations associated with an email
// @route   POST /api/v1/organisation/workspaces
// @access  Private
export const getWorkspaces = async (req, res, next) => {
  try {
    const id = req.user.id;
    // Find all organizations where the user is a co-worker
    const workspaces = await Organisation.find({ coWorkers: id });
    // Fetch channels for each organization
    const workspacesWithChannels = await Promise.all(
      workspaces.map(async (workspace) => {
        const channels = await Channel.find({ organisation: workspace._id });
        return {
          ...workspace.toObject(),
          channels,
        };
      })
    );

    successResponse(res, workspacesWithChannels);

    // successResponse(res, workspaces);
  } catch (error) {
    next(error);
  }
};
