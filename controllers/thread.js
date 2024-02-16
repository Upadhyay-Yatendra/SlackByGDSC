import express from "express";


const { Request, Response, NextFunction } = express;
import {Thread} from '../models/thread.js'
import successResponse from '../helpers/successResponse.js'

// @desc    get threads
// @route   POST /api/v1/threads
// @access  Private
export async function getThreads(
req,res,next
) {
  try {
    const messageId = req.query.message

    if (messageId) {
      const threads = await Thread.find({
        message: messageId,
      })
        .populate('sender')
        .populate('reactions.reactedToBy')
      successResponse(res, threads)
    } else {
      res.status(400).json({})
    }
  } catch (error) {
    next(error)
  }
}