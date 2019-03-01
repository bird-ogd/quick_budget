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

	result["gross_amount"] = val;
	result["income_tax"] = income_tax;
	result["national_insurance"] = national_insurance;
	result["student_loan"] = student_loan;
	result["student"] = stu;
	result["pension"] = pension;
	result["pens_total"] = pens;
	result["net_amount"] = net;
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
		electricity = 40;
		gas = 30;
	} 
	else if(sharers == 2) {
		council_tax = 100;
		water = 35;
		electricity = 50;
		gas = 40;
	}
	else if(sharers == 3) {
		council_tax = 115;
		water = 45;
		electricity = 65;
		gas = 55;
	}
	else if(sharers == 4) {
		council_tax = 140;
		water = 55;
		electricity = 80;
		gas = 65;
	}
	else if(sharers == 5) {
		council_tax = 160;
		water = 65;
		electricity = 90;
		gas = 75;
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
	result["disposable"] = result["disposable"] - repayment;
}

$(".slides").on("input", function() {
	var slider1 = parseInt($("#slider1").val());
	var slider2 = parseInt($("#slider2").val());
	var slider3 = parseInt($("#slider3").val());
	var slider4 = parseInt($("#slider4").val());
	var slider5 = parseInt($("#slider5").val());
	var slider6 = parseInt($("#slider6").val());
	var slider7 = parseInt($("#slider7").val());

	calculate(slider1, slider6, slider7);
	calculateRent(slider2);
	calculateSharers(slider3);
	calculateAfford(result["monthly"], result["rent"], result["sharers"]);
	calculateDebt(slider4, slider5);

	document.getElementById("gross").innerHTML = result["gross_amount"].toLocaleString();
	document.getElementById("net").innerHTML = result["net_amount"].toLocaleString();
	document.getElementById("income_tax").innerHTML = result["income_tax"].toLocaleString();
	document.getElementById("national_insurance").innerHTML = result["national_insurance"].toLocaleString();
	document.getElementById("student_loan").innerHTML = result["student_loan"].toLocaleString();
	document.getElementById("student").innerHTML = result["student"].toLocaleString();
	document.getElementById("pension").innerHTML = result["pension"].toLocaleString();
	document.getElementById("pens_total").innerHTML = result["pens_total"].toLocaleString();
	document.getElementById("monthly").innerHTML = result["monthly"].toLocaleString();
	document.getElementById("rent").innerHTML = result["rent"].toLocaleString();
	document.getElementById("sharers").innerHTML = result["sharers"].toLocaleString();
	document.getElementById("rent_share").innerHTML = result["rent_share"].toLocaleString();
	document.getElementById("bill_share").innerHTML = result["bill_share"].toLocaleString();
	document.getElementById("repayment").innerHTML = result["repayment"].toLocaleString();
	document.getElementById("disposable").innerHTML = result["disposable"].toLocaleString();
	document.getElementById("debt").innerHTML = result["debt"].toLocaleString();
	document.getElementById("interest").innerHTML = result["interest"].toLocaleString();
});