import Message from "../models/message.js";

function formatDate(date) {
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-US', options);
  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1); // Capitalize the first letter
}

async function createTodaysFirstMessage({ channelId, conversationId, organisation }) {
  try {
    // Check if there are any messages for today in the channel
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let existingMessages;

    if (channelId) {
      existingMessages = await Message.find({
        channel: channelId,
        createdAt: { $gte: today },
      });
    } else if (conversationId) {
      existingMessages = await Message.find({
        conversation: conversationId,
        createdAt: { $gte: today },
      });
    }

    if (existingMessages.length === 0) {
      await Message.create({
        organisation,
        content: formatDate(today),
        ...(channelId ? { channel: channelId } : { conversation: conversationId }),
        hasRead: false,
        type: 'date',
      });
    }
  } catch (error) {
    // Handle error
    console.error(error);
  }
}

export default {createTodaysFirstMessage};
