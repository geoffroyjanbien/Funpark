const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/**
 * Add employees from Manager Excel data
 */

const dataDir = path.join(__dirname, 'data');
const employeesFile = path.join(dataDir, 'employees.csv');

// Employee list from Excel (Arabic names with English translations)
const employees = [
  { name: 'عمار (Ammar)', position: 'Staff', monthly_salary: 0 },
  { name: 'ابو جعفر (Abu Jaafar)', position: 'Staff', monthly_salary: 0 },
  { name: 'حسين (Hussein)', position: 'Staff', monthly_salary: 0 },
  { name: 'زين (Zain)', position: 'Staff', monthly_salary: 0 },
  { name: 'سلامة (Salama)', position: 'Staff', monthly_salary: 0 },
  { name: 'مجد (Majd)', position: 'Staff', monthly_salary: 0 },
  { name: 'مصطفى (Mustafa)', position: 'Staff', monthly_salary: 0 }
];

function addEmployees() {
  console.log('Adding employees from Manager data...\n');
  
  // Read existing employees
  let existingData = '';
  if (fs.existsSync(employeesFile)) {
    existingData = fs.readFileSync(employeesFile, 'utf8');
  } else {
    existingData = 'id,name,position,monthly_salary,hire_date,status\n';
  }
  
  const existingLines = existingData.trim().split('\n');
  const existingNames = existingLines.slice(1).map(line => {
    const parts = line.split(',');
    return parts[1] ? parts[1].toLowerCase() : '';
  });
  
  let newEmployees = [];
  const hireDate = '2026-01-01';
  
  for (const emp of employees) {
    // Check if employee already exists
    const nameLower = emp.name.toLowerCase();
    if (!existingNames.some(existing => existing.includes(nameLower.split('(')[0].trim()))) {
      const id = uuidv4();
      newEmployees.push({
        id,
        name: emp.name,
        position: emp.position,
        monthly_salary: emp.monthly_salary,
        hire_date: hireDate,
        status: 'active'
      });
    }
  }
  
  if (newEmployees.length === 0) {
    console.log('✓ All employees already exist\n');
    return;
  }
  
  // Append new employees
  const newLines = newEmployees.map(emp => 
    `${emp.id},${emp.name},${emp.position},${emp.monthly_salary},${emp.hire_date},${emp.status}`
  );
  
  const updatedData = existingData.trim() + '\n' + newLines.join('\n') + '\n';
  fs.writeFileSync(employeesFile, updatedData, 'utf8');
  
  console.log(`✓ Added ${newEmployees.length} new employees:`);
  newEmployees.forEach(emp => console.log(`  - ${emp.name}`));
  console.log('');
}

// Run
try {
  addEmployees();
  console.log('✅ Employee import completed\n');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
