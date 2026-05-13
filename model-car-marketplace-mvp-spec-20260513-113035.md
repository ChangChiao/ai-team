# MVP Product Spec: Model Car Marketplace

Generated on 2026-05-13
Status: Draft

## Working Assumption

We are skipping seller interviews for now and assuming there is enough early seller interest to test a dedicated model car marketplace.

This is not validated demand. The MVP must be designed to test whether sellers actually create listings, keep inventory updated, and use the platform instead of Facebook group posts.

## Product Goal

Build a model-car-specific marketplace that starts replacing Facebook group buying, selling, and exchange behavior.

The first version should prove:

1. Sellers will list real model cars.
2. Buyers can browse and evaluate listings more easily than in Facebook groups.
3. Seller transaction history increases trust.
4. Basic transaction status can be managed without Facebook comment threads.

## Non-Goals

The MVP will not include:

- Payment processing
- Escrow
- Shipping integration
- Dispute arbitration
- Complex ratings
- Auctions
- Bidding
- Native mobile app
- Recommendation engine
- Social feed
- Direct replacement of all Facebook group discussion

## Target Users

### Primary User: Frequent Seller

Frequent sellers, proxy buyers, and bulk traders who regularly post model car listings.

Jobs:

- Create listings quickly
- Show buyers available inventory
- Mark items as reserved or sold
- Build transaction history
- Share listing or seller profile links externally

### Secondary User: Buyer

Collectors who search for specific model cars and need to judge whether a seller is trustworthy.

Jobs:

- Browse available cars
- Search and filter by model-car-specific details
- Check seller profile and transaction count
- Contact seller
- Confirm transaction after completion

## Core MVP Features

### 1. Account System

Required:

- Sign up
- Log in
- Display name
- Seller profile URL

Optional for MVP:

- Facebook profile link
- LINE contact
- Location

### 2. Seller Profile

Public profile page showing:

- Seller display name
- Bio
- Active listings
- Sold listings
- Confirmed transaction count
- Date joined
- Optional external identity links

Purpose:

The seller profile is the trust surface. Sellers should be able to share it in Facebook groups or private chats.

### 3. Listing Creation

Seller can create a model car listing with:

- Title
- Brand
- Model name
- Scale
- Series or release line
- Condition of car
- Condition of box
- Missing parts or defects
- Price
- Trade availability
- Photos
- Location or delivery preference
- Contact method
- Status

Status values:

- Available
- Reserved
- Sold
- Trade only

### 4. Marketplace Browse

Buyer can browse listings with:

- Latest listings
- Search by title, brand, model name
- Filter by scale
- Filter by brand
- Filter by status
- Filter by trade availability

MVP can use simple keyword search and basic filters. It does not need advanced ranking.

### 5. Listing Detail Page

Shows:

- Photos
- Listing fields
- Seller profile summary
- Seller confirmed transaction count
- Status
- Contact method
- Report listing button or placeholder

The page should answer two questions quickly:

1. Is this the car I want?
2. Can I trust this seller enough to start a transaction?

### 6. Transaction Confirmation

After a sale or exchange:

1. Seller marks listing as sold or traded.
2. Seller enters buyer identifier or sends a confirmation link.
3. Buyer confirms transaction.
4. Transaction is added to seller profile.
5. Confirmed transaction count increases.

MVP transaction record fields:

- Listing
- Seller
- Buyer
- Type: sale or exchange
- Confirmation status
- Confirmed at

No star ratings in MVP. The first trust signal is confirmed transaction count.

### 7. External Sharing

Every listing and seller profile should have a copyable public URL.

This is critical because Facebook groups remain the initial distribution channel even if the long-term goal is to replace them.

## Suggested MVP Pages

### Public Pages

- `/` marketplace home
- `/listings` browse all listings
- `/listings/:id` listing detail
- `/sellers/:id` seller profile
- `/search` search results

### Authenticated Seller Pages

- `/dashboard`
- `/dashboard/listings`
- `/dashboard/listings/new`
- `/dashboard/listings/:id/edit`
- `/dashboard/transactions`
- `/dashboard/profile`

### Transaction Pages

- `/transactions/confirm/:token`
- `/transactions/:id`

## Data Model

### User

- id
- email
- display_name
- bio
- location
- facebook_url
- line_id
- created_at

### Listing

- id
- seller_id
- title
- brand
- model_name
- scale
- series
- car_condition
- box_condition
- defects
- price
- currency
- trade_available
- location
- delivery_preference
- contact_method
- status
- created_at
- updated_at

### ListingPhoto

- id
- listing_id
- image_url
- sort_order
- created_at

### Transaction

- id
- listing_id
- seller_id
- buyer_id
- transaction_type
- status
- confirmation_token
- confirmed_at
- created_at

### SellerStats

Can be computed instead of stored at first:

- seller_id
- active_listing_count
- sold_listing_count
- confirmed_transaction_count

## Core User Flows

### Seller Creates Listing

1. Seller signs up.
2. Seller completes profile.
3. Seller creates listing.
4. Listing appears in marketplace.
5. Seller copies listing URL.
6. Seller shares URL in Facebook group or private chat.

### Buyer Evaluates Listing

1. Buyer opens listing.
2. Buyer checks photos and model details.
3. Buyer checks seller transaction count.
4. Buyer contacts seller.
5. Buyer completes transaction outside the platform.

### Seller Records Transaction

1. Seller marks listing as sold.
2. Seller sends confirmation link to buyer.
3. Buyer confirms.
4. Seller profile shows one more confirmed transaction.

## MVP Success Metrics

### Supply Metrics

- Number of sellers registered
- Number of sellers with at least 1 listing
- Number of sellers with at least 5 listings
- Number of total active listings
- Number of sold listings

### Trust Metrics

- Number of buyer-confirmed transactions
- Percentage of sold listings with buyer confirmation
- Number of seller profile views
- Number of listing detail views where buyer clicks contact method

### Replacement Metrics

- Number of public listing links shared externally
- Number of transactions initiated from marketplace listing pages
- Seller-reported reduction in repeated questions
- Seller-reported willingness to list future inventory on the marketplace first

## MVP Acceptance Criteria

The MVP is successful enough to continue if, within the first test cohort:

- 20 sellers register.
- 10 sellers create at least 5 listings.
- 100 real listings are created.
- 10 buyer-confirmed transactions occur.
- At least 5 sellers share marketplace links into Facebook groups or private chats.
- Sellers say the marketplace makes listings easier to manage than Facebook posts.

## Key Risks

### Cold Start

A marketplace has low value without inventory. The first launch must be seller-led, not buyer-led.

Mitigation:

- Recruit sellers first.
- Make seller profiles useful even before marketplace traffic exists.
- Encourage sharing listing URLs into existing Facebook groups.

### Duplicate Work

Sellers may not want to post on both Facebook and the marketplace.

Mitigation:

- Make listing creation faster and cleaner than Facebook posts.
- Make marketplace URLs useful inside Facebook posts.
- Let sellers maintain inventory status in one place.

### Trust Signal Weakness

Confirmed transaction count may not be enough to create trust.

Mitigation:

- Start with confirmed transactions.
- Add qualitative ratings only after enough transactions exist.
- Consider optional identity links for early sellers.

### Too Much Marketplace Too Early

Building full marketplace surfaces before liquidity can waste time.

Mitigation:

- Build marketplace UI, but bias first release toward seller profiles and listing URLs.
- Do not build payment, escrow, logistics, or arbitration until transaction volume proves need.

## Recommended Build Order

1. Account and seller profile
2. Listing CRUD
3. Public listing detail page
4. Marketplace browse and search
5. Public seller profile with active listings
6. Listing status management
7. Transaction confirmation
8. Basic analytics for listing views and contact clicks

## Open Product Decisions

1. Should buyers need accounts before contacting sellers?
2. Should transaction confirmation require buyer account creation?
3. Should listings support exchange from day one?
4. Should seller identity link to Facebook be required or optional?
5. Should the first market focus on one model car segment?

## Next Recommended Step

Run `/plan-eng-review` on this spec before implementation.

The engineering review should lock:

- frontend stack
- backend stack
- database schema
- image upload strategy
- auth strategy
- search implementation
- MVP test plan

