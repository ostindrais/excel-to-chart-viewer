# excel-to-chart-viewer
Converts an Excel spreadsheet to a pie chart.

Everything is done in the browser via JavaScript.
The only database access required is for user registration.

# How to use

1. From the home page, click on Login if you've already created a user-- otherwise, click Register and create a user.
2. Click on Login.
3. Enter your credentials.
4. Drag the Excel spreadsheet you want parsed inside the dashed box on the ChartViewer page.
5. The pie chart will reflect the data on the sheet.

# Requirements

1. There MUST be two sheets in the Excel file, 'title' and 'data'.
2. The 'title' sheet MUST have the title of the chart in cell A1.
3. The 'data' sheet MUST have two column labels at the top row, 'Count' and 'Name ' (note the space after 'Name')

