#### Application Functional Requirements

This is a ticketing application.

- User can list a ticket for an event for sale.
- Other users can purchase a ticket.
- Any user can list tickets for sale and purchase tickets.
- When a user attempts to purchase a ticket, the ticket is 'locked' for 15 minutes. The user has 15 minutes to enter their payment info.
- While locked, no other user can purchase the ticket. After minutes, the ticket should 'unlock'.
- Ticket prices can be edited if they are not locked

---

#### Application Design

##### Schema
- User:
  - email: string
  - password: string
- Ticket:
  - title: string
  - price: number
  - userId: foreign key to User
  - orderId: foreign key to Order
- Order:
  - userId: foreign key to user
  - status: created | cancelled | AwaitingPayment | completed
  - ticketId: foreign key to Ticket
  - expiresAt: Date
- Charge:
  - orderId: foreign key to Order
  - status: created | failed | completed
  - amount: number
  - stripeId: string
  - stripeRefundId: string

##### Resources

##### 1. Microservices
For simplicity, we will decompose the requirements into these services:

- `Auth`: everything related to user signup/signin/signout
  - Framework: `Express.js Node.js`
  - Database: `mongodb`
- `Tickets`: ticket creation/editing. knows whether a ticket can be updated
  - Framework: `Express.js Node.js`
  - Database: `mongodb`
- `Orders`: order creation/editing
  - Framework: `Express.js Node.js`
  - Database: `mongodb`
- `Expiration`: watches for orders to be created, cancels them after 15 minutes
  - Framework: `Express.js Node.js`
  - Database: `Redis`
- `Payments`: handle credit card payments. cancels orders if payment fails, complete if succeeds
  - Framework: `Express.js Node.js`
  - Database: `mongodb`

##### 2. Others

- `Web Interface (Client)`: for the user interfaces
  - Framework: `Next.js React.js`
- `common NPM modules`: we will create an NPM module that will be reusable across all services.
- `NATS Streaming Server`: acts as the event bus.

We will use Typescript across all project.

##### Events

We will communicate asynchronously, therefore these are the events that will be available across all microservices (through an event bus)

- `UserCreated`:
- `UserUpdated`:
- `OrderCreated`:
- `OrderCancelled`:
- `OrderExpired`:
- `TicketCreated`:
- `TicketUpdated`:
- `ChangeCreated`: