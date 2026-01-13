# **App Name**: Scholastic Finance Tracker

## Core Features:

- User Authentication: Secure sign-up and sign-in functionality using Firebase Auth with Admin (Bursar/Principal) and Viewer (Staff) roles.
- Student Ledger Management: Create, read, update, and delete student records including name, grade, total fees due, fees paid, and balance in Firestore.
- Transaction Logging: Record income and expenses with details like type, amount, category (e.g., tuition, uniforms), date, and description; stored in Firestore.
- Dashboard Analytics: Display real-time visual cards showing Total Revenue, Total Expenses, and Net Profit based on data from Firestore.
- Profit Calculation Tool: Automatically calculate and update Profit = Total Income - Total Expenses. The tool updates the summary document in Firestore to reflect real-time changes.
- Admin Transaction Control: Firebase Security Rules ensure only authenticated Admins can delete transactions.

## Style Guidelines:

- Primary color: Soft blue (#A0C4FF) to evoke trust and professionalism, nodding to Material Design 3's emphasis on calmness and clarity.
- Background color: Light blue (#E9F1FF), a very desaturated tint of the primary hue, for a clean and airy feel.
- Accent color: Muted purple (#BFA0FF), an analogous color to the primary blue, that offers visual interest without being too distracting.
- Body and headline font: 'PT Sans' for a modern yet readable interface, ensuring clear presentation of financial data.
- Use clear, simple icons from Material Design to represent different categories of income and expenses.
- Employ a clean and organized layout, making it easy to navigate the app and view financial data.
- Subtle animations and transitions to enhance user experience and provide visual feedback during interactions.