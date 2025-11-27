import { aiFun } from "../services/ai.service.js";

export const textInputController = async (req, res) => {
  let {text, threadId} = req.body;

  if (!text || !threadId) {
    return res.send("Prompt or ID is Required!");
  }

  try {
    const response = await aiFun(text, threadId);
    res.send(response);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
