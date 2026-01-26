import { db, auth  } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export interface BookingData {
    itemId: string;
    itemName: string;
    itemImage: string;
    startDate: string;
    endDate: string;
    nights: number;
    totalPrice: number;
    paymentMethod: 'card' | 'cash';
}

export const createBooking = async (data: BookingData) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated");

        const newBooking = {
            userId: user.uid,
            ...data,
            status: 'CONFIRMED',
            createdAt: serverTimestamp(), // get Firestore server time
            isComplete: false
        }

        // save to Firestore
        const docRef = await addDoc(collection(db, "bookings"), newBooking);

        console.log("Booking created with ID:", docRef.id);
        return { success: true, bookingId: docRef.id };

    } catch (error) {
        console.error("Error creating booking:", error);
        throw error;
    }
}