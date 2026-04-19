# Implementation Instructions

Follow the plan outlined in `plan.md` to build the Funpark Management Web Application.

1. **Prerequisites**: Ensure Node.js, npm, and Angular CLI are installed.
2. **Project Setup**: Create a new Angular project and set up a separate server folder for the backend.
3. **Backend Development**: Implement Express server with routes for handling CSV data operations, daily summary generation, and profit calculations.
4. **Frontend Development**: Build Angular components for data input forms, a daily dashboard, and daily/monthly/yearly overview report displays, including separate owner share views for 30% / 70% allocation and investment-type breakdowns.
5. **Data Handling**: Use libraries like `csv-parser` and `csv-writer` for reading/writing CSV files and manage daily_summary.csv for daily totals, plus monthly/yearly summaries, owner share allocations, and investment-type allocations.
6. **Testing**: Write unit tests for calculations, daily/monthly/yearly summary logic, owner share allocation, investment-type allocation rules, and end-to-end tests comparing app output with the provided Excel sample.
7. **Deployment**: Prepare for local development; consider production deployment later.

Refer to the plan for detailed steps, CSV structure, and verification methods.