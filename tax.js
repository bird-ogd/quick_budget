var decile = [];
var final = [];

function calculate(val) {

	var student_loan = 0;
	var stu = 0;
	var loan_thres_1 = 18330;
	var loan_thres_2 = 25000;
	var personal_allowance = 11850;
	var basic = 46350;
	var higher = 150000;
	var zero_ni = 8424;
	var basic_ni = 46384;
	var pension = 0;
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

	var student;
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
				stu = taxable * 0.09;
			}
		}

		if(student_loan == 2) {

			if(val <= loan_thres_2) {
				student = 0;
			} else {
				stuable = val - loan_thres_2;
				stu = taxable * 0.09;
			}
		}

		// Pension

		if (pension != 0) {
			pens = val * pension;
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

		// Final calculation

		var net = val - income_tax - national_insurance - stu - pens;

		final["gross_amount"] = val;
		final["income_tax"] = income_tax;
		final["national_insurance"] = national_insurance;
		final["student_loan"] = stu;
		final["pension"] = pens;
		final["net_amount"] = net;
		final["monthly"] = net / 12;
	}

	function calculateRent(val) {
		final["rent"] = val;
	}

	function calculateSharers(val) {
		final["sharers"] = val;
	}

	function calculateAfford(net_income, rent, sharers) {
		var council_tax;
		var internet = 30;
		var water;
		var electricity;
		var gas;
		var bills;

		if(sharers == 1) {
			council_tax = 67;
			water = 20;
			electricity = 40;
			gas = 30;
		} 
		else if(sharers == 2) {
			council_tax = 102;
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
		else if(sharers = 4) {
			council_tax = 141;
			water = 55;
			electricity = 75;
			gas = 65;
		}
		else if(sharers = 5) {
			council_tax = 167;
			water = 65;
			electricity = 85;
			gas = 75;
		}

		var bills = council_tax + internet + water + gas + electricity;

		rent_share = rent + bills;
		rent_share = rent_share / sharers;
		final["final_result"] = rent_share;
		disposable_income = net_income - rent_share;
		final["disposable"] = disposable_income;
	}

	function calculateDebt(debt, apr) {
		var repayment = debt / 100;
		repayment = repayment * apr;
		repayment = repayment / 12;
		final["debt"] = debt;
		final["interest"] = apr;
		final["repayment"] = repayment;
		final["disposable"] = final["disposable"] - repayment;
	}

	function calculatePension(gross, pension) {
		final["pension"] = pension;
	}

	function calculateStudent(gross, student) {
		final["student_loan"] = student;
	}

	var result;

	$(".slides").on("input", function() {
		var slider1 = parseInt($("#slider1").val());
		var slider2 = parseInt($("#slider2").val());
		var slider3 = parseInt($("#slider3").val());
		var slider4 = parseInt($("#slider4").val());
		var slider5 = parseInt($("#slider5").val());
		var slider6 = parseInt($("#slider6").val());
		var slider7 = parseInt($("#slider7").val());

		calculate(slider1);
		calculateRent(slider2);
		calculateSharers(slider3);
		calculateAfford(final["monthly"], final["rent"], final["sharers"]);
		calculateDebt(slider4, slider5);
		calculatePension(slider1, slider6);
		calculateStudent(slider1, slider7);

		document.getElementById("gross").innerHTML = final["gross_amount"].toLocaleString();
		document.getElementById("net").innerHTML = final["net_amount"].toLocaleString();
		document.getElementById("income_tax").innerHTML = final["income_tax"].toLocaleString();
		document.getElementById("national_insurance").innerHTML = final["national_insurance"].toLocaleString();
		document.getElementById("student_loan").innerHTML = final["student_loan"].toLocaleString();
		document.getElementById("pension").innerHTML = final["pension"].toLocaleString();
		document.getElementById("monthly").innerHTML = final["monthly"].toLocaleString();
		document.getElementById("rent").innerHTML = final["rent"].toLocaleString();
		document.getElementById("sharers").innerHTML = final["sharers"].toLocaleString();
		document.getElementById("bill_share").innerHTML = final["final_result"].toLocaleString();
		document.getElementById("repayment").innerHTML = final["repayment"].toLocaleString();
		document.getElementById("disposable").innerHTML = final["disposable"].toLocaleString();
		document.getElementById("debt").innerHTML = final["debt"].toLocaleString();
		document.getElementById("interest").innerHTML = final["interest"].toLocaleString();
	});