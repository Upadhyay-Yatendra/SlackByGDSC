import express from 'express'
import {
  createChannel,
  getChannel,
  updateChannel,
} from '../controllers/channel.js'
import { protect } from '../middleware/protect.js'

const router = express.Router()

router.post('/', protect, createChannel)
router.get('/:id', protect, getChannel)
router.post('/:id', protect, updateChannel)

export default router