// import { render, screen } from "@testing-library/react";
// import { MemoryRouter, Routes, Route } from "react-router-dom";
// import AdminRoutes from "./AdminRoutes";
// import "@testing-library/jest-dom";

// // Mocking child components
// jest.mock("../components/dashboard/adminPages/AdminSummary", () => () => <div>Admin Summary</div>);
// jest.mock("../components/dashboard/adminPages/CreateUserForm", () => () => <div>Create User Form</div>);
// jest.mock("../components/dashboard/adminPages/DeleteUserForm", () => () => <div>Delete User Form</div>);
// jest.mock("../components/dashboard/adminPages/AdminPayments", () => () => <div>Admin Payments</div>);
// jest.mock("../components/dashboard/adminPages/ViewAdminForm", () => () => <div>View Admin Form</div>);

// // Function to render component with routing
// const renderWithRoute = (initialRoute) => {
//   render(
//     <MemoryRouter initialEntries={[initialRoute]}>
//       <Routes>
//         <Route path="/*" element={<AdminRoutes />} />
//       </Routes>
//     </MemoryRouter>
//   );
// };

// describe("AdminRoutes", () => {
//   test("renders Admin Dashboard with Admin Summary by default", async () => {
//     renderWithRoute("/");
//     expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
//     expect(await screen.findByText("Admin Summary", {}, { timeout: 2000 })).toBeInTheDocument();
//   });

//   test("renders Create User Form", async () => {
//     renderWithRoute("/create-user-account");
//     expect(await screen.findByText("Create User Form", {}, { timeout: 2000 })).toBeInTheDocument();
//   });

//   test("renders Delete User Form", async () => {
//     renderWithRoute("/delete-users");
//     expect(await screen.findByText("Delete User Form", {}, { timeout: 2000 })).toBeInTheDocument();
//   });

//   test("renders Admin Payments", async () => {
//     renderWithRoute("/payments");
//     expect(await screen.findByText("Admin Payments", {}, { timeout: 2000 })).toBeInTheDocument();
//   });

//   test("renders View Admin Form", async () => {
//     renderWithRoute("/view-profile");
//     expect(await screen.findByText("View Admin Form", {}, { timeout: 2000 })).toBeInTheDocument();
//   });
// });
