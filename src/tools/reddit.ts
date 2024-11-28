import { z } from "zod";
import fetch from "node-fetch";
import type { ToolFn } from "../../types";
export const redditToolDefinition = {
  name: "reddit",
  description: "Get the latest post from a subreddit",
  parameters: z.object({
    subreddit: z.string(),
  }),
};

type Args = z.infer<typeof redditToolDefinition.parameters>;

export const reddit: ToolFn<Args, string> = async ({ toolArgs, userMessage }) => {
  const { data } = await fetch(
    `https://www.reddit.com/r/${toolArgs.subreddit}/.json`,
  ).then((res) => res.json());

  const relevantInfo = data.children.map((child: any) => ({
    title: child.data.title,
    author: child.data.author,
    link: child.data.url,
    subreddit: child.data.subreddit_name_prefixed,
    upvotes: child.data.ups,
  }));

  return JSON.stringify(relevantInfo, null, 2);
};
