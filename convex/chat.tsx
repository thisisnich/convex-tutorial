import {mutation, query, internalAction} from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";

export const sendMessage = mutation({
    args: {
        user: v.string(),
        body: v.string(),
    },
    
    handler: async (ctx, args) => {
        console.log("This TypeScript code is running on the server.");
        await ctx.db.insert("messages",{
            user: args.user,
            body: args.body,
            createdAt: new Date().toISOString(),
        });
        if (args.body.startsWith("/wiki")) {
            const title = args.body.slice(args.body.indexOf(" ") + 1);
            const summary = await ctx.scheduler.runAfter(0, internal.chat.getWikipediaSummary, { title });


    }
},
});

export const getMessages = query({
    args: {},
    handler: async (ctx) => {
        const messages = await ctx.db.query("messages").order('desc').take(50);
        return messages.reverse();
    }
});

export const getWikipediaSummary = internalAction({
    args: { title: v.string() },
    handler: async (ctx, args) => {
        const response = await fetch(
          "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=" +
            args.title,
        );
    const summary = getSummaryFromJSON(await response.json());
    await ctx.scheduler.runAfter(0, api.chat.sendMessage, {
        user: "Wikipedia",
        body: summary,
    });
},
});

function getSummaryFromJSON(data: any) {
    const firstPageId = Object.keys(data.query.pages)[0];
    return data.query.pages[firstPageId].extract;
  // Return the summary text from the JSON response
}