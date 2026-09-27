export function calculateMaterials({
  projectType,
  length,
  width,
  height,
  numFloors,
  concreteGrade
}) {
  // Volume = Length × Width × Height
  const concreteVolume = length * width * height;

  // Placeholder formulas
  const cement = concreteVolume * 7;
  const sand = concreteVolume * 0.44;
  const aggregate = concreteVolume * 0.88;
  const steel = concreteVolume * 80;

  // Rod Diameter logic
  let rodDiameter = '12mm'; // Default (including House)
  if (projectType === 'Beam') {
    rodDiameter = '16mm';
  } else if (projectType === 'Column') {
    rodDiameter = '20mm';
  } else if (projectType === 'Slab') {
    rodDiameter = '10mm';
  } else if (projectType === 'Footing') {
    rodDiameter = '16mm';
  } else if (projectType === 'House') {
    rodDiameter = '12mm';
  }

  return {
    concreteVolume: Number(concreteVolume.toFixed(2)),
    cement: Number(cement.toFixed(2)),
    steel: Number(steel.toFixed(2)),
    rodDiameter,
    sand: Number(sand.toFixed(2)),
    aggregate: Number(aggregate.toFixed(2)),
    bricks: 0,
    waterCement: 0
  };
}
