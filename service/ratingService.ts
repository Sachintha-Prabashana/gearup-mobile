import {
    collection,
    doc,
    runTransaction,
    serverTimestamp,
    query,
    where,
    getDocs,
    orderBy,
    limit,
    Timestamp
} from "firebase/firestore";
import { auth, db } from "./firebase";

// Review Data Type
export interface Review {
    id?: string;
    bookingId: string;
    itemId: string;
    userId: string;
    userName: string;
    userAvatar: string;
    rating: number; // 1 - 5
    comment: string;
    createdAt: Timestamp | any;
}

// Types
export interface ReviewData {
    id: string;
    userName: string;
    userAvatar: string;
    comment: string;
    createdAt: any;
    rating: number;
}

export const addReview = async (
    bookingId: string,
    itemId: string,
    rating: number,
    comment: string
) => {
    const user = auth.currentUser;
    if (!user) throw new Error("User must be logged in to review.");

    try {
        await runTransaction(db, async (transaction) => {
            const productRef = doc(db, "products", itemId);
            const bookingRef = doc(db, "bookings", bookingId);
            const newReviewRef = doc(collection(db, "reviews")); // Auto ID

            // 2. Read Data
            const productDoc = await transaction.get(productRef);
            const bookingDoc = await transaction.get(bookingRef);

            if (!productDoc.exists()) throw new Error("Product not found.");
            if (!bookingDoc.exists()) throw new Error("Booking not found.");

            const bookingData = bookingDoc.data();
            const productData = productDoc.data();

            if (bookingData.status !== 'completed') {
                throw new Error("You can only rate completed rentals.");
            }
            if (bookingData.isRated) {
                throw new Error("You have already rated this rental.");
            }

            // 4. Calculate New Average
            const currentCount = Number(productData.ratingCount || 0);
            const currentAvg = Number(productData.averageRating || 0);

            // Formula: ((OldAvg * OldCount) + NewRating) / (OldCount + 1)
            const newCount = currentCount + 1;
            const newAvg = ((currentAvg * currentCount) + rating) / newCount;

            // 5. Database Update

            // A. Add Review Document
            transaction.set(newReviewRef, {
                bookingId,
                itemId,
                userId: user.uid,
                userName: user.displayName || "GearUp User",
                userAvatar: user.photoURL || "",
                rating,
                comment,
                createdAt: serverTimestamp()
            });

            // B. Update Product Stats
            transaction.update(productRef, {
                ratingCount: newCount,
                averageRating: Number(newAvg.toFixed(1)) // get one decimal place
            });

            // C. Update Booking (Mark as Rated)
            transaction.update(bookingRef, {
                isRated: true,
                myRating: rating
            });
        });

        console.log("Review submitted successfully!");
        return { success: true };

    } catch (error: any) {
        console.error("Error submitting review:", error);
        throw new Error(error.message || "Failed to submit review.");

    }
}

export const getTopReviews = async (itemId: string): Promise<ReviewData[]> => {
    try {
        const reviewsRef = collection(db, "reviews");

        // Query Logic:

        const q = query(
            reviewsRef,
            where("itemId", "==", String(itemId)),// convert to string
            orderBy("rating", "desc"),    // most stars
            orderBy("createdAt", "desc"), // latest
            limit(3)
        );

        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as ReviewData[];

    } catch (error: any) {
        console.error("Error fetching top reviews:", error);

        // Index Error Handling Reminder
        if (error.message.includes("requires an index")) {
            console.warn("Firestore Index Missing! Please check the console link to create an index for (itemId + rating + createdAt).");
        }
        return [];
    }
};