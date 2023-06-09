// Interest Values
let interestValue = {
  specialOffer: [
    false, // special offer state active or not
    22, // from 0 to 10,000
  ],
  micro: [
    49, //from 0 to 9,500
    49, //from 10,000 to 50,000
    49, // from 51,000 to 100,000
    40.5, // from 101,000 to 200,000
    38.5, // from 201,000 to 500,00
    37, // from 501,000 to 1,000,000
    36, // from 1,001,000 to 1,500,000
    35, // from 1,501,000 to 2,000,000
    34, // 2,000,000 and above
  ],
  microRenew: [
    // for clients who will renew in 7 days of old loan
    49, //from 0 to 9,500
    49, //from 10,000 to 50,000
    49, //from 51,000 to 100,000
  ],
  microLecked: [
    // for leaked client who did not renew in 60 days
    49, //from 0 to 9,500
    49, //from 10,000 to 50,000
    49, //from 51,000 to 100,000
  ],
  consume: [
    52, // from outsider sellers
    48, // from halan app
    37.7, // loan for employees
  ],
  seasonal: [49],
};
// const slider = document.getElementById("slider");
document.querySelector(".state-consume").style.height = "0";
document.querySelector(".state-consume").style.opacity = "0";

let loanRenew = document.getElementById("loan-renewal");
let loanLeaked = document.getElementById("loan-leaked");
let loanHalan = document.getElementById("loan-halan");
let loanEmployee = document.getElementById("loan-employee");
let interestRate;

// synchronizes number input with range input
let loanAmount = document.getElementById("loan-amount");
var term = document.getElementById("term");
var amountSlider = document.getElementById("amount-slider");
var monthSlider = document.getElementById("months-slider");

loanAmount.addEventListener("input", () => {
  amountSlider.value = loanAmount.value;
});
amountSlider.addEventListener("input", () => {
  loanAmount.value = amountSlider.value;
});

term.addEventListener("input", () => {
  monthSlider.value = term.value;
});
monthSlider.addEventListener("input", () => {
  term.value = monthSlider.value;
});

//editing range max value
let loanType = document.getElementById("loan-type");
loanType.addEventListener("input", () => {
  if (loanType.value === "small") {
    amountSlider.setAttribute("min", "250000");
    amountSlider.setAttribute("max", "2000000");
    amountSlider.setAttribute("step", "10000");
  } else {
    amountSlider.setAttribute("min", "3000");
    amountSlider.setAttribute("max", "220000");
    amountSlider.setAttribute("step", "1000");
  }
});

// start calculate function
function calculatePMT(event) {
  event.preventDefault(); // Prevent form submission

  // Get input values
  let loanType = document.getElementById("loan-type").value;
  let loanAmount = parseFloat(document.getElementById("loan-amount").value);
  var term = parseInt(document.getElementById("term").value);

  //editing layout
  if (loanType === "consume") {
    document.querySelector(".fees").style.display = "none";
    document.querySelector(".total").style.display = "none";
    document.querySelector(".pmt").style.gridColumn = "1/3";
    document.querySelector(".state-micro").style.height = "0";
    document.querySelector(".state-micro").style.opacity = "0";
    document.querySelector(".state-seasonal").style.opacity = "0";
    document.querySelector(".state-seasonal").style.height = "0";
    document.querySelector(".state-seasonal").style.display = "none";
    document.querySelector(".state-consume").style.height = "auto";
    document.querySelector(".state-consume").style.opacity = "100";
  } else if (loanType === "small") {
    document.querySelector(".fees").style.display = "block";
    document.querySelector(".total").style.display = "block";
    document.querySelector(".pmt").style.gridColumn = "1/2";
    document.querySelector(".state-micro").style.height = "0";
    document.querySelector(".state-micro").style.opacity = "0";
    document.querySelector(".state-seasonal").style.opacity = "0";
    document.querySelector(".state-seasonal").style.height = "0";
    document.querySelector(".state-seasonal").style.display = "none";
    document.querySelector(".state-consume").style.height = "0";
    document.querySelector(".state-consume").style.opacity = "0";
  } else if (loanType === "seasonal") {
    document.querySelector(".fees").style.display = "block";
    document.querySelector(".total").style.display = "none";
    document.querySelector(".pmt").style.gridColumn = "1/2";
    document.querySelector(".state-micro").style.height = "auto";
    document.querySelector(".state-micro").style.opacity = "100";
    document.querySelector(".state-consume").style.height = "0";
    document.querySelector(".state-consume").style.opacity = "0";
    document.querySelector(".state-seasonal").style.opacity = "100";
    document.querySelector(".state-seasonal").style.height = "auto";
    document.querySelector(".state-seasonal").style.display = "block";
  } else {
    document.querySelector(".fees").style.display = "block";
    document.querySelector(".total").style.display = "block";
    document.querySelector(".pmt").style.gridColumn = "1/2";
    document.querySelector(".state-micro").style.height = "auto";
    document.querySelector(".state-micro").style.opacity = "100";
    document.querySelector(".state-seasonal").style.opacity = "0";
    document.querySelector(".state-seasonal").style.height = "0";
    document.querySelector(".state-seasonal").style.display = "none";
    document.querySelector(".state-consume").style.height = "0";
    document.querySelector(".state-consume").style.opacity = "0";
  }

  // Calculate PMT
  if (loanType === "seasonal") {
    var pmt = calculateSeasonalPayment(loanAmount, interestRate, term);
  } else {
    var pmt = calculatePayment(loanAmount, interestRate, term);
  }

  // Calculate Fees
  var feesPercentage;
  if (loanType === "consume") {
    feesPercentage = 0;
  } else {
    if (loanAmount > 220000 || loanRenew.checked) {
      feesPercentage = 0.015; // fees for small & medium
    } else if (
      loanAmount <= 10000 &&
      (loanType == "micro" || loanType == "small")
    ) {
      feesPercentage = 0.03;
    } else {
      feesPercentage = 0.03; // fees for micro
    }
  }

  //editing state of interst
  if (loanAmount <= 100000) {
    loanLeaked.disabled = false;
    loanRenew.disabled = false;
  } else {
    loanLeaked.disabled = true;
    loanRenew.disabled = true;
    loanRenew.checked = false;
  }
  // disable input value to remove double check
  loanRenew.checked
    ? (loanLeaked.checked = false)
    : (loanRenew.checked = false);

  if (loanHalan.checked) {
    loanEmployee.checked = false;
    loanEmployee.attributes.disabled;
  } else if (loanEmployee.checked) {
    loanHalan.checked = false;
    loanHalan.attributes.disabled;
  }

  var fees = loanAmount * feesPercentage;
  // Calculate Fixed interst
  if (
    loanType == "seasonal" &&
    document
      .getElementById("state-seasonal")
      .options[
        document.getElementById("state-seasonal").selectedIndex
      ].getAttribute("data-calcmethod") === "days"
  ) {
    var totalInterst = Math.round(pmt - loanAmount);
  } else {
    var totalInterst = Math.round(pmt * term - loanAmount);
  }

  // PrinciplePlusInterst
  let PrinciplePlusInterst = loanAmount + totalInterst;

  // Comma As Thousand Separator
  const numberFormatter = Intl.NumberFormat("ar-EG");

  // Display result - قيمة القسط
  var resultEl = document.getElementById("result");
  resultEl.textContent = isNaN(pmt)
    ? "برجاء مراجعة البيانات"
    : numberFormatter.format(Math.round(pmt)) + " جنيه";

  // حساب رسوم طلب القرض
  var resultFee = document.getElementById("fees");
  resultFee.textContent = isNaN(fees)
    ? "برجاء مراجعة البيانات"
    : numberFormatter.format(Math.round(fees)) + " جنيه";

  // حساب اجمالى مبلغ ما سيتحصل عليه العميل
  var resultTotal = document.getElementById("total");
  resultTotal.textContent = isNaN(loanAmount - Math.round(pmt + fees))
    ? "برجاء مراجعة البيانات"
    : numberFormatter.format(loanAmount - Math.round(pmt + fees)) + " جنيه";

  //  اجمالى مبلغ الفائدة الموزعة
  var resultInterst = document.getElementById("totalinterst");
  resultInterst.textContent = isNaN(totalInterst)
    ? "برجاء مراجعة البيانات"
    : numberFormatter.format(totalInterst) + " جنيه";

  // الاصل + الفائدة
  var resultPrinciplePlusInterst = document.getElementById(
    "principlePlusInterst"
  );
  resultPrinciplePlusInterst.textContent = isNaN(totalInterst + loanAmount)
    ? "برجاء مراجعة البيانات"
    : numberFormatter.format(PrinciplePlusInterst) + " جنيه";
  // console.log(days);
}

function calculatePayment(loanAmount, interestRate, term) {
  let loanType = document.getElementById("loan-type").value;
  if (loanType == "consume") {
    if (loanHalan.checked) {
      interestRate = interestValue.consume[1];
    } else if (loanEmployee.checked) {
      interestRate = interestValue.consume[2];
    } else {
      interestRate = interestValue.consume[0];
    }
    // calcualte loan if micro
  } else if (loanType == "micro" || loanType == "small") {
    if (loanRenew.checked && loanAmount <= 100000) {
      interestRate = interestValue.microRenew[0];
    } else if (loanLeaked.checked && loanAmount <= 100000) {
      interestRate = interestValue.microLecked[0];
    } else {
      // console.log(interestValue);
      if (loanAmount <= 10000) {
        interestValue.specialOffer[0]
          ? (interestRate = interestValue.specialOffer[1])
          : (interestRate = interestValue.micro[0]);
      } else if (loanAmount >= 10000 && loanAmount <= 50000) {
        interestRate = interestValue.micro[1];
      } else if (loanAmount > 50000 && loanAmount <= 100000) {
        interestRate = interestValue.micro[2];
      } else if (loanAmount > 100000 && loanAmount <= 220000) {
        interestRate = interestValue.micro[3];
      } else if (loanAmount > 220000 && loanAmount <= 500000) {
        interestRate = interestValue.micro[4];
      } else if (loanAmount > 500000 && loanAmount <= 1000000) {
        interestRate = interestValue.micro[5];
      } else if (loanAmount > 1000000 && loanAmount <= 1500000) {
        interestRate = interestValue.micro[6];
      } else if (loanAmount > 1500000 && loanAmount <= 2000000) {
        interestRate = interestValue.micro[7];
      } else {
        interestRate = interestValue.micro[8];
      }
    }
  }
  var months = term;
  var monthlyRate = interestRate / 100 / 12;

  if (
    loanAmount <= 10000 &&
    interestValue.specialOffer[0] &&
    (loanType == "micro" || loanType == "small")
  ) {
    var payment = (loanAmount * (1 + monthlyRate * months)) / months;
  } else {
    var payment =
      loanAmount * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -months)));
  }

  return payment;
}

function calculateSeasonalPayment(loanAmount, interestRate, term) {
  // try {
  var seasonal = document.getElementById("state-seasonal");
  var season = seasonal.value;
  // } catch (err) {
  //   message.innerHTML = "Input is " + err;
  // }
  var calcmethod = document
    .getElementById("state-seasonal")
    .options[
      document.getElementById("state-seasonal").selectedIndex
    ].getAttribute("data-calcmethod");
  interestRate = interestValue.seasonal[0];
  var months = term;

  if (calcmethod === "days") {
    let dailyRate = interestRate / 100 / 365;
    var seasonalPayment =
      loanAmount *
      ((dailyRate * season) / (1 - Math.pow(1 + dailyRate * season, -1)));
  } else {
    // to be continued
    let seasonRate = interestRate / 100 / (12 / season);
    var seasonalPayment =
      loanAmount * (seasonRate / (1 - Math.pow(1 + seasonRate, -months)));
    // console.log(calcmethod);
  }
  return seasonalPayment;
}
