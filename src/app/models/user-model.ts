export interface UserModel {
    userId: number;
    joined: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    image: Image;
}

export interface Image{
    imageId: number;
    imagePath: string;
}
