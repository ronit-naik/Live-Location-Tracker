({
    doInit : function(component, event, helper) {
        console.log('in doinit');
        var sid = component.get("v.recordId");
        console.log('sid:'+sid);
        var action = component.get("c.getAddress");
        action.setParams({ "sId" : sid });
        action.setCallback(this, function(response) {
            console.log(response.getReturnValue());
            var rec = response.getReturnValue();
            if(rec != null && rec.Street!=undefined && rec.City!=undefined && rec.State!=undefined && rec.Country!=undefined && rec.PostalCode!=undefined){
                var address = rec.Street+', '+rec.City+', '+rec.State+', '+rec.Country+', '+rec.PostalCode;
                console.log('address:'+address);
                component.set("v.address",address);
            }
            else
            {
                //alert('Please enter the address of Service Appointment!');
                return;
            }
            
            
            console.log('return after save: '+rec);
        });
        $A.enqueueAction(action); 
        
        
    },
    
    jsLoaded : function(component, event, helper) {
        
        
        setTimeout($A.getCallback(function(){
            
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function(position) {
                        
                        console.log(':::::in jsload:::::::::');
                        console.log(position.coords.latitude);
                        var map = L.map('map', {zoomControl: false, tap:false}).setView([position.coords.latitude, position.coords.longitude], 12);
                        
                        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWF0aGV3a3dvayIsImEiOiJjajB3c2FkYXEwMDFtMzNuemI1emRpYTkxIn0.1KPdm8jejDzk7TaQOj23mA', {
                            attribution: '© OpenStreetMap contributors',
                            id: 'mapbox.streets'
                        }).addTo(map);
                        
                        
                        L.esri.Geocoding.reverseGeocode().latlng([position.coords.latitude,position.coords.longitude])
                        .run(function(error, result, response){
                            console.log('::::::::reverse geocoding::::::');
                            console.log(result.address);
                            var source = result.address.District+', '+result.address.City+','+result.address.Region+', '+result.address.Postal;
                            component.set("v.source",source);
                        });
                        
                        //L.marker(new L.LatLng(17.394381, 78.44083), {icon: redIcon}).addTo(map);
                        
                        var greenIcon = L.icon({
                            iconUrl: '/resource/LocTrack__green_marker',
                            iconSize: [25, 41], // size of the icon
                            iconAnchor: [13, 41]
                        });
                        
                        var purpleIcon = L.icon({
                            iconUrl: '/resource/LocTrack__purple_marker',
                            iconSize: [25, 41], // size of the icon
                            iconAnchor: [13, 41]
                        });
                        
                        var redIcon = L.icon({
                            iconUrl: '/resource/LocTrack__red_marker',
                            iconSize: [25, 41], // size of the icon
                            iconAnchor: [13, 41]
                        });
                        
                        
                        var addr = component.get('v.address');
                        console.log('addr:::::::::::'+addr);
                        if(addr == undefined)
                        {
                            console.log('addr:::::::::::'+addr);
                            //alert('Please enter the address of Service Appointment!');
                            console.log('addr222:::::::::::'+addr);
                            return;	
                        }
                        
                        
                        L.esri.Geocoding.geocode().text(addr).run(function(err, results, response){
                            var res = results;
                            
                            console.log('---geocode-----'+res);
                            console.log(res.results[0].latlng);
                            
                            var route = L.Routing.control({
                                waypoints: [
                                    L.latLng(position.coords.latitude, position.coords.longitude),
                                    L.latLng(res.results[0].latlng)
                                    //L.latLng(17.40537, 78.51312)
                                    //L.latLng(17.394381, 78.44083)
                                ],
                                
                                createMarker: function (i, waypoint, n){
                                    var marker_icon = null
                                    if (i == 0) {
                                        // This is the first marker, indicating start
                                        marker_icon = greenIcon
                                    } else if (i == n -1) {
                                        //This is the last marker indicating destination
                                        marker_icon = redIcon
                                    }
                                        else {
                                            marker_icon = purpleIcon
                                        }
                                    var marker = L.marker (waypoint.latLng, {
                                        draggable: true,
                                        bounceOnAdd: false,
                                        bounceOnAddOptions: {
                                            duration: 1000,
                                            height: 800
                                        },
                                        icon: marker_icon
                                    });
                                    return marker;
                                },
                                routeWhileDragging: true,
                                show: false,
                                collapsible: true,
                                showAlternatives: true,
                                lineOptions: {
                                    styles: [{color: 'green', opacity: 0.8, weight: 5}]
                                },
                                altLineOptions: {
                                    styles: [
                                        {color: 'black', opacity: 0.8, weight: 5},
                                        {color: 'white', opacity: 0.8, weight: 4},
                                        {color: 'grey', opacity: 0.8, weight: 5}
                                    ]
                                }
                                
                            }).addTo(map);
                            component.set('v.route', route);
                            
                        });
                        
                    });
                
            } else { 
                alert('Geolocation is not supported by this browser.');
            }        
        }),1000);
        
        component.set("v.map", map);
        
        console.log('----btn---');
        setTimeout($A.getCallback(function(){ 
            console.log('calling helper');
            var addr = component.get('v.address');
            console.log('addr:::::::::::'+addr);
            if(addr == undefined)
            {
                console.log('addr:::::::::::'+addr);
                alert('Please enter the address of Service Appointment!');
                console.log('addr222:::::::::::'+addr);
                return;	
            }
            helper.getLocation(component);
            window.setInterval($A.getCallback(function(){
                helper.getLocation(component);
            }), 1000*20);
        }),10000);
        
    },
    
    waiting: function(component, event, helper) {
        var spinner = component.find("spinner");
        $A.util.removeClass(spinner, "slds-hide");
        $A.util.addClass(spinner, "slds-show");
    },
    
    doneWaiting: function(component, event, helper) {
        var spinner = component.find("spinner");
        $A.util.removeClass(spinner, "slds-show");
        $A.util.addClass(spinner, "slds-hide");
    }
})