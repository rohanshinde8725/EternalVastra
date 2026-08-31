# EternalVastra backend

## Setup

1. Copy `.env.example` to `.env` and set `MONGO_URI` to a local MongoDB or MongoDB Atlas connection string.
2. Install dependencies with `npm install`.
3. Import the catalog into MongoDB with `npm run seed`. This creates the `EternalVastra` database with `products` and `ProductsDetail` collections.
4. Start the API with `npm run dev` or `npm start`.

The default API URL is `http://localhost:5000`.

## Product API

- `GET /api/health` checks that the API is running.
- `GET /api/products` returns products ordered by numeric `id`.
- `GET /api/products/:id` returns one product.
- `POST /api/products` creates a product.
- `PUT /api/products/:id` updates a product.
- `DELETE /api/products/:id` removes a product and its uploaded image.

Create and update requests can be `multipart/form-data`. Use the `image` field for an image upload. The remaining fields are `title`, `category`, `tag`, `discountPrice`, `actualPrice`, `rating`, `ratings`, and `details`.

`category` and `details.highlights` accept JSON arrays. `details` accepts a JSON object. If `id` is omitted when creating a product, the API assigns the next numeric ID.

Uploaded images are stored in `backend/uploads` and served at `/uploads/<filename>`.

The original frontend image tree is stored in `backend/uploads/images` and served at `/images/<path>`.