import { writable } from "svelte/store";

let voucher_store = writable([]);
// let voucher_array_store = writable([]);
let voucher_array_store = writable([]);

voucher_array_store.set([
    {
"id": "1",
"redeemable": "1 kg wild berries",
"offerer": "Pacheedaht First Nation",
"name": "Pacheedaht Berries",
"symbol": "BER",
"unit": "1",
"denomination": "kg",
"amount": "100",
"validated": "Validated"
},
{
"id": "2",
"redeemable": "1 hour regenerative forestry service",
"offerer": "Western Forest Products",
"name": "Regen Forestry",
"symbol": "FST",
"unit": "1",
"denomination": "hour",
"amount": "10000",
"validated": "Validated"
},   
{
"id": "3",
"redeemable": "1 kg wild mushrooms",
"offerer": "Pacheedaht First Nation",
"name": "Pacheedaht Fungi",
"symbol": "FUN",
"unit": "1",
"denomination": "kg",
"amount": "1000",
"validated": "Validated"
}, 
{
"id": "4",
"redeemable": "Services from Pacheedaht Coop",
"offerer": "Pacheedaht Coop",
"name": "Pacheedaht Coop Currency",
"symbol": "KCC",
"unit": "1.00",
"denomination": "CAD",
"amount": "1000",
"validated": "Validated"
},  
]);


export { voucher_store, voucher_array_store };

// user_store.subscribe((value) => localStorage.setItem(user, value));