export abstract class CartAbstract {
  abstract getCart(userId: string): Promise<any>;
  abstract addItem(userId: string, productId: string, quantity: number): Promise<any>;
  abstract updateQuantity(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<any>;
  abstract removeItem(userId: string, productId: string): Promise<any>;
  abstract clearCart(userId: string): Promise<any>;
}
