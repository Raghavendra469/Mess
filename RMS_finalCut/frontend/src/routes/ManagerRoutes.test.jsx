// import { render, screen } from "@testing-library/react";
// import { MemoryRouter, Route, Routes } from "react-router-dom";
// import ManagerRoutes from "../routes/ManagerRoutes";
// import { AuthContext } from "../context/authContext";
// import userEvent from "@testing-library/user-event";

// // Mock User Data
// const mockManager = { id: "manager1", role: "manager" };
// const mockArtist = { id: "artist1", role: "artist" };
// const mockUnauthorized = null;

// jest.mock("../context/AuthContext", () => ({
//     AuthContext: {
//       Provider: ({ children, value }) => <div data-testid="auth-provider">{children}</div>,
//     },
//   }));
  

// const renderWithAuth = (ui, { user = mockManager } = {}) => {
//   return render(
//     <AuthContext.Provider value={{ user }}>
//       <MemoryRouter initialEntries={["/manager"]}>
//         <Routes>
//           <Route path="/manager/*" element={<ManagerRoutes />} />
//         </Routes>
//       </MemoryRouter>
//     </AuthContext.Provider>
//   );
// };

// describe("Manager Routes", () => {
//   test("renders Manager Dashboard with Manager Summary by default", () => {
//     renderWithAuth(<ManagerRoutes />);
//     expect(screen.getByText(/Manager Dashboard/i)).toBeInTheDocument();
//     expect(screen.getByText(/Manager Summary/i)).toBeInTheDocument();
//   });

//   test("navigates to View Artists when selecting view artists", async () => {
//     renderWithAuth(<ManagerRoutes />);
//     await userEvent.click(screen.getByText(/View Artists/i));
//     expect(screen.getByText(/Manager Artists/i)).toBeInTheDocument();
//   });

//   test("navigates to Collaboration Requests page", async () => {
//     renderWithAuth(<ManagerRoutes />);
//     await userEvent.click(screen.getByText(/Collaboration Requests/i));
//     expect(screen.getByText(/Collaboration Requests/i)).toBeInTheDocument();
//   });

//   test("navigates to Royalty Transactions page", async () => {
//     renderWithAuth(<ManagerRoutes />);
//     await userEvent.click(screen.getByText(/Royalty Transactions/i));
//     expect(screen.getByText(/User Transactions/i)).toBeInTheDocument();
//   });

//   test("navigates to Update Profile page", async () => {
//     renderWithAuth(<ManagerRoutes />);
//     await userEvent.click(screen.getByText(/Update Profile/i));
//     expect(screen.getByText(/Update Manager Profile/i)).toBeInTheDocument();
//   });

//   test("navigates to Collaboration Cancellation page", async () => {
//     renderWithAuth(<ManagerRoutes />);
//     await userEvent.click(screen.getByText(/Cancel Collaboration/i));
//     expect(screen.getByText(/Collaboration Cancellation/i)).toBeInTheDocument();
//   });

//   test("displays 'Access Denied' if user is not a manager", () => {
//     renderWithAuth(<ManagerRoutes />, { user: mockArtist });
//     expect(screen.getByText(/Access Denied/i)).toBeInTheDocument();
//   });

//   test("redirects to login if user is not authenticated", () => {
//     renderWithAuth(<ManagerRoutes />, { user: mockUnauthorized });
//     expect(screen.getByText(/Please log in/i)).toBeInTheDocument();
//   });
// });