import { NextResponse } from "next/server";

const Pusher = require("pusher");

// Set up Pusher (node)
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  useTLS: true,
});

export async function POST(request) {
  try {
    
    // Get the required fields from the body
    const body = await request.json();

    const { game } = body; 
    

    // Throw error if no style is passed
    if (game === undefined) throw new Error("Didn't receive a new board set");

    console.log('game', game);

    // Limit trigger to current URL
    // NOTE: Needed await keyword, else the API was returning the results before the pusher has been triggered
    await pusher.trigger("roomId", "game", game);
    NextResponse.json({ message: "Game updated" });
  } catch (error) {
    console.log("error", error.message);
    return NextResponse.json({
      message: error?.message
        ? error.message
        : "Could not update game at this time",
    });
  }

  return NextResponse.json({ message: "Game updated"});
}
