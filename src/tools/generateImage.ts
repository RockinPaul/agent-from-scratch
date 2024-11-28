import type { ToolFn } from "../../types";
import { z } from "zod";
import { openai } from "../ai";

export const generateImageToolDefinition = {
  name: "generate_image",
  description: "Generate an image based on a prompt",
  parameters: z.object({
    prompt: z.string().describe(
      `The prompt to generate an image for. 
      Be sure to consider the user's original message when making the prompt. 
      If you are unsure, then ask the user for clarification`,
    ),
  }),
};

type Args = z.infer<typeof generateImageToolDefinition.parameters>;

export const generateImage: ToolFn<Args, string> = async (
  { toolArgs, userMessage },
) => {
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: toolArgs.prompt,
    size: "1024x1024",
    n: 1,
  });
  return response.data[0].url!;
};
