Frontend Mock Data Phase
Overview
Before the real Flask backend is fully connected, the frontend runs using a mock API layer. Mock data is sample data that imitates the structure and behavior of the real backend responses, allowing the interface to be developed and tested without depending on live server endpoints.

This means the application can already:

render pages,

navigate between routes,

display product, category, supplier, and transaction data,

simulate form submissions,

update the UI as if it were connected to a real backend.

Why this approach is used
The mock-first approach allows frontend development to continue even when backend routes, database connections, or authentication endpoints are not yet complete. This helps separate UI development from backend development and reduces blockers during the build process.

It also improves code quality because the frontend is built against a defined response structure early, making it easier to switch to the real API later without rewriting the components. If the mock API and real API share the same response shape, the page components can stay mostly unchanged.

What happens during the mock phase
During this phase, the frontend does not make real HTTP requests to the Flask backend. Instead, page components call functions from a local api.js file, and those functions return fake data using JavaScript promises that behave similarly to real API responses.

For example:

productsAPI.getAll() returns a list of sample products,

categoriesAPI.getAll() returns sample categories,

suppliersAPI.getAll() returns sample suppliers,

transactionsAPI.create() simulates stock-in or stock-out behavior.

This allows the app to behave like a working system while backend integration is still in progress.

What the user can already see
Even before real backend integration, the frontend can still demonstrate the main user experience:

login flow with a mock user,

dashboard summaries,

product listing,

category listing,

supplier listing,

stock transaction forms,

route protection based on local auth state.

This is useful for UI testing, demos, layout refinement, and validating that the frontend logic works correctly before real server communication begins.

What is not real yet
At this stage, data is temporary and in-memory, which means it is not stored in the real database. If the page refreshes, mock-created records may reset depending on how the mock layer is written. Mock login also does not authenticate against the real Flask user table yet.

Because of that:

created records are not truly persistent,

security and role checks are only simulated,

backend validation and database constraints are not yet being enforced by the server.

How the transition to the real backend works
The frontend is intentionally designed so that page components do not directly depend on the backend implementation. Instead, they call shared functions from api.js, which acts as the communication layer between the UI and the data source.

When the Flask backend is ready, the mock functions in api.js are replaced with real Axios calls such as:

GET /api/products

POST /api/products

GET /api/categories

GET /api/suppliers

GET /api/transactions

POST /auth/login

Because the components already use the same function names and expected response formats, only the API layer needs to change while most of the frontend remains the same.

Benefits of this design
This staged approach provides several advantages:

the frontend can be built and tested early,

pages can be reviewed before backend completion,

integration risk is reduced,

the final code stays cleaner because data access is centralized in one place.

It also helps document a professional workflow: first define the UI and response contract, then connect the live backend once the server-side API is stable.

Current architecture in the client
At the moment, the client follows this flow:

text
React Pages -> api.js (mock functions) -> fake in-memory data
After backend integration, the flow becomes:

text
React Pages -> api.js (Axios requests) -> Flask API -> Database
This design ensures that the frontend remains consistent while the data source changes from simulated to real.

Project note
The mock phase is a development step only. It is used to prepare the frontend structure, user interface, and interaction logic before the application is fully connected to the Flask backend and persistent database. Once the backend integration is completed, the mock layer is replaced by real API communication.

