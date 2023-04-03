// Interest Values
let interestValue = {
  micro: [
    49, //from 0 to 9,500
    49, //from 10,000 to 50,000
    49, // from 51,000 to 100,000
    40.5, // from 101,000 to 200,000
    37.5, //from 201,000 to 500,00
    36, //from 501,000 to 1,000,000
    35, // 1,000,000 and above
  ],
  microRenew: [
    47, //from 0 to 9,500
    47, //from 10,000 to 50,000
  ],
  microLecked: [45],
  consume: [
    49, // from outsider sellers
    45, // from halan app
    34.7, // loan for employees
  ],
};

function calculatePMT(event) {
  event.preventDefault(); // Prevent form submission

  // Get input values
  let loanType = document.getElementById("loan-type").value;
  let loanAmount = parseFloat(document.getElementById("loan-amount").value);
  let interestRate;
  let loanRenew = document.getElementById("loan-renewal");
  let loanLeaked = document.getElementById("loan-leaked");

  var term = parseInt(document.getElementById("term").value);

  //   var resultEl = document.getElementById("loan-type2");
  //   resultEl.textContent = loanType;

  //editing value of interst

  if (loanType === "consume") {
    document.querySelector(".fees").style.display = "none";
    document.querySelector(".total").style.display = "none";
    document.querySelector(".pmt").style.gridColumn = "1/3";
    document.querySelector(".state").style.opacity = "0";
  } else {
    document.querySelector(".fees").style.display = "block";
    document.querySelector(".total").style.display = "block";
    document.querySelector(".pmt").style.gridColumn = "1/2";
    document.querySelector(".state").style.opacity = "100";
  }

  // Calculate PMT
  var pmt = calculatePayment(loanAmount, interestRate, term);

  // Calculate Fees
  var feesPercentage;
  if (loanType === "consume") {
    feesPercentage = 0;
  } else {
    if (loanAmount > 200000) {
      feesPercentage = 0.02; // fees for small & medium
    } else {
      feesPercentage = 0.015; // fees for micro
    }
  }

  //editing value of interst
  if (loanAmount <= 50000) {
    // loanLeaked.checked = false;
    loanLeaked.disabled = false;
    // loanRenew.checked = false;
    loanRenew.disabled = false;
  } else {
    loanLeaked.disabled = true;
    loanRenew.disabled = true;
  }

  if (loanRenew.checked) {
    loanLeaked.checked = false;
    loanLeaked.attributes.disabled;

    // loanRenew.addEventListener("click", (loanLeaked.checked = false));
  } else if (loanLeaked.checked) {
    loanRenew.checked = false;
    loanRenew.attributes.disabled;
    // loanLeaked.addEventListener("click", (loanRenew.checked = false));
  }
  var fees = loanAmount * feesPercentage;
  // Calculate Fixed interst
  var totalInterst = pmt.toFixed(0) * term - loanAmount;

  // Comma As Thousand Separator
  const numberFormatter = Intl.NumberFormat("ar-EG");

  // Display result - قيمة القسط
  var resultEl = document.getElementById("result");
  resultEl.textContent = numberFormatter.format(pmt.toFixed(0)) + " جنيه";

  // حساب رسوم طلب القرض
  var resultFee = document.getElementById("fees");
  resultFee.textContent = numberFormatter.format(Math.round(fees)) + " جنيه";

  // حساب اجمالى مبلغ ما سيتحصل عليه العميل
  var resultTotal = document.getElementById("total");
  resultTotal.textContent =
    numberFormatter.format(loanAmount - Math.round(pmt + fees)) + " جنيه";

  //  اجمالى مبلغ الفائدة الموزعة
  var resultInterst = document.getElementById("totalinterst");
  resultInterst.textContent = numberFormatter.format(totalInterst) + " جنيه";

  // الاصل + الفائدة
  var resultPrinciplePlusInterst = document.getElementById(
    "principlePlusInterst"
  );
  resultPrinciplePlusInterst.textContent =
    numberFormatter.format(totalInterst + loanAmount) + " جنيه";

  // making a slider insted of the maniual input //
  // var slider = document.getElementById("loan-amount-range");
  // var output = document.getElementById("demo");
  // output.innerHTML = slider.value;

  // slider.oninput = function () {
  //   output.innerHTML = this.value.toLocaleString("en-US");
  // };

  // var resultFixedInterst = document.getElementById("fixedInterst");
  // resultFixedInterst.textContent = fixedInterst.toFixed(2) + " %";
}
// if (loanRenew.checked == true) {
//   console.log("yes yes");
// }

// function calculateRate(interestRate){

// }
function calculatePayment(loanAmount, interestRate, term) {
  let loanType = document.getElementById("loan-type").value;
  let loanRenew = document.getElementById("loan-renewal");
  let loanLeaked = document.getElementById("loan-leaked");
  if (loanType == "consume") {
    interestRate = interestValue.consume[0];
    // calcualte loan if micro
  } else if (loanType == "micro") {
    if (loanRenew.checked && loanAmount < 50000) {
      interestRate = interestValue.microRenew[0];
    } else if (loanLeaked.checked && loanAmount < 50000) {
      interestRate = interestValue.microLecked[0];
    } else {
      // console.log(interestValue);
      if (loanAmount < 10000) {
        interestRate = interestValue.micro[0];
      } else if (loanAmount >= 10000 && loanAmount <= 50000) {
        interestRate = interestValue.micro[1];
      } else if (loanAmount > 50000 && loanAmount <= 100000) {
        interestRate = interestValue.micro[2];
      } else if (loanAmount > 100000 && loanAmount <= 200000) {
        interestRate = interestValue.micro[3];
      } else if (loanAmount > 200000 && loanAmount <= 500000) {
        interestRate = interestValue.micro[4];
      } else if (loanAmount > 500000 && loanAmount <= 1000000) {
        interestRate = interestValue.micro[5];
      } else {
        interestRate = interestValue.micro[6];
      }
    }
  }
  var months = term;
  var monthlyRate = interestRate / 100 / 12;
  var payment =
    loanAmount * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -months)));
  return payment;
}
