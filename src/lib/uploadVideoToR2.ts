export async function uploadVideoToR2(file: File): Promise<string> {
  // 1️⃣ Ask backend for presigned upload URL
  const res = await fetch("http://127.0.0.1:3001/api/videos/r2-upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to get R2 upload URL");
  }

  const { uploadUrl, publicUrl } = await res.json();

  // 2️⃣ Upload file directly to R2 (GB files supported)
  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!uploadRes.ok) {
    throw new Error("Failed to upload video to R2");
  }

  // 3️⃣ Return final public URL
  return publicUrl;
}
