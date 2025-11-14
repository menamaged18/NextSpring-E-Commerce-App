// users data
export interface Iuser {
    ID: number,
    Name: string,
    Email: string,
    type: "A" | "N" | " ",
    password?: string,
    confirm_password?: string,
}

export const initUser : Iuser = {
    ID: 1,
    Name: "",
    Email: "",
    type: " ",
    password: "",
    confirm_password: "",  
}