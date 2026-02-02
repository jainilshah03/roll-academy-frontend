import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserFromCookie } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    // Get the current logged-in user from frontend auth
    const cookieStore = await cookies();
    const user = getUserFromCookie(cookieStore) as { id?: string; userId?: string } | null;
    // JWT token stores the user ID as 'id', not 'userId'
    const currentUserId = user?.id || user?.userId;

    console.log("🔍 Frontend API: Fetching videos for user:", currentUserId);
    console.log("🔍 User object from cookie:", user);

    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/videos`,
      {
        headers: {
          // Note: Backend uses NextAuth, frontend uses JWT cookies
          // They are separate auth systems, so backend won't authenticate this request
          cookie: req.headers.get("cookie") || "",
        },
      }
    );

    const data = await backendRes.json();
    console.log(`📹 Backend returned ${Array.isArray(data) ? data.length : 0} videos`);

    // Since frontend and backend use different auth systems,
    // the backend returns empty array for unauthenticated requests.
    // We need to fetch all videos and filter on the frontend side.

    // If backend returned empty array due to no auth, we can't filter properly
    // This means the backend API needs to be public or we need unified auth

    // For now, filter based on what we get from backend
    let filteredVideos = data;

    if (Array.isArray(data) && currentUserId) {
      filteredVideos = data.filter((video: any) => {
        // Show public videos
        if (video.visibility === "PUBLIC") {
          return true;
        }
        // Show videos assigned to this user
        if (video.targetedId === currentUserId) {
          console.log(`✅ Video "${video.title}" is assigned to current user`);
          return true;
        }
        // Show videos not assigned to anyone (null targetedId)
        if (video.targetedId === null) {
          return true;
        }
        // Hide videos assigned to other users
        console.log(`❌ Video "${video.title}" is assigned to another user (${video.targetedId}), hiding it`);
        return false;
      });

      console.log(`✅ Filtered to ${filteredVideos.length} videos for user ${currentUserId}`);
    } else if (!currentUserId && Array.isArray(data)) {
  // Show ONLY public videos if user not logged in
            filteredVideos = data.filter(
              (video: any) => video.visibility === "PUBLIC"
            );
          }


    return NextResponse.json(filteredVideos, {
      status: backendRes.status,
    });
  } catch (err) {
    console.error("VIDEOS PROXY ERROR:", err);
    // Return empty array instead of error object to prevent frontend crashes
    return NextResponse.json([], { status: 200 });
  }
}
