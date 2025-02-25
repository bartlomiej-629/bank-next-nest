# Bank App - Full Stack Banking Application

## Overview
A simple banking application built using Nest.js for the backend and Next.js for the frontend. The application allows users to **deposit**, **withdraw**, **transfer** money between IBAN accounts, and view their account statement. The backend is powered by Prisma ORM and PostgreSQL as the database. The frontend is styled with TailwindCSS for responsive design.

## Table of Contents
- **Architectural Decisions**
- **Bank Configuration Clarifications**
- **Implemented Unit Testing**

## Architectural Decisions

### Backend (Nest.js):

- **Nest.js** is chosen as the backend framework for its modularity, scalability, and ease of integration with TypeScript. It is ideal for building RESTful APIs and handling business logic for a banking application.

- **Prisma** is used as an ORM to interact with PostgreSQL. It helps manage database models and migrations easily and integrates well with Nest.js.

- The **PrismaService** is injected into service classes for database operations like deposits, withdrawals, and transaction logging.

### Frontend (Next.js):

- **Next.js** is used for building the frontend. It provides a seamless experience with server-side rendering (SSR) and client-side rendering (CSR).

- **TailwindCSS** is used for styling, ensuring that the app is responsive across devices with minimal effort.

- The app supports **mobile-first design**, ensuring that the app is usable on mobile screens as small as 360px in width.

### Database (PostgreSQL):

- **PostgreSQL** is used as the relational database for storing account information, transaction logs, and IBAN numbers.

- **Prisma Migrations** ensure that the schema is versioned and kept in sync with the database.

## Bank Configuration Clarifications

### Account Model:

- Each **Account** is represented by an IBAN (International Bank Account Number) and has a balance.

- The **IBAN** is unique to each account and cannot be reused.

- **Users** can deposit or withdraw funds into/from their respective IBAN accounts.

### Transaction Model:

- Every transaction, whether a deposit, withdrawal, or transfer, is recorded in the Transaction table.

- A transaction includes:

    - **Amount**: The monetary value of the transaction.
    - **Balance**: The balance after the transaction is applied.
    - **Type**: The type of the transaction (deposit, withdrawal, or transfer_out, transfer_in).
    - **Date**: The date and time when the transaction occurred.
    - **Account**: The account the transaction belongs to.

### Transfer Logic:

- Transfers only occur between IBAN accounts. If a user attempts to transfer to a non-existent or invalid IBAN, the system will reject the transaction.

- The application ensures that the sender’s account has sufficient balance before processing a withdrawal or transfer.

### Statement:

- The account statement displays all transactions for a specific IBAN account, sorted by date, with the most recent transactions shown first.

## Implemented Unit Testing

### Backend (Nest.js):

    - accounts.service.test.tsx
    - accounts.controller.test.tsx

### Frontend (Next.js):

    - AccountForm/index.test.tsx
    - TransactionList/index.test.tsx