import {UserModel} from "../user/userModel";

export interface SignInRequest {
    username: string;
    password: string;
}

export interface VerifyUserRequest {
    username: string;
}


export interface UserResponse {
    user: UserModel;
}

export interface JwtUserResponse extends UserResponse {
    jwt: string;
}

