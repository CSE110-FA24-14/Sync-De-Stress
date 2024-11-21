export interface BaseResponseInterface {
    status: String;
    message: String;
    id?: String;
    data?: any;
}

export interface LoginResponseInterface extends BaseResponseInterface {
    email?: String;
    token?: String;
}
