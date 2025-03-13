document.addEventListener("DOMContentLoaded", async function () {
    const employeeTableBody = document.querySelector("#employeeTable tbody");

    async function fetchEmployees() {
        try {
            const response = await fetch("https://adventurexpccl-g0h6fqc7h9a2bxd2.northeurope-01.azurewebsites.net/employees");
            const employees = await response.json();
            // console.log("Employees hentet:", employees);

            employees.forEach(employee => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${employee.name}</td>
                    <td>${employee.phone}</td>
                    <td>${employee.email}</td>
                `;
                employeeTableBody.appendChild(row);
            });
        } catch (error) {
            console.error("Fejl ved hentning af employees:", error);
        }
    }

    await fetchEmployees();
});
