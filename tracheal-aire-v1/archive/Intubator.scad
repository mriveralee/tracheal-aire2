//Numbers are unitless, but can be interpreted as units in Skeinforge.  Using mm for all these measurements.

// CRITICAL VARS
plateHoleD = 13.46;
tubeP1Length = 50.8;

// Variables
plateW = 34.925;
plateH = 27.95;
plateT = 3.3;
wallThickness = 3;
tubeOuterRad = plateHoleD/2+wallThickness;
angleRadius = 45.72;
partialAngle = 90;


// Front Plate
difference(){

	// Plate + hole
	difference(){
		linear_extrude(height = plateT, center = false, scale = 1.0)
		polygon(points = [[plateW/2, plateH/2], [plateW/2, -plateH/2], [-plateW/2, -plateH/2],[-plateW/2, plateH/2]]);
			
		linear_extrude(height = plateT, center = false, scale = 1.0)
		circle(plateHoleD/2);
	}


	// Fillet #1
	translate([-plateW/2,-plateH/2,plateT/2])
	fillet(5,plateT)
	difference(){
		linear_extrude(height = plateT, center = false, scale = 1.0)
		polygon(points = [[plateW/2, plateH/2], [plateW/2, -plateH/2], [-plateW/2, -plateH/2],[-plateW/2, plateH/2]]);
			
		linear_extrude(height = plateT, center = false, scale = 1.0)
		circle(plateHoleD/2);
	}

	// Fillet #2
	translate([-plateW/2,plateH/2,plateT/2])
	rotate([0,0,-90])
	fillet(5,plateT)
	difference(){
		linear_extrude(height = plateT, center = false, scale = 1.0)
		polygon(points = [[plateW/2, plateH/2], [plateW/2, -plateH/2], [-plateW/2, -plateH/2],[-plateW/2, plateH/2]]);
			
		linear_extrude(height = plateT, center = false, scale = 1.0)
		circle(plateHoleD/2);
	}

	// Fillet #3
	translate([plateW/2,plateH/2,plateT/2])
	rotate([0,0,180])
	fillet(5,plateT)
	difference(){
		linear_extrude(height = plateT, center = false)
		polygon(points = [[plateW/2, plateH/2], [plateW/2, -plateH/2], [-plateW/2, -plateH/2],[-plateW/2, plateH/2]]);
			
		linear_extrude(height = plateT, center = false)
		circle(plateHoleD/2);
	}

	// Fillet #4
	translate([plateW/2,-plateH/2,plateT/2])
	rotate([0,0,90])
	fillet(5,plateT)
	difference(){
		linear_extrude(height = plateT, center = false)
		polygon(points = [[plateW/2, plateH/2], [plateW/2, -plateH/2], [-plateW/2, -plateH/2],[-plateW/2, plateH/2]]);
			
		linear_extrude(height = plateT, center = false)
		circle(plateHoleD/2);
	}

	// Dimple on top
	translate([0,0.6*plateH,0])
	linear_extrude(height = plateT, center = false)
	circle((plateHoleD/2));

}


// Tube Part 1
translate([0,0,plateT])
linear_extrude(height = tubeP1Length, center = false, scale = 1.0)
difference(){
	circle(tubeOuterRad);
	circle(plateHoleD/2);
}


// Tube Part 2
translate([0,-angleRadius,plateT+tubeP1Length])
rotate([0,-90,0])
partial_rotate_extrude(partialAngle, angleRadius, 10)
difference(){
	circle(tubeOuterRad);
	translate([-wallThickness,0,0]) circle(tubeOuterRad);
}


/******* MODULES *******/

module pie_slice(radius, angle, step) {
	for(theta = [0:step:angle-step]) {
		rotate([0,0,0]) linear_extrude(height = radius*2, center=true)
		polygon( points = [[0,0],[radius * cos(theta+step) ,radius * sin(theta+step)],[radius*cos(theta),radius*sin(theta)]]);
	}
}

module partial_rotate_extrude(angle, radius, convex) {
	intersection () {
		rotate_extrude(convexity=convex) translate([radius,0,0]) child(0);
		pie_slice(radius*2, angle, angle/5);
	}
}

module fillet(r, h) {
    translate([r / 2, r / 2, 0])

        difference() {
            cube([r + 0.01, r + 0.01, h], center = true);

            translate([r/2, r/2, 0])
                cylinder(r = r, h = h + 1, center = true);

        }
}




