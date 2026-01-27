import { db, auth  } from "./firebase";
import { doc, collection, runTransaction, serverTimestamp } from "firebase/firestore";


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

        const result = await runTransaction(db, async (transaction) => {
            const itemRef = doc(db, "products", data.itemId);

            // get the item document
            const itemDoc = await transaction.get(itemRef);

            if (!itemDoc.exists()) {
                throw new Error("Item does not exist");
            }

            const currentQty = Number(itemDoc.data().quantity || 0);

            if (currentQty <= 0) {
                throw new Error("Sorry, this item is currently out of stock.");
            }

            // for create new booking reference
            const newBookingRef = doc(collection(db, "bookings"));

            const newBooking = {
                bookingId: newBookingRef.id,
                userId: user.uid,
                ...data,
                status: 'CONFIRMED',
                createdAt: serverTimestamp(),
                isComplete: false
            };

            transaction.set(newBookingRef, newBooking);

            transaction.update(itemRef, {
                quantity: currentQty - 1
            });

            return { success: true, bookingId: newBookingRef.id };

        });

        console.log("Booking & Inventory Update Successful:", result.bookingId);
        return result;

    } catch (error) {
        console.error("Error processing booking:", error);
        throw error;
    }
}