export declare abstract class UsersAbstract {
    abstract getProfile(userId: string): Promise<any>;
    abstract updateProfile(userId: string, dto: any): Promise<any>;
    abstract addAddress(userId: string, dto: any): Promise<any>;
    abstract removeAddress(userId: string, addressIndex: number): Promise<any>;
    abstract listStaff(): Promise<any>;
    abstract setActive(userId: string, isActive: boolean): Promise<any>;
}
