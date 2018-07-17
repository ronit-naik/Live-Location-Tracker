({
    getLocation : function(component) {
        console.log('in getlocation');
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    console.log('-----------');
                    //console.log(component.get("v.currentLatLong"));
                    var map = component.get("v.map");
                    var latlong = component.get("v.currentLatLong");
                    var route = component.get('v.route');
                    console.log(route);
                    
                    var currentLatLong = position.coords.latitude +' '+ position.coords.longitude;
                    //alert('helper called:'+currentLatLong);
                    if(route!=undefined){
                        console.log(':::::not undefined:::::');
                    	route.spliceWaypoints(0, 1, L.latLng(position.coords.latitude, position.coords.longitude));
                    }
                    console.log('----currentlatlong-----'+currentLatLong);
                    console.log('----latlong------'+latlong);
                    //console.log();
                    console.log('---end---');
                    
                    
                    component.set("v.map", map);
                    console.log('reached here');
                    
                }
            );
            
        } else { 
            alert('Geolocation is not supported by this browser.');
        }
        
    }
    
})