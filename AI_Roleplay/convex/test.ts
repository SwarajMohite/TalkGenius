import { mutation } from "./_generated/server";

export const insertTestUser = mutation({
    handler: async (ctx) => {
        const testData = {
            name: "Test User",
            email: "test@test.com",
            imageUrl: "https://via.placeholder.com/150"
        };
        
        const result = await ctx.db.insert('UserTable', testData);
        console.log("Test user inserted:", result);
        return result;
    }
});