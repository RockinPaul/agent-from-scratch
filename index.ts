import "dotenv/config";
import { runAgent } from "./src/agent";
import { tools } from "./src/tools";

// Get the user message from the command line
const userMessage = process.argv[2];

if (!userMessage) {
  console.error("Please provide a message");
  process.exit(1);
}

await runAgent({ userMessage, tools });

// Add the user message to the database
// await addMessages([{ role: "user", content: userMessage }]);

// Transactional: one-off message to the LLM (no memory)
// const transactionalResponse = await runLLM({ userMessage });

// Get the messages from the database to use as context
// const messages = await getMessages();

/// Session: multiple messages to the LLM (with memory within the same session)
// const sessionResponse = await runLLMSession({
//   messages: [...messages, { role: "user", content: userMessage }],
// });

/// Session: multiple messages to the LLM (with memory across sessions)
// const longSessionResponse = await runLLMSession({
//   messages,
// });
// // Add the LLM response to the database
// await addMessages([{ role: "assistant", content: longSessionResponse }]);
