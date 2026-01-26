import { db, auth } from "./firebase";
import { doc, updateDoc } from "firebase/firestore";

const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUD_NAME as string;
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_UPLOAD_PRESET as string;
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

const uploadToCloudinary = async (imageUri: string, fileName: string) => {
    const formData = new FormData();

    formData.append("file", {
        uri: imageUri,
        type: "image/jpeg",
        name: fileName
    } as any);

    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("cloud_name", CLOUD_NAME);

    const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
    });

    const data = await response.json();

    if (data.secure_url) {
        return data.secure_url;
    } else {
        throw new Error("Cloudinary Upload Failed");
    }
};

export const uploadIdDocuments = async (frontUri: string, backUri: string) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated");
        const userId = user.uid;

        const [frontUrl, backUrl] = await Promise.all([
            uploadToCloudinary(frontUri, `front_${userId}.jpg`),
            uploadToCloudinary(backUri, `back_${userId}.jpg`)
        ]);

        console.log("Images Uploaded:", frontUrl, backUrl);

        const userRef = doc(db, "users", userId);

        await updateDoc(userRef, {
            verification: {
                frontImage: frontUrl,
                backImage: backUrl,
                status: 'APPROVED',
                uploadedAt: new Date(),
                provider: 'cloudinary' // for keeping track of upload source
            },
            isIdVerified: true
        });

        return { status: "success" };

    } catch (error) {
        console.error("Verification Error:", error);
        throw error;
    }
}