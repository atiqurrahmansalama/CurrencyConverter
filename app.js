const BASE_URL =
    "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const rateDate = document.querySelector(".date-con #rateDate");

for (let select of dropdowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "BDT") {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}


// ==========================================
// Helper Function: Date Formatter
// ==========================================
const getFormattedDates = (apiDateStr) => {
    const dateObj = new Date(apiDateStr);

    const day = String(dateObj.getDate()).padStart(2, '0'); 
    const rawDay = dateObj.getDate();                       
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); 
    const year = dateObj.getFullYear();                     

    const monthLong = dateObj.toLocaleDateString('en-US', { month: 'long' });   
    const monthShort = dateObj.toLocaleDateString('en-US', { month: 'short' }); 
    const shortYear = String(year).slice(-2); 

    return {
        format1: `${rawDay} ${monthLong}, ${year}`,   // "22 June, 2026"
        format2: `${monthLong} ${rawDay}, ${year}`,   // "June 22, 2026"
        format3: `${day}/${month}/${year}`,           // "22/06/2026"
        format4: `${year}-${month}-${day}`,           // "2026-06-22"
        format5: `${day}-${monthShort}-${year}`,       // "22-Jun-2026"
        format6: `${monthShort} ${day}, ${shortYear}` // "Jun 22, 26"
    };
};

// ==========================================
// Main Function: Update Exchange Rate
// ==========================================
const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;
    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }
    
    const currentURL = `${BASE_URL}${fromCurr.value.toLowerCase()}.json`;
    
    let response = await fetch(currentURL);
    let data = await response.json();
    let rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];
    
    let finalAmt = amtVal * rate;
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmt} ${toCurr.value}`;
    
    // Calling the Date Formatter Function
    const dates = getFormattedDates(data.date);

    // Showing Format 1 ("22 June, 2026") on the UI screen
    if (rateDate) {
        rateDate.innerText = `Last Updated: ${dates.format1}`;
    }
};


const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/shiny/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

window.addEventListener("load", () => {
    updateExchangeRate();
});