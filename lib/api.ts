// lib/api.ts
// Re-exports so the rest of the app imports from one place:
//   import { getProducts, getWordPressPosts } from "@/lib/api"
export * from "./wordpress";
export * from "./woocommerce";
export * from "./cart";
