import {mutation} from "./_generated/server";
import { v } from "convex/values";
import { query } from "./_generated/server";
import { exp } from "three/webgpu";

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
    },
});

export const getMessages = query({
    args: {},
    handler: async (ctx) => {
        const messages = await ctx.db.query("messages").order('desc').take(50);
        return messages.reverse();
    }
});