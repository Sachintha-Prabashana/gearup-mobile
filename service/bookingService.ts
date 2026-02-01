import { db, auth  } from "./firebase";
import { doc, collection, runTransaction, serverTimestamp } from "firebase/firestore";
import {getDocs, orderBy, query, where} from "@firebase/firestore";


export interface BookingInput {
    itemId: string;
    itemName: string;
    itemImage: string;
    startDate: string;
    endDate: string;
    nights: number;
    totalPrice: number;
    paymentMethod: 'card' | 'cash';
}

export interface Booking {
    id: string;
    itemId: string;
    itemName: string;
    itemImage: string;
    startDate: string;
    endDate: string;
    totalPrice: number;
    status: 'active' | 'completed' | 'cancelled' | 'overdue';
    bookingRef: string;
    isReturned: boolean;
    createdAt: any;
}

export const createBooking = async (data: BookingInput) => {
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
                status: 'active',
                isReturned: false,
                isComplete: false,
                createdAt: serverTimestamp()

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

export const getUserBookings = async (): Promise<Booking[]> => {
    try {
        const user = auth.currentUser;
        if (!user) return [];

        const bookingsRef = collection(db, "bookings");

        const q = query(
            bookingsRef,
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);

        // Data Mapping
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                itemImage: data.itemImage || data.image,
            } as Booking;
        });

    } catch (error) {
        console.error("Error fetching bookings:", error);
        return [];

    }
}

export const markBookingAsCompleted = async (bookingId: string, itemId: string) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("Authentication required to process return.");

        await runTransaction(db, async (transaction) => {
            // 1. References
            const bookingRef = doc(db, "bookings", bookingId);
            const itemRef = doc(db, "products", itemId);

            // 2.
            const bookingDoc = await transaction.get(bookingRef);
            const itemDoc = await transaction.get(itemRef);

            if (!bookingDoc.exists()) throw new Error("Booking record not found.");
            if (!itemDoc.exists()) throw new Error("Item record not found.");

            const bookingData = bookingDoc.data();

            // 3. Validation:
            if (bookingData.status === 'completed') {
                throw new Error("This order is already marked as returned.");
            }

            // --- TRANSACTION OPERATIONS ---

            // A. Update Booking Status
            transaction.update(bookingRef, {
                status: 'completed',
                isReturned: true,
                returnedAt: serverTimestamp(),
                processedBy: user.uid
            });

            // B. Update  Stock (Inventory)

            const currentQty = Number(itemDoc.data().quantity || 0);
            transaction.update(itemRef, {
                quantity: currentQty + 1
            });
        });

        console.log("Return processed successfully & Stock updated.");
        return { success: true };

    } catch (error: any) {
        console.error("Error processing return:", error);
        throw new Error(error.message || "Failed to process return.");
    }
};

