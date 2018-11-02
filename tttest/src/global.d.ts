declare module "utils" {
  export function shake(handler: () => void, delay: number): () => void;
}

declare module "handy-demo-common";
