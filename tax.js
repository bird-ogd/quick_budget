var result = [];

function calculate(val, pension, student_loan) {

	var stu = 0;
	var loan_thres_1 = 18330;
	var loan_thres_2 = 25000;
	var personal_allowance = 11850;
	var basic = 46350;
	var higher = 150000;
	var zero_ni = 8424;
	var basic_ni = 46384;
	var personal_allowance_reduce_start = 100000;
	var personal_allowance_reduce_end = 123700;
	var taxable_basic;
	var tax_basic;
	var taxable_higher;
	var tax_higher;
	var taxable_additional;
	var tax_additional;
	var income_tax;
	var national_insurance;
	var ni;
	var niable;
	var ni_add;
	var additional_ni;
	var pens;
	var reduce;

	// Income Tax
	if(val <= personal_allowance) {
		income_tax = 0;
	} else if(val <= basic) {
		taxable_basic = val - personal_allowance;
		tax_basic = taxable_basic * 0.2;
		income_tax = tax_basic;
	} else if(val <= higher && val >= basic) {
		taxable_higher = val - basic;
		taxable_basic = basic - personal_allowance;
		tax_basic = taxable_basic * 0.2;
		tax_higher = taxable_higher * 0.4;
		income_tax = tax_higher + tax_basic;
	} else if(val > higher) {
		taxable_additional = val - higher;
		taxable_higher = higher - basic;
		taxable_basic = basic - personal_allowance;
		tax_basic = taxable_basic * 0.2;
		tax_higher = taxable_higher * 0.4;
		tax_additional = taxable_additional * 0.45;
		income_tax = tax_basic + tax_higher + tax_additional;
	}

	// National Insurance
	if(val <= zero_ni) {
		national_insurance = 0;
	} else if(val <= basic_ni) {
		niable = val - zero_ni;
		ni = niable * 0.12;
		national_insurance = ni;
	} else if (val > basic_ni) {
		additional_ni = val - basic_ni;
		niable = basic_ni - zero_ni;
		ni_add = additional_ni * 0.02;
		ni = niable * 0.12;
		national_insurance = ni_add + ni;
	}

	// Student Loan
	if(student_loan == 1) {
		if(val <= loan_thres_1) {
			student = 0;
		} else {
			stuable = val - loan_thres_1;
			stu = stuable * 0.09;
		}
	}

	if(student_loan == 2) {
		if(val <= loan_thres_2) {
			student = 0;
		} else {
			stuable = val - loan_thres_2;
			stu = stuable * 0.09;
		}
	}

	// Pension
	if (pension != 0) {
		pens = val * pension / 100;
	} else {
		pens = 0;
	}

	// Personal allowance reduction
	if (val > personal_allowance_reduce_start && val < personal_allowance_reduce_end) {
		reduce = val - personal_allowance_reduce_start;
		reduce = (reduce / 2) * 0.4;
		income_tax = income_tax + reduce;
	} else if (val >= personal_allowance_reduce_end) {
		income_tax = income_tax + (personal_allowance * 0.4);
	}

	// result calculation
	var net = val - income_tax - national_insurance - stu - pens;

	result["gross"] = val;
	result["income_tax"] = income_tax;
	result["national_insurance"] = national_insurance;
	result["student_loan"] = student_loan;
	result["student"] = stu;
	result["pension"] = pension;
	result["pens_total"] = pens;
	result["net"] = net;
	result["monthly"] = net / 12;
}

function calculateRent(val) {
	result["rent"] = val;
}

function calculateSharers(val) {
	result["sharers"] = val;
}

function calculateAfford(net_income, rent, sharers) {
	var council_tax;
	var internet = 30;
	var water;
	var electricity;
	var gas;
	var bills;

	if(sharers == 1) {
		council_tax = 65;
		water = 20;
		electricity = 35;
		gas = 25;
	} 
	else if(sharers == 2) {
		council_tax = 100;
		water = 35;
		electricity = 45;
		gas = 35;
	}
	else if(sharers == 3) {
		council_tax = 115;
		water = 45;
		electricity = 60;
		gas = 50;
	}
	else if(sharers == 4) {
		council_tax = 140;
		water = 55;
		electricity = 75;
		gas = 60;
	}
	else if(sharers == 5) {
		council_tax = 160;
		water = 65;
		electricity = 85;
		gas = 70;
	}

	var bills = council_tax + internet + water + gas + electricity;

	rent_share = rent / sharers;
	bill_share = bills / sharers;
	result["rent_share"] = rent_share;
	result["bill_share"] = bill_share;
	disposable_income = net_income - rent_share - bill_share;
	result["disposable"] = disposable_income;
}

function calculateDebt(debt, apr) {
	var repayment = debt / 100;
	repayment = repayment * apr;
	repayment = repayment / 12;
	result["debt"] = debt;
	result["interest"] = apr;
	result["repayment"] = repayment;
	result["disposable"] -= repayment;
}

function updateResults() {
	var slider1 = parseInt(document.querySelector("#slider1").value);
	var slider2 = parseInt(document.querySelector("#slider2").value);
	var slider3 = parseInt(document.querySelector("#slider3").value);
	var slider4 = parseInt(document.querySelector("#slider4").value);
	var slider5 = parseInt(document.querySelector("#slider5").value);
	var slider6 = parseInt(document.querySelector("#slider6").value);
	var slider7 = parseInt(document.querySelector("#slider7").value);
	var items = [	"gross", 
					"net", 
					"income_tax", 
					"national_insurance", 
					"student_loan",
					"student",
					"pension",
					"pens_total",
					"monthly",
					"rent",
					"sharers",
					"rent_share",
					"bill_share",
					"repayment",
					"disposable",
					"debt",
					"interest"];

	calculate(slider1, slider6, slider7);
	calculateRent(slider2);
	calculateSharers(slider3);
	calculateAfford(result["monthly"], result["rent"], result["sharers"]);
	calculateDebt(slider4, slider5);

	for(var i = 0; i < items.length; i++) {
		document.getElementById(items[i]).innerHTML = result[items[i]].toLocaleString();
	}
}

var slides = document.querySelectorAll(".slides");
for(i = 0; i < slides.length; i++) {
	slides[i].addEventListener("input", updateResults);
}