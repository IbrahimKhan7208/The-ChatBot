import Groq from "groq-sdk";
import { tavily } from "@tavily/core";
import NodeCache from "node-cache";

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

const groq = new Groq({ apiKey: process.env.GROQ_API });

const myCache = new NodeCache({stdTTL: 60 * 60 * 24});

export async function aiFun(prompt, threadId) {

  let history = myCache.get(threadId)

  if(!history){
    history = [{
      role: "system",
      content: "Your name is Chat, you are a personal assistant. greet with your name."
    }]
  }

  history.push({role: "user", content: prompt})

  const max_retries = 10
  let count = 0

  while (true) {

    if(count > max_retries){
      return "I couldn't provide result, try again."
    }

    count++;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",

      temperature: 0,

      messages: history,

      tools: [
        {
          type: "function",
          function: {
            name: "webSearch",
            description:
              "Do the searching over the web and provides external information to the LLM.",
            parameters: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "Query that will be used in serching the web.",
                },
              },
              required: ["query"],
            },
          },
        },
      ],

      tool_choice: "auto",
    });

    const msg = completion.choices[0].message;
    history.push(msg);

    const toolCalls = completion.choices[0].message.tool_calls;

    if (!toolCalls) {

      myCache.set(threadId, history)
      console.log(threadId)
      return completion.choices[0].message.content
    }

    for (const tool of toolCalls) {
      const toolName = tool.function.name;
      const toolArgument = tool.function.arguments;

      if (toolName === "webSearch") {
        const result = await webSearch(JSON.parse(toolArgument));

        history.push({
          role: "tool",
          tool_call_id: tool.id,
          name: toolName,
          content: JSON.stringify(result),
        });
      }
    }
  }
}

export async function webSearch({ query }) {
  console.log("Calling Web Search...");
  const response = await tvly.search(query);

  const finalResult = response.results
    .map((result) => result.content)
    .join("\n\n");

  return finalResult;
}
