export type SignedConfig = {
    timestamp: number;
    signature: string;
    cloudName: string;
    apiKey: string;
};

export async function getSignedConfig(): Promise<SignedConfig> {
    const res = await fetch("/api/uploads/sign", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to sign");
    return res.json() as Promise<SignedConfig>;
}

export async function uploadToCloudinary(file: File, folder = "primesotech/trainings"): Promise<string> {
    const { timestamp, signature, cloudName, apiKey } = await getSignedConfig();
    const fd = new FormData();
    fd.append("file", file);
    fd.append("api_key", apiKey);
    fd.append("timestamp", String(timestamp));
    fd.append("signature", signature);
    fd.append("folder", folder);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: fd });
    if (!res.ok) throw new Error("Upload failed");
    const json = await res.json() as { secure_url: string };
    return json.secure_url;
}
