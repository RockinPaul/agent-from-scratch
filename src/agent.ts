import { runLLMAgentSession } from "./llm.ts";
import { addMessages, getMessages, saveToolResponse } from "./memory.ts";
import { logMessage, showLoader } from "./ui.ts";
import { runTool } from "./toolRunner.ts";

export const runAgent = async (
	{ userMessage, tools }: { userMessage: string; tools: any[] },
) => {
	await addMessages([{ role: "user", content: userMessage }]);
	const loader = showLoader("⏳");

	while (true) {
		const history = await getMessages();
		const response = await runLLMAgentSession({ messages: history, tools });

		await addMessages([response]);

		if (response.content) {
			loader.stop();
			logMessage(response);
			return getMessages();
		}

		if (response.tool_calls) {
			const toolCall = response.tool_calls[0];
			logMessage(response);

			loader.update(`executing: ${toolCall.function.name}`);

			const toolResponse = await runTool(toolCall, userMessage);
			// Taking the tool call id from the response and saving the tool response
			await saveToolResponse(toolCall.id, toolResponse);

			loader.update(`executed: ${toolCall.function.name}`);
		}
	}
};
