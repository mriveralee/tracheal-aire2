/*
Tracheal Aire - Experimental Model
Nicholas McGill   (nmcgill.com)
Michael Rivera    (mikeriv.com)

An open-source Williams Airway Intubator.  Using OpenJSCAD (openjscad.org), this script takes in a numer of parameters about a patient's throat and can generate a 3D model, exportable
*/

/*
main
Pull in the parameters from the web interface and return an intubator model
*/
function main(params)
{
  var intubator = trache(
  params.plateHoleD,
  params.tubeP1Length,
  params.h_t,
  params.r_tor,
  params.resolution
  );
  return intubator;
}

/*
getParameterDefinitions
Here we define the user editable parameters
*/
function getParameterDefinitions() {
  return [
  { name: 'plateHoleD',   type: 'float', initial: 15,  caption: "Inner Diameter [mm]:" },
  { name: 'tubeP1Length', type: 'float', initial: 28,  caption: "Bite Block Length [mm]:" },
  { name: 'h_t',          type: 'float', initial: 40,  caption: "Curvature Length [mm]:" },
  { name: 'r_tor',        type: 'float', initial: 35,  caption: "Curvature Bend [mm]:" },
  { name: 'resolution',   type: 'float', initial: 30,  caption: "Resolution:" }   // resolution of the cylinders
  ];
}

/*
trache
With user-defined params and hard-coded vars, makes the front_plate, tube1, and tube2 and unions all pieces in the correct fashion
Inputs
plateHoleD [mm]:      Hole diameter in the front plate / interior of tube
tubeP1Length [mm]:    Length of the straight tube part
h_t [mm]:             Height of the tube curve -- commands the reach down throat of the intubator
r_tor [mm]:           Curvature of the end part of the intubator
Output
finalTube [3D model]: Union of front plate, tube1, and tube2
*/
function trache(plateHoleD, tubeP1Length, h_t, r_tor, resolution){

  // Variables
  plateW = 35;                                // [mm] width of front plate
  plateH = 28;                                // [mm] height of front plate
  plateT = 3.25;                              // [mm] thickness of front plate
  wallThickness = 1.75;                       // [mm] wall thickness of airway
  tubeOuterRad = plateHoleD/2+wallThickness;  // [mm] outer radius of tube
  fine = resolution;

  // Front Plate
  var front_plate = make_front_plate(plateHoleD, plateW, plateH, plateT, wallThickness);

  // Tube Part 1
  var tube1       = make_tube1(plateT, tubeP1Length, tubeOuterRad, fine, plateHoleD);

  // Tube Part 2
  var tube2       = make_tube2(r_tor, h_t, wallThickness, fine, plateT, tubeP1Length, tubeOuterRad, plateHoleD);

  // Union the three pieces together
  var finalTube   = union(front_plate, tube1, tube2);

  return finalTube;
}

function make_front_plate(plateHoleD, plateW, plateH, plateT, wallThickness){

  var plateRounded        = CAG.roundedRectangle({center: [0, 0], radius: [plateW/2, plateH/2], roundradius: 5, resolution: 24});
  var plateHole           = CAG.circle({center: [0, 0], radius: plateHoleD/2, resolution: fine});
  var dimp                = CAG.circle({center: [0, 0.65*plateH], radius: plateHoleD/2, resolution: fine});
  var frontPlate          = (plateRounded.subtract(plateHole)).subtract(dimp);
  var extrudedFrontPlate  = linear_extrude({ height: plateT }, frontPlate);

  return extrudedFrontPlate;
}

function make_tube1(plateT, tubeP1Length, tubeOuterRad, fine, plateHoleD){
  var outerCyl = CSG.cylinder({
    start: [0, 0, plateT],
    end: [0, 0, tubeP1Length+plateT],
    radius: tubeOuterRad,
    resolution: fine        // optional
  });
  var innerCyl = CSG.cylinder({
    start: [0, 0, plateT],
    end: [0, 0, tubeP1Length+plateT],
    radius: plateHoleD/2,
    resolution: fine        // optional
  });
  var tube1 = outerCyl.subtract(innerCyl);

  return tube1;
}


function make_tube2(r_tor, h_t, wallThickness, fine, plateT, tubeP1Length, tubeOuterRad, plateHoleD) {

  var r_o         = tubeOuterRad;         //
  var r_i         = r_o - wallThickness;
  var r_oe        = r_tor + r_o;
  var r_sq        = r_tor - 0.5*r_o;
  var s_sq        = r_o*2;

  var largeRing   = rotate_extrude(translate([r_tor,0,0],circle({r: r_o, fn: fine, center: true})));
  var smallRing   = rotate_extrude(translate([r_tor,0,0],circle({r: r_i, fn: fine, center: true})));
  var squareRing   = translate([0,0,-s_sq/2],rotate_extrude(translate([r_sq,0,0],square(s_sq))));
  var donut       = (largeRing.subtract(smallRing)).subtract(squareRing);

  var TWOD_block  = CAG.fromPoints([ [0,r_oe], [-r_oe,r_oe], [-r_oe,-r_oe], [r_oe,-r_oe], [r_oe,r_oe-h_t], [0,r_oe-h_t] ]);
  var THREED_block= linear_extrude({ height: 2*r_o }, TWOD_block);

  var tube2       = rotate([0,0,90],rotate([0,-90,0],rotate([-90,0,0], donut.subtract(translate([0,0,-r_o],THREED_block)) )));
  tube2           = translate([0,-r_tor,tubeP1Length+plateT], tube2);

  return tube2;
}
