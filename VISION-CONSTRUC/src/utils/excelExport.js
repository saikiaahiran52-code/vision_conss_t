import * as XLSX from 'xlsx';

export function generateBOQExcel(project) {
  const { projectName, projectType, length, width, height, numFloors, concreteGrade, results, createdAt } = project;
  const dateStr = new Date(createdAt || Date.now()).toLocaleDateString();

  const wb = XLSX.utils.book_new();
  
  const wsData = [
    ['VISION — Bill of Quantities'],
    [],
    ['Project Information'],
    ['Project Name', projectName],
    ['Project Type', projectType],
    ['Dimensions (L×W×H)', `${length} × ${width} × ${height} m`],
    ['Floors', numFloors],
    ['Concrete Grade', concreteGrade],
    ['Date', dateStr],
    [],
    ['Sl. No.', 'Material', 'Quantity', 'Unit'],
    [1, 'Concrete Volume', results.concreteVolume, 'm³'],
    [2, 'Cement', results.cement, 'bags'],
    [3, 'Steel', results.steel, 'kg'],
    [4, 'Rod Diameter', results.rodDiameter, 'mm'],
    [5, 'Sand', results.sand, 'm³'],
    [6, 'Aggregate', results.aggregate, 'm³'],
    [7, 'Bricks', results.bricks, 'nos'],
    [8, 'Water', results.waterCement, 'liters']
  ];
  
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  
  // Set column widths
  ws['!cols'] = [
    { wch: 20 },
    { wch: 25 },
    { wch: 15 },
    { wch: 10 }
  ];
  
  XLSX.utils.book_append_sheet(wb, ws, 'BOQ');
  
  XLSX.writeFile(wb, `VISION_BOQ_${projectName}_${dateStr.replace(/\//g, '-')}.xlsx`);
}
