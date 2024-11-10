export interface BaseResponseInterface {
    status: String;
    message: String;
}

export interface LoginResponseInterface extends BaseResponseInterface {
    email?: String;
    token?: String;
}
