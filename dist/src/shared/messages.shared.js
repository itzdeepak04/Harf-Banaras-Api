"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MESSAGES = void 0;
exports.MESSAGES = {
    AUTH: {
        REGISTER_SUCCESS: 'Account created successfully',
        LOGIN_SUCCESS: 'Logged in successfully',
        INVALID_CREDENTIALS: 'Invalid email/mobile or password',
        USER_EXISTS: 'An account with this email or mobile already exists',
    },
    PRODUCT: {
        CREATED: 'Product created successfully',
        UPDATED: 'Product updated successfully',
        DELETED: 'Product deleted successfully',
        NOT_FOUND: 'Product not found',
        FETCHED: 'Products fetched successfully',
    },
    CART: {
        ADDED: 'Item added to cart',
        UPDATED: 'Cart updated',
        REMOVED: 'Item removed from cart',
        INSUFFICIENT_STOCK: 'Requested quantity exceeds available stock',
        FETCHED: 'Cart fetched successfully',
    },
    ORDER: {
        PLACED: 'Order placed successfully',
        FETCHED: 'Orders fetched successfully',
        NOT_FOUND: 'Order not found',
        CANCELLED: 'Order cancelled successfully',
        CANNOT_CANCEL: 'This order is no longer eligible for cancellation',
    },
    COMMON: {
        NOT_FOUND: 'Resource not found',
        FORBIDDEN: 'You are not authorized to perform this action',
    },
};
//# sourceMappingURL=messages.shared.js.map