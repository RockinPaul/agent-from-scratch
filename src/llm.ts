import { openai } from "./ai";
import type { AIMessage } from "../types";
import { zodFunction } from "openai/helpers/zod";
import { systemPrompt } from "./systemPrompt";

// Transactional: handles one-off message to the LLM (no memory)
export const runLLM = async ({ userMessage }: { userMessage: string }) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.1,
    messages: [{ role: "user", content: userMessage }],
  });
  return response.choices[0].message.content;
};

// Session: handles multiple messages to the LLM (with memory)
export const runLLMSession = async (
  { messages }: { messages: AIMessage[] },
) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.1,
    messages,
  });
  return response.choices[0].message.content;
};

// Agent: handle multiple messages with tools and memory.
export const runLLMAgentSession = async (
  { messages, tools }: { messages: AIMessage[]; tools: any[] },
) => {
  // Format the tools for the LLM
  const formattedTools = tools.map(zodFunction);

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.1, // keep the temperature low to avoid hallucinations
    messages: [
      // Add the system prompt to the messages
      { role: "system", content: systemPrompt },
      ...messages,
    ],
    tools: formattedTools, // pass the formatted tools to the LLM
    tool_choice: "auto", // let the LLM decide if it needs a tool call
    parallel_tool_calls: false, // we don't need to call multiple tools in parallel
    // it can still call multiple tools in a row, but not in parallel
  });

  // return response.choices[0].message.content;
  // there is no content in tool calls, let's return the whole message
  return response.choices[0].message;
};
