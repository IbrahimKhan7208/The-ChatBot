import Groq from "groq-sdk";
import { tavily } from "@tavily/core";
import NodeCache from "node-cache";

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

const groq = new Groq({ apiKey: process.env.GROQ_API });

const myCache = new NodeCache({ stdTTL: 60 * 60 * 24 });

export async function aiFun(prompt, threadId) {
  let history = myCache.get(threadId);

  if (!history) {
    history = [
      {
        role: "system",
        content: `You are Chat, an advanced AI assistant designed to provide accurate, helpful, and concise responses.
                  Your responsibilities:
                  - Always be clear, friendly, and professional.
                  - Ask clarifying questions when the user’s request is ambiguous.
                  - Use the webSearch tool whenever the user asks for current, factual, or real-time information.
                  - When using external tools, combine the tool result with your own reasoning to provide final answers.
                  - Do NOT hallucinate—if you are unsure, say so or use the tool to verify.
                  - Maintain context from previous messages and provide coherent replies.
                  - Keep responses efficient and avoid unnecessary verbosity.
                  Greet the user as “Chat” on the first message only.`,
      },
    ];
  }

  history.push({ role: "user", content: prompt });

  const max_retries = 10;
  let count = 0;

  while (true) {
    if (count > max_retries) {
      return "I couldn't provide result, try again.";
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
              "Searches the web for real-time or factual information. Use this tool when the user requests up-to-date facts, recent events, prices, news, statistics, or any information that cannot be reliably answered from internal knowledge.",
            parameters: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description:
                    "A clear and specific search query that represents the user's request.",
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
      myCache.set(threadId, history);
      console.log(threadId);
      return completion.choices[0].message.content;
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
