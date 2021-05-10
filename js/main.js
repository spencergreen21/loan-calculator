window.onload = () => {
  'use strict';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./sw.js');
  }
};

function loadJSON() {
   var decPrincipal = document.getElementById("txtPrincipal").value;
   var intMonths = document.getElementById("txtMonths").value;
   var decAPR = document.getElementById("txtAPR").value;

   if (decPrincipal == ''){
      document.getElementById("txtPrincipal").focus()
      return;
   }


   if (intMonths == ''){
      document.getElementById("txtMonths").focus()
   }

   if (decAPR == ''){
      document.getElementById("txtAPR").focus()
   }
   
            var data_file = "https://loanapi.azurewebsites.net/loan";
            data_file += "/" + decPrincipal + "/" + decAPR + "/" + intMonths;
            var http_request = new XMLHttpRequest();
            try{
               // Opera 8.0+, Firefox, Chrome, Safari
               http_request = new XMLHttpRequest();
            }catch (e) {
               // Internet Explorer Browsers
               try{
                  http_request = new ActiveXObject("Msxml2.XMLHTTP");
					
               }catch (e) {
				
                  try{
                     http_request = new ActiveXObject("Microsoft.XMLHTTP");
                  }catch (e) {
                     // Something went wrong
                     alert("Your browser broke!");
                     return false;
                  }
					
               }
            }
			
            http_request.onreadystatechange = function() {
			
               if (http_request.readyState == 4  ) {
                  // Javascript function JSON.parse to parse JSON data
                  var jsonObj = JSON.parse(http_request.responseText);

                  // jsonObj variable now contains the data structure and can
                  // be accessed as jsonObj.name and jsonObj.country.


// error checking if value entered is an integer 


var LoanClone = document.getElementById("divLoanTemplate").cloneNode(true);

LoanClone.getElementsByClassName("divPrincipal")[0].innerHTML = formatToCurrency(jsonObj.Amount);
LoanClone.getElementsByClassName("divMonths")[0].innerHTML = jsonObj.Months;
LoanClone.getElementsByClassName("divMonthlyPayment")[0].innerHTML = formatToCurrency(jsonObj.MonthlyPayment);
LoanClone.classList.remove("Removed");


// add the click code for hide

LoanClone.getElementsByClassName("btnHide")[0].addEventListener("click", function() {
   if (this.value == "Show") {
      this.value = "Hide";
      LoanClone.getElementsByClassName("divSchedule")[0].classList.remove("Removed");
   } else {
      this.value = "Show";
      LoanClone.getElementsByClassName("divSchedule")[0].classList.add("Removed");

   }
});



//get the schedule array as object 

var ScheduleArray = jsonObj.Schedule.Schedule;

// create a clone for each of the lines 
var ScheduleClone = document.getElementById("divScheduleTemplate").cloneNode(true);
ScheduleClone.classList.remove("Removed");

//and add the line to the loan
LoanClone.getElementsByClassName("divSchedule")[0].appendChild(ScheduleClone);



for (let index = 0; index < ScheduleArray.length; index++) {
   const line = ScheduleArray[index];

   var ScheduleClone = document.getElementById("divScheduleTemplate").cloneNode(true);
   ScheduleClone.classList.remove("Removed");

   //fill in the line
   ScheduleClone.getElementsByClassName("divBalance")[0].innerHTML = formatToCurrency(line.EndingBalance);
   ScheduleClone.getElementsByClassName("divDate")[0].innerHTML = DateFormat(line.PaymentDate);
   ScheduleClone.getElementsByClassName("divInterestPayment")[0].innerHTML = formatToCurrency(line.TotalInterest);

   //and add the line to the loan
   LoanClone.getElementsByClassName("divSchedule")[0].appendChild(ScheduleClone);
}


document.getElementById("divHistory").appendChild(LoanClone);
               }
            }
			
            http_request.open("GET", data_file, true);
            http_request.send();
         }


function DateFormat(GivenDate) {
   return GivenDate.substring(0, 10)
}

function formatToCurrency(amount){
   return '$' + (amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'); 
}

function bold(value){
   TextBox.style.fontWeight = 'bold';
}



// https://stackoverflow.com/questions/2808184/restricting-input-to-textbox-allowing-only-numbers-and-decimal-point
// Example Decimal usage;
// <input type="text"  oninput="ValidateNumber(this, true);" />
// Example Integer usage:
// <input type="text"  oninput="ValidateNumber(this, false);" />
function ValidateNumber(elm, isDecimal) {
   try {

       // For integers, replace everything except for numbers with blanks.
       if (!isDecimal) 
           elm.value = elm.value.replace(/[^0-9]/g, ''); 
       else {
           // 1. For decimals, replace everything except for numbers and periods with blanks.
           // 2. Then we'll remove all leading ocurrences (duplicate) periods
           // 3. Then we'll chop off anything after two decimal places.

           // 1. replace everything except for numbers and periods with blanks.
           elm.value = elm.value.replace(/[^0-9.]/g, '');

           //2. remove all leading ocurrences (duplicate) periods
           elm.value = elm.value.replace(/\.(?=.*\.)/g, '');

           // 3. chop off anything after two decimal places.
           // In comparison to lengh, our index is behind one count, then we add two for our decimal places.
           var decimalIndex = elm.value.indexOf('.');
           if (decimalIndex != -1) { elm.value = elm.value.substr(0, decimalIndex + 3); }
       }
   }
   catch (err) {
       alert("ValidateNumber " + err);
   }
}
   



