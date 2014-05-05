/**
 * Conserve aspect ratio of the orignal region. Useful when shrinking/enlarging
 * images to fit into a certain area.
 *
 * @param {Number} srcWidth Source area width
 * @param {Number} srcHeight Source area height
 * @param {Number} maxWidth Fittable area maximum available width
 * @param {Number} maxHeight Fittable area maximum available height
 * @return {Object} { width, heigth }
 */
function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
   var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
   return { width: srcWidth*ratio, height: srcHeight*ratio };
}

// ---------------------------------------------------------------------------------------------------------
var version = '0.017 (2013/06/10)';
var me = document.location.toString().match(/^file:/)?'web-offline':'web-online'; // me: {cli, web-offline, web-online}
var browser = 'unknown';
if(navigator.userAgent.match(/(opera|chrome|safari|firefox|msie)/i))
   browser = RegExp.$1.toLowerCase();


function setCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    } else var expires = "";
    document.cookie = escape(name) + "=" + escape(value) + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = escape(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return unescape(c.substring(nameEQ.length, c.length));
    }
    return null;
}

function deleteCookie(name) {
    createCookie(name, "", -1);
}
// ---------------------------------------------------------------------------------------------------------




$( document ).ready(function() {
  var TA_INPUTS = {
    HEIGHT: 350,
    WIDTH: 370
  };

  var TA_VIEWER = {
    HEIGHT: 350,
    WIDTH: 560
  };

  // Resize functionality
  $(TRACHEAL_AIRE.VIEWER_DIV).parent().resize(function() {
    var canvas = $(TRACHEAL_AIRE.VIEWER_DIV).find('canvas');
    //Get the canvas & context
    // var ct = canvas.get(0).getContext('webgl');
    var container = $(canvas).parent();
    var srcWidth = 1440;
    var srcHeight = 900;
    var maxHeight = $(TRACHEAL_AIRE.VIEWER_DIV).height();
    var maxWidth = $(TRACHEAL_AIRE.VIEWER_DIV).width();
    var wh = calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight);
    // Lock Canvas
    canvas.width(wh.width);
    canvas.height(wh.height);

    // Set Container
    container.width(wh.width);
    container.height(wh.height);

    // Constrain window
    $(TRACHEAL_AIRE.VIEWER_DIV).parent().height(wh.height);
    $(TRACHEAL_AIRE.VIEWER_DIV).parent().width(wh.width);



  });


  // Init resizing for the tracheal aire view window
  var to = 500;
  for (var i = 0; i < 10; i++) {
    window.setTimeout(
      function() {
        $(TRACHEAL_AIRE.VIEWER_DIV).parent().trigger('resize');
    }, to + i*500);
  }



  // TODO: add a something to show TA window
  $(TRACHEAL_AIRE.VIEWER_DIV).dialog({ position:
      {my: "left top", at: "right bottom", of: "#pageMain"},
      autoOpen: true, width: TA_VIEWER.WIDTH, height: TA_VIEWER.HEIGHT });

  $(TRACHEAL_AIRE.INPUTS_DIV).dialog({ position:
      {my: "left top", at: "right top", of: "#pageMain"},
      autoOpen: true, width: TA_INPUTS.WIDTH, height: TA_INPUTS.HEIGHT });

  var TA_VIEWER_SHOWN = true;
  // Set up toggle-ability
  for (var key in TRACHEAL_AIRE) {

    $(TRACHEAL_AIRE[key]).parent().find('.ui-dialog-titlebar').dblclick(function() {
      // Hide the children
      var children = this.parentNode.children;
      for (var i = 0; i < children.length; i++) {
        var child = $(children[i]);
        if (!child.hasClass('ui-dialog-titlebar')){
          child.toggle('display');
        }
        // Handle canvas of viewer div
        if (child.id === $(TRACHEAL_AIRE.VIEWER_DIV).id) {
          $(TRACHEAL_AIRE.VIEWER_DIV).parent().height('auto');
          TA_VIEWER_SHOWN = !TA_VIEWER_SHOWN;
        }
    }

    });
  };


  // TUBE URI Components
  var TUBE_MODELS = {
   'Williams Airway': "%2F*%0ATracheal%20Aire%20-%20WILLIAMS%20AIRWAY%20MODEL%0ANicholas%20McGill%20(nmcgill.com)%0AMichael%20Rivera%20%20(mikeriv.com)%0A%0AAn%20open-source%20Williams%20Airway%20Intubator.%20%20Using%20OpenJSCAD%20(openjscad.org)%2C%20this%20script%20takes%20in%20a%20numer%20of%20parameters%20about%20a%20patient's%20throat%20and%20can%20generate%20a%203D%20model%2C%20exportable%0A*%2F%0A%0A%2F*%0Amain%0APull%20in%20the%20parameters%20from%20the%20web%20interface%20and%20return%20an%20intubator%20model%0A*%2F%0Afunction%20main(params)%0A%7B%0A%20%20var%20intubator%20%3D%20trache(%0A%20%20params.plateHoleD%2C%0A%20%20params.tubeP1Length%2C%0A%20%20params.h_t%2C%0A%20%20params.r_tor%2C%0A%20%20params.resolution%0A%20%20)%3B%0A%20%20return%20intubator%3B%0A%7D%0A%0A%2F*%0AgetParameterDefinitions%0AHere%20we%20define%20the%20user%20editable%20parameters%0A*%2F%0Afunction%20getParameterDefinitions()%20%7B%0A%20%20return%20%5B%0A%20%20%7B%20name%3A%20'plateHoleD'%2C%20%20%20type%3A%20'float'%2C%20initial%3A%2015%2C%20%20caption%3A%20%22Inner%20Diameter%20%5Bmm%5D%3A%22%20%7D%2C%0A%20%20%7B%20name%3A%20'tubeP1Length'%2C%20type%3A%20'float'%2C%20initial%3A%2028%2C%20%20caption%3A%20%22Bite%20Block%20Length%20%5Bmm%5D%3A%22%20%7D%2C%0A%20%20%7B%20name%3A%20'h_t'%2C%20%20%20%20%20%20%20%20%20%20type%3A%20'float'%2C%20initial%3A%2035%2C%20%20caption%3A%20%22Curvature%20Length%20%5Bmm%5D%3A%22%20%7D%2C%0A%20%20%7B%20name%3A%20'r_tor'%2C%20%20%20%20%20%20%20%20type%3A%20'float'%2C%20initial%3A%2035%2C%20%20caption%3A%20%22Curvature%20Bend%20%5Bmm%5D%3A%22%20%7D%2C%0A%20%20%7B%20name%3A%20'resolution'%2C%20%20%20type%3A%20'float'%2C%20initial%3A%2030%2C%20%20caption%3A%20%22Resolution%3A%22%20%7D%20%20%20%2F%2F%20resolution%20of%20the%20cylinders%0A%20%20%5D%3B%0A%7D%0A%0A%2F*%0Atrache%0AWith%20user-defined%20params%20and%20hard-coded%20vars%2C%20makes%20the%20front_plate%2C%20tube1%2C%20and%20tube2%20and%20unions%20all%20pieces%20in%20the%20correct%20fashion%0AInputs%0AplateHoleD%20%5Bmm%5D%3A%20%20%20%20%20Hole%20diameter%20in%20the%20front%20plate%20%2F%20interior%20of%20tube%0AtubeP1Length%20%5Bmm%5D%3A%20%20%20Length%20of%20the%20straight%20tube%20part%0Ah_t%20%5Bmm%5D%3A%20%20%20%20%20%20%20%20%20Height%20of%20the%20tube%20curve%20--%20commands%20the%20reach%20down%20throat%20of%20the%20intubator%0Ar_tor%20%5Bmm%5D%3A%20%20%20%20%20%20%20%20%20%20Curvature%20of%20the%20end%20part%20of%20the%20intubator%0AOutput%0AfinalTube%20%5B3D%20model%5D%3A%20Union%20of%20front%20plate%2C%20tube1%2C%20and%20tube2%0A*%2F%0Afunction%20trache(plateHoleD%2C%20tubeP1Length%2C%20h_t%2C%20r_tor%2C%20resolution)%7B%0A%0A%20%20%2F%2F%20Variables%0A%20%20plateW%20%3D%2035%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20%5Bmm%5D%20width%20of%20front%20plate%0A%20%20plateH%20%3D%2028%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20%5Bmm%5D%20height%20of%20front%20plate%0A%20%20plateT%20%3D%203.25%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20%5Bmm%5D%20thickness%20of%20front%20plate%0A%20%20wallThickness%20%3D%201.75%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20%5Bmm%5D%20wall%20thickness%20of%20airway%0A%20%20tubeOuterRad%20%3D%20plateHoleD%2F2%2BwallThickness%3B%20%20%2F%2F%20%5Bmm%5D%20outer%20radius%20of%20tube%0A%20%20fine%20%3D%20resolution%3B%0A%0A%20%20%2F%2F%20Front%20Plate%0A%20%20var%20front_plate%20%3D%20make_front_plate(plateHoleD%2C%20plateW%2C%20plateH%2C%20plateT%2C%20wallThickness)%3B%0A%0A%20%20%2F%2F%20Tube%20Part%201%0A%20%20var%20tube1%20%20%20%20%20%20%20%3D%20make_tube1(plateT%2C%20tubeP1Length%2C%20tubeOuterRad%2C%20fine%2C%20plateHoleD)%3B%0A%0A%20%20%2F%2F%20Tube%20Part%202%0A%20%20var%20tube2%20%20%20%20%20%20%20%3D%20make_tube2(r_tor%2C%20h_t%2C%20wallThickness%2C%20fine%2C%20plateT%2C%20tubeP1Length%2C%20tubeOuterRad%2C%20plateHoleD)%3B%0A%0A%20%20%2F%2F%20Union%20the%20three%20pieces%20together%0A%20%20var%20finalTube%20%20%20%3D%20union(front_plate%2C%20tube1%2C%20tube2)%3B%0A%0A%20%20return%20finalTube%3B%0A%7D%0A%0Afunction%20make_front_plate(plateHoleD%2C%20plateW%2C%20plateH%2C%20plateT%2C%20wallThickness)%7B%0A%0A%20%20var%20plateRounded%20%20%20%20%20%20%20%20%3D%20CAG.roundedRectangle(%7Bcenter%3A%20%5B0%2C%200%5D%2C%20radius%3A%20%5BplateW%2F2%2C%20plateH%2F2%5D%2C%20roundradius%3A%205%2C%20resolution%3A%2024%7D)%3B%0A%20%20var%20plateHole%20%20%20%20%20%20%20%20%20%20%20%3D%20CAG.circle(%7Bcenter%3A%20%5B0%2C%200%5D%2C%20radius%3A%20plateHoleD%2F2%2C%20resolution%3A%20fine%7D)%3B%0A%20%20var%20dimp%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3D%20CAG.circle(%7Bcenter%3A%20%5B0%2C%200.65*plateH%5D%2C%20radius%3A%20plateHoleD%2F2%2C%20resolution%3A%20fine%7D)%3B%0A%20%20var%20frontPlate%20%20%20%20%20%20%20%20%20%20%3D%20(plateRounded.subtract(plateHole)).subtract(dimp)%3B%0A%20%20var%20extrudedFrontPlate%20%20%3D%20linear_extrude(%7B%20height%3A%20plateT%20%7D%2C%20frontPlate)%3B%0A%0A%20%20return%20extrudedFrontPlate%3B%0A%7D%0A%0Afunction%20make_tube1(plateT%2C%20tubeP1Length%2C%20tubeOuterRad%2C%20fine%2C%20plateHoleD)%7B%0A%20%20var%20outerCyl%20%3D%20CSG.cylinder(%7B%0A%20%20%20%20start%3A%20%5B0%2C%200%2C%20plateT%5D%2C%0A%20%20%20%20end%3A%20%5B0%2C%200%2C%20tubeP1Length%2BplateT%5D%2C%0A%20%20%20%20radius%3A%20tubeOuterRad%2C%0A%20%20%20%20resolution%3A%20fine%20%20%20%20%20%20%20%20%2F%2F%20optional%0A%20%20%7D)%3B%0A%20%20var%20innerCyl%20%3D%20CSG.cylinder(%7B%0A%20%20%20%20start%3A%20%5B0%2C%200%2C%20plateT%5D%2C%0A%20%20%20%20end%3A%20%5B0%2C%200%2C%20tubeP1Length%2BplateT%5D%2C%0A%20%20%20%20radius%3A%20plateHoleD%2F2%2C%0A%20%20%20%20resolution%3A%20fine%20%20%20%20%20%20%20%20%2F%2F%20optional%0A%20%20%7D)%3B%0A%20%20var%20tube1%20%3D%20outerCyl.subtract(innerCyl)%3B%0A%0A%20%20return%20tube1%3B%0A%7D%0A%0A%0Afunction%20make_tube2(r_tor%2C%20h_t%2C%20wallThickness%2C%20fine%2C%20plateT%2C%20tubeP1Length%2C%20tubeOuterRad%2C%20plateHoleD)%20%7B%0A%0A%20%20var%20r_o%20%20%20%20%20%20%20%20%20%3D%20tubeOuterRad%3B%20%20%20%20%20%20%20%20%20%2F%2F%0A%20%20var%20r_i%20%20%20%20%20%20%20%20%20%3D%20r_o%20-%20wallThickness%3B%0A%20%20var%20r_oe%20%20%20%20%20%20%20%20%3D%20r_tor%20%2B%20r_o%3B%0A%20%20var%20r_sq%20%20%20%20%20%20%20%20%3D%20r_tor%20-%202*r_o%3B%0A%20%20var%20s_sq%20%20%20%20%20%20%20%20%3D%20r_o*2%3B%0A%0A%20%20var%20largeRing%20%20%20%3D%20rotate_extrude(translate(%5Br_tor%2C0%2C0%5D%2Ccircle(%7Br%3A%20r_o%2C%20fn%3A%20fine%2C%20center%3A%20true%7D)))%3B%0A%20%20var%20smallRing%20%20%20%3D%20rotate_extrude(translate(%5Br_tor%2C0%2C0%5D%2Ccircle(%7Br%3A%20r_i%2C%20fn%3A%20fine%2C%20center%3A%20true%7D)))%3B%0A%20%20var%20squareRing%20%20%20%3D%20translate(%5B0%2C0%2C-s_sq%2F2%5D%2Crotate_extrude(translate(%5Br_sq%2C0%2C0%5D%2Csquare(s_sq))))%3B%0A%20%20var%20donut%20%20%20%20%20%20%20%3D%20(largeRing.subtract(smallRing)).subtract(squareRing)%3B%0A%0A%20%20var%20TWOD_block%20%20%3D%20CAG.fromPoints(%5B%20%5B0%2Cr_oe%5D%2C%20%5B-r_oe%2Cr_oe%5D%2C%20%5B-r_oe%2C-r_oe%5D%2C%20%5Br_oe%2C-r_oe%5D%2C%20%5Br_oe%2Cr_oe-h_t%5D%2C%20%5B0%2Cr_oe-h_t%5D%20%5D)%3B%0A%20%20var%20THREED_block%3D%20linear_extrude(%7B%20height%3A%202*r_o%20%7D%2C%20TWOD_block)%3B%0A%0A%20%20var%20tube2%20%20%20%20%20%20%20%3D%20rotate(%5B0%2C0%2C90%5D%2Crotate(%5B0%2C-90%2C0%5D%2Crotate(%5B-90%2C0%2C0%5D%2C%20donut.subtract(translate(%5B0%2C0%2C-r_o%5D%2CTHREED_block))%20)))%3B%0A%20%20tube2%20%20%20%20%20%20%20%20%20%20%20%3D%20translate(%5B0%2C-r_tor%2CtubeP1Length%2BplateT%5D%2C%20tube2)%3B%0A%0A%20%20return%20tube2%3B%0A%7D%0A",
   'Experimental Tube': "%2F*%0ATracheal%20Aire%20-%20Experimental%20Model%0ANicholas%20McGill%20%20%20(nmcgill.com)%0AMichael%20Rivera%20%20%20%20(mikeriv.com)%0A%0AAn%20open-source%20Williams%20Airway%20Intubator.%20%20Using%20OpenJSCAD%20(openjscad.org)%2C%20this%20script%20takes%20in%20a%20numer%20of%20parameters%20about%20a%20patient's%20throat%20and%20can%20generate%20a%203D%20model%2C%20exportable%0A*%2F%0A%0A%2F*%0Amain%0APull%20in%20the%20parameters%20from%20the%20web%20interface%20and%20return%20an%20intubator%20model%0A*%2F%0Afunction%20main(params)%0A%7B%0A%20%20var%20intubator%20%3D%20trache(%0A%20%20params.plateHoleD%2C%0A%20%20params.tubeP1Length%2C%0A%20%20params.h_t%2C%0A%20%20params.r_tor%2C%0A%20%20params.resolution%0A%20%20)%3B%0A%20%20return%20intubator%3B%0A%7D%0A%0A%2F*%0AgetParameterDefinitions%0AHere%20we%20define%20the%20user%20editable%20parameters%0A*%2F%0Afunction%20getParameterDefinitions()%20%7B%0A%20%20return%20%5B%0A%20%20%7B%20name%3A%20'plateHoleD'%2C%20%20%20type%3A%20'float'%2C%20initial%3A%2015%2C%20%20caption%3A%20%22Inner%20diameter%20%5Bmm%5D%3A%22%20%7D%2C%0A%20%20%7B%20name%3A%20'tubeP1Length'%2C%20type%3A%20'float'%2C%20initial%3A%2028%2C%20%20caption%3A%20%22Bite%20Block%Length%20%5Bmm%5D%3A%22%20%7D%2C%0A%20%20%7B%20name%3A%20'h_t'%2C%20%20%20%20%20%20%20%20%20%20type%3A%20'float'%2C%20initial%3A%2040%2C%20%20caption%3A%20%22Curvature%20Length%20%5Bmm%5D%3A%22%20%7D%2C%0A%20%20%7B%20name%3A%20'r_tor'%2C%20%20%20%20%20%20%20%20type%3A%20'float'%2C%20initial%3A%2035%2C%20%20caption%3A%20%22Curvature%20Bend%20%5Bmm%5D%3A%22%20%7D%2C%0A%20%20%7B%20name%3A%20'resolution'%2C%20%20%20type%3A%20'float'%2C%20initial%3A%2030%2C%20%20caption%3A%20%22Resolution%3A%22%20%7D%20%20%20%2F%2F%20resolution%20of%20the%20cylinders%0A%20%20%5D%3B%0A%7D%0A%0A%2F*%0Atrache%0AWith%20user-defined%20params%20and%20hard-coded%20vars%2C%20makes%20the%20front_plate%2C%20tube1%2C%20and%20tube2%20and%20unions%20all%20pieces%20in%20the%20correct%20fashion%0AInputs%0AplateHoleD%20%5Bmm%5D%3A%20%20%20%20%20%20Hole%20diameter%20in%20the%20front%20plate%20%2F%20interior%20of%20tube%0AtubeP1Length%20%5Bmm%5D%3A%20%20%20%20Length%20of%20the%20straight%20tube%20part%0Ah_t%20%5Bmm%5D%3A%20%20%20%20%20%20%20%20%20%20%20%20%20Height%20of%20the%20tube%20curve%20--%20commands%20the%20reach%20down%20throat%20of%20the%20intubator%0Ar_tor%20%5Bmm%5D%3A%20%20%20%20%20%20%20%20%20%20%20Curvature%20of%20the%20end%20part%20of%20the%20intubator%0AOutput%0AfinalTube%20%5B3D%20model%5D%3A%20Union%20of%20front%20plate%2C%20tube1%2C%20and%20tube2%0A*%2F%0Afunction%20trache(plateHoleD%2C%20tubeP1Length%2C%20h_t%2C%20r_tor%2C%20resolution)%7B%0A%0A%20%20%2F%2F%20Variables%0A%20%20plateW%20%3D%2035%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20%5Bmm%5D%20width%20of%20front%20plate%0A%20%20plateH%20%3D%2028%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20%5Bmm%5D%20height%20of%20front%20plate%0A%20%20plateT%20%3D%203.25%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20%5Bmm%5D%20thickness%20of%20front%20plate%0A%20%20wallThickness%20%3D%201.75%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20%5Bmm%5D%20wall%20thickness%20of%20airway%0A%20%20tubeOuterRad%20%3D%20plateHoleD%2F2%2BwallThickness%3B%20%20%2F%2F%20%5Bmm%5D%20outer%20radius%20of%20tube%0A%20%20fine%20%3D%20resolution%3B%0A%0A%20%20%2F%2F%20Front%20Plate%0A%20%20var%20front_plate%20%3D%20make_front_plate(plateHoleD%2C%20plateW%2C%20plateH%2C%20plateT%2C%20wallThickness)%3B%0A%0A%20%20%2F%2F%20Tube%20Part%201%0A%20%20var%20tube1%20%20%20%20%20%20%20%3D%20make_tube1(plateT%2C%20tubeP1Length%2C%20tubeOuterRad%2C%20fine%2C%20plateHoleD)%3B%0A%0A%20%20%2F%2F%20Tube%20Part%202%0A%20%20var%20tube2%20%20%20%20%20%20%20%3D%20make_tube2(r_tor%2C%20h_t%2C%20wallThickness%2C%20fine%2C%20plateT%2C%20tubeP1Length%2C%20tubeOuterRad%2C%20plateHoleD)%3B%0A%0A%20%20%2F%2F%20Union%20the%20three%20pieces%20together%0A%20%20var%20finalTube%20%20%20%3D%20union(front_plate%2C%20tube1%2C%20tube2)%3B%0A%0A%20%20return%20finalTube%3B%0A%7D%0A%0Afunction%20make_front_plate(plateHoleD%2C%20plateW%2C%20plateH%2C%20plateT%2C%20wallThickness)%7B%0A%0A%20%20var%20plateRounded%20%20%20%20%20%20%20%20%3D%20CAG.roundedRectangle(%7Bcenter%3A%20%5B0%2C%200%5D%2C%20radius%3A%20%5BplateW%2F2%2C%20plateH%2F2%5D%2C%20roundradius%3A%205%2C%20resolution%3A%2024%7D)%3B%0A%20%20var%20plateHole%20%20%20%20%20%20%20%20%20%20%20%3D%20CAG.circle(%7Bcenter%3A%20%5B0%2C%200%5D%2C%20radius%3A%20plateHoleD%2F2%2C%20resolution%3A%20fine%7D)%3B%0A%20%20var%20dimp%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3D%20CAG.circle(%7Bcenter%3A%20%5B0%2C%200.65*plateH%5D%2C%20radius%3A%20plateHoleD%2F2%2C%20resolution%3A%20fine%7D)%3B%0A%20%20var%20frontPlate%20%20%20%20%20%20%20%20%20%20%3D%20(plateRounded.subtract(plateHole)).subtract(dimp)%3B%0A%20%20var%20extrudedFrontPlate%20%20%3D%20linear_extrude(%7B%20height%3A%20plateT%20%7D%2C%20frontPlate)%3B%0A%0A%20%20return%20extrudedFrontPlate%3B%0A%7D%0A%0Afunction%20make_tube1(plateT%2C%20tubeP1Length%2C%20tubeOuterRad%2C%20fine%2C%20plateHoleD)%7B%0A%20%20var%20outerCyl%20%3D%20CSG.cylinder(%7B%0A%20%20%20%20start%3A%20%5B0%2C%200%2C%20plateT%5D%2C%0A%20%20%20%20end%3A%20%5B0%2C%200%2C%20tubeP1Length%2BplateT%5D%2C%0A%20%20%20%20radius%3A%20tubeOuterRad%2C%0A%20%20%20%20resolution%3A%20fine%20%20%20%20%20%20%20%20%2F%2F%20optional%0A%20%20%7D)%3B%0A%20%20var%20innerCyl%20%3D%20CSG.cylinder(%7B%0A%20%20%20%20start%3A%20%5B0%2C%200%2C%20plateT%5D%2C%0A%20%20%20%20end%3A%20%5B0%2C%200%2C%20tubeP1Length%2BplateT%5D%2C%0A%20%20%20%20radius%3A%20plateHoleD%2F2%2C%0A%20%20%20%20resolution%3A%20fine%20%20%20%20%20%20%20%20%2F%2F%20optional%0A%20%20%7D)%3B%0A%20%20var%20tube1%20%3D%20outerCyl.subtract(innerCyl)%3B%0A%0A%20%20return%20tube1%3B%0A%7D%0A%0A%0Afunction%20make_tube2(r_tor%2C%20h_t%2C%20wallThickness%2C%20fine%2C%20plateT%2C%20tubeP1Length%2C%20tubeOuterRad%2C%20plateHoleD)%20%7B%0A%0A%20%20var%20r_o%20%20%20%20%20%20%20%20%20%3D%20tubeOuterRad%3B%20%20%20%20%20%20%20%20%20%2F%2F%0A%20%20var%20r_i%20%20%20%20%20%20%20%20%20%3D%20r_o%20-%20wallThickness%3B%0A%20%20var%20r_oe%20%20%20%20%20%20%20%20%3D%20r_tor%20%2B%20r_o%3B%0A%20%20var%20r_sq%20%20%20%20%20%20%20%20%3D%20r_tor%20-%200.5*r_o%3B%0A%20%20var%20s_sq%20%20%20%20%20%20%20%20%3D%20r_o*2%3B%0A%0A%20%20var%20largeRing%20%20%20%3D%20rotate_extrude(translate(%5Br_tor%2C0%2C0%5D%2Ccircle(%7Br%3A%20r_o%2C%20fn%3A%20fine%2C%20center%3A%20true%7D)))%3B%0A%20%20var%20smallRing%20%20%20%3D%20rotate_extrude(translate(%5Br_tor%2C0%2C0%5D%2Ccircle(%7Br%3A%20r_i%2C%20fn%3A%20fine%2C%20center%3A%20true%7D)))%3B%0A%20%20var%20squareRing%20%20%20%3D%20translate(%5B0%2C0%2C-s_sq%2F2%5D%2Crotate_extrude(translate(%5Br_sq%2C0%2C0%5D%2Csquare(s_sq))))%3B%0A%20%20var%20donut%20%20%20%20%20%20%20%3D%20(largeRing.subtract(smallRing)).subtract(squareRing)%3B%0A%0A%20%20var%20TWOD_block%20%20%3D%20CAG.fromPoints(%5B%20%5B0%2Cr_oe%5D%2C%20%5B-r_oe%2Cr_oe%5D%2C%20%5B-r_oe%2C-r_oe%5D%2C%20%5Br_oe%2C-r_oe%5D%2C%20%5Br_oe%2Cr_oe-h_t%5D%2C%20%5B0%2Cr_oe-h_t%5D%20%5D)%3B%0A%20%20var%20THREED_block%3D%20linear_extrude(%7B%20height%3A%202*r_o%20%7D%2C%20TWOD_block)%3B%0A%0A%20%20var%20tube2%20%20%20%20%20%20%20%3D%20rotate(%5B0%2C0%2C90%5D%2Crotate(%5B0%2C-90%2C0%5D%2Crotate(%5B-90%2C0%2C0%5D%2C%20donut.subtract(translate(%5B0%2C0%2C-r_o%5D%2CTHREED_block))%20)))%3B%0A%20%20tube2%20%20%20%20%20%20%20%20%20%20%20%3D%20translate(%5B0%2C-r_tor%2CtubeP1Length%2BplateT%5D%2C%20tube2)%3B%0A%0A%20%20return%20tube2%3B%0A%7D%0A"
 };


  // Tube that is loaded initially
  var INITIAL_TUBE = 'Williams Airway';

  // The last selected tube
  var LAST_TUBE = null;

  /**
   * Gets the decoded tube model
   **/

  function getTubeModel(tubeName) {
    tube = (TUBE_MODELS[tubeName]) ? TUBE_MODELS[tubeName] : TUBE_MODELS.WILLIAMS;
    return decodeURIComponent(tube);
  }

  /**
   * Updates the Tube when selected in the drop down
   **/
  function updateTube(tubeName) {
    // Don't update if no change in tube
    if (LAST_TUBE === tubeName) return;

    // Store the old params values and data
    // if (LAST_TUBE) {
    //   var oldData = editor.getValue();
    //   $(TUBE_DATA[LAST_TUBE]).text(oldData);
    // }

    // Set the editor contents to be what the tubeName now refers to
    var tubeData = getTubeModel(tubeName);
    if (gProcessor && tubeData) {
      // Update the jscad (and render)
      gProcessor.setJsCad(tubeData);

      // Update last selected tube
      LAST_TUBE = tubeName;
    }
  }

   /****** LISTENER *******/
  // Set up on lose focus, trigger switchTube
  $('#tube-list').change(function() {
    updateTube(this.value);
    TA_SELECTED_PARAMETER_ID = null;
  });


  (function () {
    // Init resizing for the tracheal aire view window
    var to = 500;
    for (var i = 0; i < 10; i++) {
      window.setTimeout(
        function() {
          if (!LAST_TUBE) {
            // Declare Initial Tube for loading
            updateTube(INITIAL_TUBE);
          }
      }, to + i*500);
    }


  }());

});
