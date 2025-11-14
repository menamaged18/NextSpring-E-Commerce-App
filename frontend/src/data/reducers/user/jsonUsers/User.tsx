// // data/reducers/User.tsx
// import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
// import usersList from './usersList.json'
// import { Iuser, initUser } from "@/interfaces/userInterfaces"

// interface IIuser {
//     staticData: Iuser;
//     status: 'idle' | 'loading' | 'succeeded' | 'failed';
//     isLoggedIn: false | true;
//     error: string | null;
// }

// const initialState: IIuser = {
//     staticData: initUser,
//     status: 'idle',
//     isLoggedIn: false,
//     error: null,
// };

// // Async thunk for delayed logout
// export const logoutUserAsync = createAsyncThunk(
//     'users/logoutUserAsync',
//     async (_, { dispatch }) => {
//         // Wait for 1 seconds before dispatching the logout action
//         await new Promise(resolve => setTimeout(resolve, 1000));
//         // Dispatch the actual reducer action to log out the user
//         dispatch(users.actions.logoutUser());
//     }
// );

// const users = createSlice({
//     name: 'users',
//     initialState,
//     reducers: {
//         loginUser: (state, action: PayloadAction<{ email: string; password: string }>) => {
//             const { email, password } = action.payload;
//             const user = usersList.users.find((user) => user.Email === email);

//             if (!user) {
//                 state.status = 'failed';
//                 state.error = 'User not found';
//                 return;
//             }

//             if (user.password !== password) {
//                 state.status = 'failed';
//                 state.error = 'Invalid password';
//                 return;
//             }

//             state.staticData = {
//                 ID: user.ID,
//                 Name: user.Name,
//                 Email: user.Email,
//                 type: user.type as "A" | "N",
//             };
//             state.status = 'succeeded';
//             state.isLoggedIn = true;
//             state.error = null;
//         },
//         // A synchronous action that the async thunk will dispatch
//         logoutUser: (state) => {
//             state.staticData = initUser;
//             state.status = 'idle';
//             state.isLoggedIn = false;
//             state.error = null;
//         }
//     },
//     extraReducers: (builder) => {
//         builder.addCase(logoutUserAsync.pending, (state) => {
//             state.status = 'loading';
//         });
//     }
// });

// export const { loginUser } = users.actions;
// export default users.reducer;