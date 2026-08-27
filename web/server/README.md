# Stripe Backend

This backend is ready for Stripe test mode and powers the card payment button on the checkout page.

## Setup

1. Copy `.env.example` to `.env`.
2. Add the Stripe test secret key:

```bash
STRIPE_SECRET_KEY=sk_test_...
```

3. When testing webhooks with the Stripe CLI, add:

```bash
STRIPE_WEBHOOK_SECRET=whsec_...
```

4. Tell the frontend where the backend is:

```bash
VITE_API_BASE_URL=http://127.0.0.1:4242
```

5. Start the backend:

```bash
npm run dev:server
```

The backend runs on `http://127.0.0.1:4242` by default.

For local webhook testing, forward Stripe events to either route:

```bash
stripe listen --forward-to localhost:4242/webhook
```

or:

```bash
stripe listen --forward-to localhost:4242/api/stripe/webhook
```

## Endpoints

- `GET /api/health`
- `POST /api/create-checkout-session`
- `POST /api/stripe/webhook`
- `POST /webhook`

The checkout endpoint expects cart items like:

```json
{
  "items": [
    {
      "name": "Jollof Rice",
      "selectedSize": "Half cooler / 12 litres",
      "price": "£50",
      "quantity": 1
    }
  ]
}
```
