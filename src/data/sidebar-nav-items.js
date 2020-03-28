export default ()=>{
    return(
        [{
            title:"Flights Schedule",
            to:"/admin/flights-today",
            htmlBefore:'<i class="fas fa-plane" style="fontSize: 13.5em"></i>',
            htmlAfter:"",
        },
        {
            title:"Schedule flights",
            to:"/admin/schedule-flights",
            htmlBefore:'<i class="fas fa-plus"></i>',
            htmlAfter:"",
        },
        {
            title:"Passengers",
            to:"/admin/passengers",
            htmlBefore:'<i class="fas fa-users"></i>',
            htmlAfter:"",
        },
        {
            title:"Reports",
            to:"/admin/reports",
            htmlBefore:'<i class="fas fa-file-alt"></i>',
            htmlAfter:"",
        },
        // {
        //     title:"Bookings",
        //     to:"/admin/bookings",
        //     htmlBefore:'<i class="fas fa-bookmark"></i>',
        //     htmlAfter:"",
        // },
        {
            title:"Flights History",
            to:"/admin/flights-history",
            htmlBefore:'<i class="fas fa-history"></i>',
            htmlAfter:"",
        },{
            title:"Static Flights",
            to:"/admin/static-flights",
            htmlBefore:'<i class="fas fa-paper-plane"></i>',
            htmlAfter:"",
        }
    ]
    )
}