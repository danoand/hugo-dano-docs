---
weight: 100
title: "Company Glossary"
icon: "article"
date: "2024-07-08T14:17:29-05:00"
lastmod: "2024-07-08T14:17:29-05:00"
draft: false
toc: true
---

### -- ChatGPT -- "Commands"

* `bv loan`: paste loan related text string
* `bv app status`: paste a listing of application statuses
* `bv application`: paste application table related text string
* `bv wiki page`: paste my personal wiki page (this page)

### -- 0-9 --

* **3 Business Days**
  * `select * from dw_reporting_meta.add_business_days(current_date,3) -- Adds 3 business days to a given date`

### -- A --

* **Accrued Interest Not Yet Paid**
  * DA: I have seen this definition: `payoff` - `principal_balance` + `interest_accrued_today` (all in `loan_status_archive`)
* **ACH**: Automated Clearing House
* **ACH Daily Funding Report**: 
  * `dw_reporting_views.ach_daily_funding_report`
  * looks like this report/table feeds Looker dashboards
* **ACH File Table**: assume table that persist processed ACH file contents.  Can join to this table to close in on loans that are officially originated/funded
  * `dw_reporting_bsf_ach`.`achfilerecord`
  * ACH Transactions
  	* **ACH Credits**: “Push” of funds from the Originator’s account at the ODFI to the Receiver’s account at the RDFI. A common ACH credit application is direct deposit of payroll.
  		* **Originator** initiates an Entry to push funds into a Receiver’s account
  		* **Receiver**’s account is credited
  		* **Originator**’s account is debited (this is considered the offset/settlement Entry)
  	* **ACH Debits**: ”Pull” of funds from the Receiver’s account at the RDFI to the Originator’s account at the ODFI. A common ACH debit application is payment of an insurance premium.
  		* **Originator** initiates an Entry to pull funds from a Receiver’s account
  		* **Receiver**’s account is debited
  		* **Originator**’s account is credited (this is considered the offset/settlement Entry)
* **ACH Return File Table**: assume ACH instructions that have failed with an ACH return code
  * `dw_reporting_bsf_ach`.`returnfilerecord`
* **ACH Settlement File**:
  * (Per Krithika) each record represents a NACHA file sent for the day (for a particular ACH transmission - Braviant has multiple transmissions per day for various reasons)
    * Krithika: _The process runs at 10:30 and 10:35_
    * `file_type` = 1 is the `sunup` -> `ccb` cash flows
    * `file_type` = 2 is the `bcs` --> `ccb` cash flows
* **Acronyms**: came across this archived wiki page for acronyms. [Acronyms](https://balancecredit.atlassian.net/wiki/spaces/PD/pages/2705981515/Acronyms)
* **Advancements**: 
  * `dw_reporting_bsf_identity.loan_advancement_transaction`
* **Application**:
  * `dw_reporting_views.fact_application`: current state application "fact" table - will be replaced by `dw_core.fact_application`
  * `dw_core.fact_application`: new version of `fact_application` and will reference various dimension tables
  * `dw_reporting_bsf_origination.application`: BSF origination schema for application data. 
    * this should be data synced/refreshed from LoanPro
  * `dw_reporting_objects.application_entity`: not sure what this schema is but another application data source
    * includes `application_status` and `application_sub_status`
  * new `dw_core.fact_application`table assumptions and business rules:
    * `application_withdrawn` will be 1 if the app is withdrawn during the app lifecycle and downstream if the app loan is withdrawn or not funded successfully
* **Application Source**: BSF listing: `dw_reporting_bsf_common.application_source_type`
  * Leads
  * Affiliates
  * Refinance
  * Longform
  * Reapply
  * Offerwall
* **Application Status & Sub-Status**
  * see cacher page here (title: **Useful DB Snippets**) for sql and listing: https://snippets.cacher.io/snippet/a4e2c22c9b12888af25f
* **Application Validation**:
  * `dw_reporting_bsf_origination.application_validation`: materialized view that holds errors thrown during the processing of the application
    * Nic told me about this
	* Not sure what processing we're talking about.  Need to get more details
* **APR**: Annual Percentage Rate
  * `dw_reporting_bsf_identity.loan.apr`: I think this is one way to get the APR
* **Asserted & Effective Bi-Temporal Columns**
  * Used in various tables that write multiple row (or row instances) over time
  * IMPORTANT: some context from Tejas
    * `effective`: provides a sense of history (when was this record in effect from a time perspective)
    * `asserted`: provides a sense of if this record was valid (good) or not (bad)
    * DA: so assume if I wanted a historical record of valid rows I would NOT filter out by effective but filter out by asserted
  * This method to compare bi-temporal columns seems to be much more efficient:
    * `upper(l.asserted) = 'infinity' and upper(l.effective) = 'infinity'`
  * At any given time only 1 row should be valid 
    * From KG: _if you want data as of end of day 12/11, it has to be `‘2023-12-12 05:00:00’::timestamptz <@ l.asserted`_

### -- B --

* **Bank Account Transactions**: From Lara: *you can check bank transactions in adhoc/finance schema in this table `finance.accounting_bank_account_transactions`*
  * re: Finance schema
  * see also `finance.fft_clean` table: does fft = Finance Fact Transaction?
* **Basepoint**: assume this is Basepoint Capital. also assume Basepoint participates in Braviant loans
* **batch jobs** cron jobs?
  * See Confluence jobs: https://balancecredit.atlassian.net/wiki/spaces/BSF/pages/779617231/Batch+Job+Processes
* **BC**: Balance Credit (Note**: SunUp Financial, LLC is a lending entity for BC lending products)
* **BCS**: assume `BCS` is short for `B Credit Solutions`
* **B Credit Solutions, LLC**: Braviant legal entity that buys back loans from CC Bank triggered by certain events  (assume one event is a charge off)
  * _some notes_: also see this [confluence page](https://balancecredit.atlassian.net/wiki/spaces/PD/pages/1195868185/TLS+CC+Connect+Bank+Program)
    * B-Credit Solutions(this is us) is a Guarantee Company that will purchase the loan when it meets the Default Definition of the program(different concept as Delinquency) and becomes the Owner of the loan.
      * When the B-Credit Solutions, the Guarantee Company becomes the owner of the loan, SunUp, the Sub-Servicer transfers the loan tape to SunUp, the Collections Company, who will conduct Collections for the Guarantee Company(B-Credit Solutions). 
      * The Servicer(TLS) and Sub-Servicer no longer have any obligations to the loan.
* **Bi-Temporal Columns**: see **Asserted & Effective Bi-Temporal Columns**
* **BK**: Bankruptcy
  * NOTE: The Ops Team refunds (? `Advancement` | `Overpayment`) payments that were submitted after the official Bankruptcy date has been declared (where to do we store this date?)
* **BSF**: Braviant Service Framework

### -- C --

* **C & D**: Cease and Desist
* **CCB**: Capital Community Bank
* **CDD & EDD**: Customer Due Diligence and Enhanced Due Diligence
  * part of the BSA (Bank Secrecy Act)
* **CF**: Custom Field (assume custom in LoanPro)
* **CIP** Customer Identification Program
* **Charge Off**: loans are charged off when they reach 60 days past due 
	* **Different "Types"/Categories of Charge Offs**
	  * _Accounting Charge Off_: sometimes referred as a _Finance_ or _GAAP_ charge off
	    * loan is considered charged off when it his 61 days past due and stays charged off even if days past due drops under 61 days
		* from an Ops perspective, we still attempt to work/collect on the loan
	  * _Ops Charge Off_: loan is considered charged off from an operational perspective (ie. we cease to drive income on the loan)
	    * indicated by various _Closed_ substatuses: Debt Sale, Discharged, Settlement (is this Debt Settlement?)
	  * _Bank Charge Off_: charged off from a CC Bank perspective. This occurs at a buyback transaction
	* Can find this information in a multiple places:
		* `dw_reporting_views`.`fact_application`: Fact Application table 
			* `loan_num`: the loan_id field
			* `loan_charge_off_date`: the date the loan was deemed charged off (must be a process that triggers this)
			* `loan_charge_off_principal_amount`: the principal amount charged off (only remaining principal amount is charged off)
		* **Gross Charge Off**: assume this is the principal amount balance at the time of charge off
		* **Net Charge Off**: assume this would include payments that happen to come in after the charge off date (e.g. customer continues to pay after that date)
		* **Loan Charge Off Dates**
			* `dw_reporting_views`.`loan_charge_off_dates`: view *charge off date* and *charge off principal amount* by *loan id*
			* also see **Purchase Date** below
* **Chorus Credit**: assume old product line that has been or is being phased out
  * **NOTE**: Chorus Credit loan data reside in these **schemas**:
    * `dw_reporting_chorus_lp`
    * `dw_reporting_chorus_view`
* **Clearing**: *(general banking industry definition)* Clearing is all of the steps involved in transferring funds ownership from one party to another except for the final step, which is settlement. [web link](https://www.moderntreasury.com/journal/difference-between-settlement-and-clearing)
* **Closed Date**: assume loan closed date
  * `dw_reporting_lp`.`loan_settings_entity`.`closed_date`
* **Credit Transactions**: credits applied in LoanPro during servicing (see: **Loan Credit Transaction**)
* **Contract Date**: assume origination date
  * `dw_reporting_lp`.`loan_setup_entity`.`contract_date`
  * this is the date on which interest starts accruing (see/as opposed to the `Funding Date`)
  * assume this is equivalent to `effective_date` in other tables/contexts
* **Cost Per Fund (CPF)**: 
  * What you pay to acquire a customer (funded customer?)
    * *For DM (Direct Mail)*: the cost to buy a prospective customer's name/address and the cost to print and send the customer letter
	* *For Offer Wall Leads*: pay a percentage of the loan's funded principal
	* *For Ping Tree Leads*: pay $X to purchase a customer lead
* **CSO**: Credit Service Organization
  * _a type of business that helps consumers improve their credit rating, obtain credit, and manage debt. These services can include:_
    * _Credit Repair Services_
	  * _Debt Management Plans_
	  * _Credit Counseling_
	  * _Loan Brokering_: Braviant's main role(?)
  * Assume CSO loans are `TX` loans with an original owner of `Redpoint`
    * looks there are some `TN` `Redpoint` loans as well [sql gist](https://snippets.cacher.io/snippet/ecabdbc689f03fa2e603)
    * Identify CSO?: `dw_reporting_bsf_uwp`.`loan_contract_calculation`.`installment_loan_type` = `CSO`
	* Business Model
	  * CSO loans have low interest rates...
	  * ... but large fees (`escrow` fees in Braviant parlance, e.g. `payment_e`)
	  * assume fees are paid to the lender upfront AND then Bravian collects that payment over time as the "escrow component" of each installment payment
  * Example CSO Loan
    * `loan_id`: `658288` (not a refi loan)
	* TIL:
	  * Amount Financed (goes to customer): `1,500.00`
	  * CSO Fee on Application: `1,053.45` (part of finance charge)
	  * Principal Amount: (amount to customer = `1,500.00`) + (prepaid finance charge = CSO fee = `1,053.45`) = `2,553.45`
	  * Schedule payments: `charge_amount` = `523.70`; `charge_p` = (varies according to amortization); `charge_i` = (varies according to amortization); `charge_e` = CSO per payment fee = `210.69`
* **Current Owner** database column that I assume displays the current owner of a loan through the loan lifecycle (e.g. `B Credit Solutions, LLC` , `CC Bank Direct`, `Landmark Strategy Group, LLC`, `Redpoint`, `SPV3`, `SunUp Financial`)
  * `dw_reporting_bsf_identity.loan.current_owner`
* **Custom Fields**: or Loan Custom Fields.  Looks like custom field values set in LoanPro by Agents (or processes).
  * DA: looks like a shitload of fields including multiple dates: e.g. `debt_sale_date`
  * **Table**: dw_reporting_views.loan_settings_custom_fields
* **Customer Entity**: `dw_reporting_lp`.`customer_entity`
  * customer records
  * see other entity tables:
    * `dw_reporting_lp`.`address_entity`
* **Customer Type**: DA: this seems to be generated value (comprised of a couple source data elements) that describe the different flavors of customers.  This is from Jeff G. and how he uses it.  Some may be added as we incorporate new types of sources
    * `New - DM`
    * `New - Expired DM`
    * `New - Other`
    * `New - Lead`
    * `Offerwall - Lead`
    * `New - Refinance`
    * `Previous - Refinance`
    * `Previous`

### -- D --

* **Data Dictionary**: *DA: in search of a/a definitive Braviant data dictionary*
  * ***Looker Data Dictionary pages***: [Looker link](https://braviantholdings.looker.com/extensions/marketplace_extension_data_dictionary::data-dictionary/models/dw_reporting_views_adhoc) looks like Looker stands up Data Dictionary like pages.  Could be very helpful
* **DataOpsSupport**: this is a Jira *label* to apply to DMS tickets to indicate an ops like request in the DMS world
* **Days Past Due**: `dw_reporting_lp`.`loan_status_archive`.`days_past_due`
* **Debt Sale Date**: date where SunUp has sold delinquent/bad loans to third parties
  * can be seen in: `dw_reporting_views`.`loan_settings_custom_fields`.`debt_sale_date`
  * looks like both Bank and Non Bank loans can incur a Debt Sale (`balancecredit`, `ccbankinstallment`, `ccbankdirect`, `balanceloc`)
* **Delinquent**: assume when a loan is `days_past_due` > 0, it is delinquent (e.g. `dw_reporting_bsf_identity.loan.days_past_due`)
* **DFC**: Dynamic Flow Controller
* **DL**: Decision Logic
  * From the Decision Logic website: "_Our service provides the ability to verify a borrower’s identity, bank account number and balance in real-time. It also provides access to up to 365-days of borrowers’ bank account transaction history with a layer of advanced analytics that lead the industry. This automated real-time process empowers you to make fast and accurate decisions critical to the success of your business._"
* **DLH**: assume Data Lake House
* **DM**: Direct Mail
  * **NOTE**: `live_fl` is a flag that indicates that a campaign is "live" and in effect
* **DMC**: Debt Management Company
* **Document Data Table**: looks like a table that holds attributes related to customer (borrower) documents handled, reviewed, or acknowledged during the loan life cycle
  * Examples:
    * `ACHAgreement`
    * `Consent To Electronic Communication`
    * `Patriot Act`
  * `dw_reporting_bsf_core.document_data`: document data including json 
  * `dw_reporting_bsf_common.document_type`: lookup table relating `document_type_id` to an english name
  * join to `dw_reporting_bsf_origination`.`document` (?)
* **Due Date**: Dan: re: payment due date
  * assume this is the day after the scheduled period end
```sql
select entity_id, entity_type, max(period_end) as last_period_end, max(period_end) + 1 as schd_loan_date
from dw_reporting_lp.loan_active_time_tx
group by entity_id, entity_type
limit 1000
```
* **DPD**: Days Past Due
* **Draw**: assume this refers to a draw on a Line of Credit (LOC) account/product

### -- E --

* **EBN**: assume this refers to Electronic Bankruptcy Notice website maintained by US federal courts.  See [website](https://bankruptcynotices.uscourts.gov/).  May be important in the CCB Bank Direct project
* **EBS**: Electronic Bank Statement
* **CDD & EDD**: Customer Due Diligence and Enhanced Due Diligence
  * part of the BSA (Bank Secrecy Act)
* **Effective & Asserted Bi-Temporal Columns**
  * Used in various tables that write multiple row (or row instances) over time
    * At any given time only 1 row should be valid 
    * From KG: _if you want data as of end of day 12/11, it has to be `‘2023-12-12 05:00:00’::timestamptz <@ l.asserted`_
* **EFX**: Assume it means Equifax (consumer credit reporting agency)
* **EV**: Enhanced Verification
  * customer flow where the user has go through enhanced verification to have an agent (?) verify required information (pay stubs? bank acount? not sure here)
  * see table: `dw_reporting_bsf_origination`.`ev_result`
    * see common lookup tables for context
      * `dw_reporting_bsf_common`.`ev_change_reason`
      * `dw_reporting_bsf_common`.`ev_resolution_method`
      * `dw_reporting_bsf_common`.`ev_status`
      * `dw_reporting_bsf_common`.`ev_type`
* **EXP**: Experian (credit bureau)

  
### -- F --

* **Fact Application Table**: special "fact" table storing data element for applications.  Heavily used for reporting and Looker views (?)
  * `dw_reporting_views`.`fact_application`: main table
  	* **NOTE**: the `loan_num` is the loan id field
  * `dw_reporting_views`.`fact_application_new`: assume this is a new table that has not yet been moved into production
* **Fact Installment Table**: special "fact" table storing installment and installment payment data for a loan.  Assume like other fact tables, used for downstream reporting
  * `dw_reporting_views`.`fact_installment`: a ***materialized view***
  * From a code comment: 
    * _The purpose of fact_installment is to provide a payment-by-payment summary of each loan, with payment amounts, initial and current default performance, and due dates_
  * Wiki page with some details: [wiki page](https://balancecredit.atlassian.net/wiki/spaces/PD/pages/3177545732/Fact+Installment)
* **New Fact Installment Table**:
  * new version of the `fact_installment` table: `dw_core.fact_installment`
    * built out as a part of dev project in late 2022
	* **NOTE**: this table is being populated (ETL/data propagation)
* **Fair Value**:
  * (_general accouting defintion_): the practice of measuring your business's liabilities and assets at their current market value
* **Finance Aging Table**: Finance schema table that contains loan "aging" data (payment perspective)
  * `finance`.`aging`: don't have access to this schema as yet
* **First Payment Date**: assume loan closed date
  * `dw_reporting_lp`.`loan_setup_entity`.`first_payment_date`
* **First Payment Default**: assume date in which a first payment default has been determined
  * `dw_reporting_bsf_identity`.`prepped_loan_additional_info_data`.`first_payment_default` (materialized view)
* **Function vs. Procedure**: in Postgres the primary difference is that a function returns a result and a procedure does not
* **Funding Date**: assume this is the date that a loan is considered funded from an origination perspective
	* this is 1 day before the originated loan's contract (effective) date
		* not sure the Funding Date can be on a weekend day
* **FT**: Factor Trust (now owned by TransUnion), credit bureau from which Braviant gets data feeds 

### -- G -- 

* **`get_business_date`**: database function that returns the next business day (so takes into account weekends and holidays)
  * `get_business_date(current_date)` would return today
  * `get_business_date('2023-07-04')` would return '2023-07-05' so the next applicable non-holiday

### -- I --

* **IL PS**: Illinois Paystub
* **Interest Rate** or contract rate - NOT APR (Annual Percentage Rate)
  * Note APR includes other costs, interest rate is the strict cost to borrow money
  * Grant fetched the contract rate/interest rate from this table (DA: not familiar with this table)
  	* `dw_reporting_bsf_uwp.loan_contract_calculation.actual_interest_rate`
  * From an example TIL document (`loan_id` = `630195`)
    * _Interest will accrue on a daily basis on the unpaid Principal Amount. Beginning on the Loan Effective Date set forth above, you begin calculating interest based on the number of days my loan has been outstanding, assuming a 365 day year, until I pay off the Loan in full. My daily interest rate is equal to my Contract Rate (listed at the top of this page) divided by 365._
	* **Daily Accrued Interest** = `principal_balance` * `contract_rate` (not `APR`) / `365 days`

### -- K --

* **KO**: Knockout 

### -- L --

* **Leads**:
  * "Leads Schema": `dw_reporting_bsf_leads`
    * Lead table: `dw_reporting_bsf_leads.lead l`
	* `dw_reporting_bsf_leads.lead_provider_lookup`: table used to look up leads providers
	* link an application to a lead source type (ie. the overall application source type): `dw_reporting_bsf_origination`.`application`.`application_source_type_id`
	  * application source type enumerated values view: `dw_reporting_bsf_common.application_source_type`
	* link `application_source_type_id` to `application_source_type`
	* a code change that looks like an example of linking applications to leads: [github code](https://github.com/braviant/enterprise_dw/commit/656fbbb4a914aed09385057ba6ea067bb20406a2)
	* **PingTree**: online leads platform; seems like a marketplace where you purchase/bid for customer leads
	  * assume we are refocusing on this as a source (mid 2024)
	    * Ramon to start driving this
	  * currently PingTree is the only leads type channel (assume this will change/grow)
	    * Nic: `They would come in with an origination.application application_source_type_id = 2`
* **LMS**: Loan Management System
* **Loan**:
  * `dw_reporting_bsf_identity.loan`
    * some important columns:
      * `loan_status`
      * `loan_sustatus`
      * `loan_effective_date`
      * `loan_payoff_date`
* **Loan Active Time TX Table**
    * `dw_reporting_lp`.`loan_active_time_tx`: looks like the set of both forecasted and scheduled payments for a loan
		* `entity_id`: assume that is the `loan_id` field
		* `type`: `forecastedPayment` or `scheduledPayment`
		* e.g. query to fetch scheduled payments
		  * `select * from dw_reporting_lp.loan_active_time_tx latx where latx.entity_type = 'Entity.Loan' and latx.type = 'scheduledPayment' limit 100`
* **Loan Amount** assume this means the initial loan amount in the customer's contract (ie. original loan amount)
    * `dw_reporting_lp`.`loan_setup_entity`.`loan_amount`
* **Loan Credit Transaction** assume table lists out credit transactions for a particular loan
  * `dw_reporting_bsf_identity`.`loan_credit_transaction` ([sql gist](https://snippets.cacher.io/snippet/fac7f908b0ece7b83b7f))
  * also see: `dw_reporting_lp.loan_credit_entity`
	* looks like the `title` is a freeform text field that someone (an agent? automated process) fills out
	* categories of credit transactions from **table**:  `dw_reporting_lp`.`credit_category_entity`:
		* `Balance Transfer`
		* `Discharge`
		* `Fee Waiver`
		* `Legal Settlement`
		* `Other`
		* `Payoff Adjustment`
		* `Processing Error Adjustment`
		* `Promotions`
		* `Rescission Adjustment`
		* `Settlement Adjustment`
		* `System Adjustment`
	* see example SQL to sum up credits for a loan for a particular date [gist](https://api.cacher.io/raw/a272a70ae4d0a0f39d0c/eab79703abcbcf0d63c7/successful_payment.md)
  * see another example SQL to find credits associated for a loan [gist](https://snippets.cacher.io/snippet/6123d573de7d536fd8de)
  * see list of credit categories [gist](https://snippets.cacher.io/snippet/02bac537b32514555a1f)
* **Loan ID**
    * `dw_reporting_lp`.`loan_setup_entity`.`loan_id`
* **LoanPro**: the loan servicing web application used by Braviant (mostly Ops and Agents but others as well)
  * IMPORTANT: handy report: a loan's `HISTORICAL ARCHIVE`
    * looks like `loan_status_archive` in web page format for a loan... use to understand loan changes over time
    * navigate to..
      1. search on a loan (e.g. `594200`)
      2. click on `Reports`
      3. click on `Historical Archive`
* **Loan Status Entity**: looks like a lookup table (enumerated types) describing loan statuses (those are not soft deleted)
    * `Pending`
    * `App Closed`
    * `Approved`
    * `Active`
    * `Closed`
* **Loan Status & Sub Status**: look up tables for loan status and substatus
    * `dw_reporting_lp`.`loan_sub_status_entity`
		* 4	Active
		* 2	App Closed
		* 3	Approved
		* 5	Closed
		* 1	Pending
	* `dw_reporting_lp`.`loan_status_entity`
* **Loan Status Archive** (_table_)
    * **NOTE**: KG SAYS THAT CLOSED LOANS FALL OF THIS TABLE AFTER A FEW DAYS.  KEEP THIS MIND.  MAY BE BETTTER TO USE `dw_reporting_bsf_identity.loan` for some queries 
    * `dw_reporting_lp`.`loan_status_archive`
      * "lsa"
    * For SC state reporting, dw_reporting_lp.loan_status_archive.payoff as of a date to include the payments applied up to and including that date
	* looks like a daily snapshot of key data by loan
* **Loan Term**
  * DA: determine the loan term in days
    * `(dw_reporting_lp.loan_setup_entity.orig_final_payment_date - dw_reporting_lp.loan_setup_entity.contract_date) as loan_term_in_days`
* **Loan Transaction Tables**
  * `dw_reporting_lp`.`loan_tx`: assume this holds transactions for a loan (and probably other "objects" including refunds [Advancements for overpayments]). 
    * use `entity_id` to search for the `loan_id` value 
  * **NOTE**: associate `dw_reporting_lp.loan_tx tx` to `dw_reporting_lp.payment_entity pe` on `pe.id = tx.payment_id`
* **Loan Transaction (Loan Tran / Settlement) Tables**
  * From Grant:
    * *Holds all of the prior days transactions (Payments, credits, buybacks, advancements, fundings, funding returns, payment returns, system adjustments, credit returns, adv returns, rescissions, buyback payment returns, and accrued interest)*
	* [Github Code](https://github.com/braviant/enterprise_dw/blob/master/sql/data/dw_reporting_views/procedures/cc_bank_loantran_refresh.sql) 
  * assume these are the `Loan Tran` tables
	* `dw_reporting_views`.`cc_bank_loantran_audit`: main Loan Tran table?
	* `dw_reporting_views`.`cc_bank_loantran_daily`: looks like the last daily snapshot of `cc_bank_loantran_audit` (so it just has one day's worth of data)
* **LOC**: Line of Credit
* **Looker**
  * **Developer Mode**
    * Get into a particular branch
	  1. Log into Looker
	  1. Toggle into `Developer Mode` (lower left hand corner)
	  1. Click the `Develop` menu item
	  1. Click on the `enterprise_dw` project
	  1. Click on the default branch (upper left hand corner)
	  1. Click on the `Pull Remote Changes` button (upper right hand corner)
	  * (I think you now just use Looker normally and should be using the specified branch code?)
* **Lock Box**:
  * from Investopedia
    * _Lockbox banking is a service provided by banks to companies for the receipt of payment from customers. Under the service, the payments made by customers are directed to a special post office box instead of going to the company. The bank goes to the box, retrieves the payments, processes them and deposits the funds directly into the company's bank account._
* **LP**: LoanPro
	
### -- M --

* **Maturity Date**: contractual (TIL?) maturity date of the loan: `dw_reporting_lp.loan_setup_entity.orig_final_payment_date`
* **MOB Month on Book**: 
    * seems like a bucketing or cohort categorization driven by the months that a loan is on the books starting with Month 0
	* if a loan originates on July 3 and it is now Oct 31 (end ot the month of October) then the loan is categorized as `MOB 3`
	  * Jul: `MOB 0`
	  * Aug: `MOB 1`
	  * Sep: `MOB 2`
	  * Oct: `MOB 3`

### -- N --

* **NCP**: NCP Finance, company currently used a middle man between SunUp Financial and CC Bank.  That relationship will end and SunUp will eventually act direct to CC Bank
* **NCP Table**: table that houses the "GL" like records produced by the NCP/TLS CC Bank settlement process used for `ccbankinstallment` product loans
  * `dw_reporting_views.bank_ncp_settlement`
  * `ccbankdirect` loans have the analogous GL records stored here: `dw_reporting_views.ccbd_transaction_history_audit`
* **NOA**: Notice of Assignment: mandatory notification to the customer that their loan has been sold
* **Net NPV**: NPV - CFP (net present value minus the cost to fund)
* **NPV**: Net Present Value for a loan

### -- O --
* **ODFI**: Originating Depository Financial Institution 
  * In ACH payment processing (see [informative web page](https://paymentcloudinc.com/blog/rdfi-odfi/))
    * _agrees with Nacha or the Federal Reserve to transmit ACH transactions on behalf of an originator bank_
    * _In banking terms, it’s the entity that helps initiate the original transaction._
* **owner**: `dw_reporting_views.loan_settings_custom_fields.owner`
  * assume the entity that currently owns the loan 
  * see Loan Custom Fields
* **Overpayment**: snippet to calculate overpayments by loan and `loan_tran` transaction date [gist](https://api.cacher.io/raw/a272a70ae4d0a0f39d0c/eab79703abcbcf0d63c7/successful_payment.md)

### -- P --

* **Paid Off Date**: or Payoff Date. Date in which the loan is paid off. 
  * some tables where this exists (DA: others exist I'm sure)
    * `dw_reporting_bsf_identity.loan.loan_payoff_date`
    * `dw_core.fact_installment.loan_paid_off_date`
* **Participation**: process by which entities own parts of a Bravian loan and (I assume) receive part of the customer's principal and interest payment stream
	* Example: CC Bank originates Bank loans and then on the third business day sells 95% of the loan back to a Braviant entity and keeps a 5% participation.  
		* future events (e.g. chargeoff) can adjust that participation 
	* Tejas can provide help from a tech perspective on Pledging
	* [Old Participation Product Requirements](https://balancecredit.atlassian.net/wiki/spaces/PD/pages/3276668941/Loan+Ownership+Participation): may provide some helpful context
	* [LucidChart - Context on Participation](https://lucid.app/lucidchart/733c2dc7-44b7-4f7a-a455-22f3e61cb4a6/edit?viewport_loc=306%2C1428%2C1871%2C989%2C0_0&invitationId=inv_eb136275-f090-49c5-84cc-9cb1ef930c73)
	* See how participation changes participation event: [configuration table](https://snippets.cacher.io/snippet/1835a57f0a5b46cad203)
  * **Participation Business Rules**: observations on potential business rules(?)
    * *Pending Rescission Loans*: if a loan is `Pending Rescission` on the third business day, a loan participation event will not occur
  * **Participation "Effect"**: participation essentially takes effect at the end of the participation date
    * *What does this mean?* Means that payments applied on the participation date should be allocated only to CCB (who is the sole owner prior to participation)
  * Relevant EDW tables (NOTE: assume the operating tables are in BOSS)
	  * `dw_reporting_boss_core`.`participating_entity`: list of business entities that participate in loans (lookup table?)
	    * B Credit Solutions, LLC|(id = 3)
		* B Credit Solutions - SPV1|(id = 4)
		* CC Bank|(id = 1)
		* Debt Management Partners, LLC|(id = 5)
		* Landmark Strategy Group, LLC|(id = 6)
		* National Debt Holdings, LLC|(id = 8)
		* NCP|(id = 2)
		* Peritus Portfolio Services LLC|(id = 7)
	  * `dw_reporting_boss_participation`.`participation_allocation_event_type`: enumerated tables describing events that drive allocations
	    * Origination|(id = 1)
	    * Participation Transfer: CCB -> NCP|(id = 2)
	    * Participation Transfer: NCP -> BCS|(id = 3)
	    * Buyback Purchase|(id = 4)
	    * Participation Pledge|(id = 5)
	    * Debt Sale|(id = 6)
	    * Participation Unpledge|(id = 7)
	    * Debt Sale Buyback|(id = 8)
	  * `dw_reporting_boss_participation`.`participation_allocation`: assume table that describes the current participation allocation of a particular loan (at a particular point in time)
	    * this is a bitemporal table so some allocation records are in effect and some are inactive
	    * SQL to fetch the the participation allocation for a loan_id at a particular date
	      * `select * from dw_reporting_boss_participation.participation_allocation where loan_pro_loan_id = 612677 and '2023-06-07'::timestamptz <@ asserted and '2023-06-07'::timestamptz <@ effective` 
	  * `dw_reporting_boss_participation`.`participation_allocation_transition`: looks like this table describes the transition in participation for a given allocation event
	  * `dw_reporting_boss_participation`.`participation_transaction`: describes a participation transaction
* **Payment Date**: various payment dates
  * `dw_reporting_bsf_identity.loan.last_payment_apply_date`
  * `dw_reporting_bsf_identity.loan.next_payment_due_date`
* **payment_e**: column multiple tables; part of a payment that is considered part of an escrow payment (?)
  * in table: `dw_reporting_lp.payment_entity`
* **Payment Frequency**
  * `dw_reporting_bsf_common`.`payment_frequency`: enumerated list of payment frequency types (e.g. `Bi-weekly`)
  * also see: `dw_reporting_lp.loan_setup_entity.payment_frequency`
* **Payment Method**
  * `dw_reporting_bsf_origination.application.payment_method_id`: assume this table is where I should find the payment_method associated with a particular loan (loan's application)
  * `dw_reporting_bsf_common`.`payment_method`: listing of payment methods
    * ACH (`payment_method_id` = 1)
    * RCC (`payment_method_id` = 2)
    * DirectPay  (`payment_method_id` = 3)
  * **NOTE**: Grant says the table above is for something else.  The `ids` he uses is:
    * ACH (`payment_method_id` = 4)
	* Debit (`payment_method_id` = 3)
	* Check (`payment_method_id` = 2)
* **(Loan) Payment Schedule**:
  * `dw_reporting_views.loan_payment_schedule`: table that appears (?) to hold the formal schedule of payments driven by a loan's amortization schedule
    * is used when refreshing `dw_reporting_views.fact_installment`
* **Payment Transaction**
  * `dw_reporting_bsf_identity`.`payment_transaction`: payment transaction table?
    * See example SQL to query successful transaction [gist](https://api.cacher.io/raw/a272a70ae4d0a0f39d0c/eab79703abcbcf0d63c7/successful_payment.md)
  * `Payment - Unsuccessful Transaction`: a type of transaction that is tagged as ACH in LoaPro but for some reason do not show up in the ACH file 
    * I think this occurs for events like a bad routing number was used
	* Grant: "When they occur, ops gets notified by this [looker report](https://braviantholdings.looker.com/looks/7558?qid=WZFaGTxlsgdNQ8b01NyK6k)"
	* Grant: "the amount of non-ach payments dont apply to the balance of the loan. so when it gets reversed thats why your balance becomes corrected again"
	* NOTE: this table will contain deleted payment transactions. 
	  * for these cases: `payment_transaction_id` is `null`
* **PBR**: Product Backlog Review - recurring meeting that Nic has to review backlog epics(?).  Not sure exactly what we do in this meeting
* **Per Diem** 
    * Daily interest accrual
    * `dw_reporting_lp`.`loan_status_archive`.`perdiem`
    * `dw_reporting_bsf_origination`.`application`.`product`
* **Perform**: Postgres command, same as `select` but `perform` throws away the result
  * looks like perform can trigger a function or procedure (and thow away the result if applicable?)
* **PingTree**: (also see **Leads**) online leads platform; seems like a marketplace where you purchase/bid for customer leads
* **Pledging**: process by which a loan allocation (how much?) is transferred from B Credit Solutions (BCS) to another Braviant entity (ie. BCS - SPV1)
	* NOTE: looks like pledging is only done (given comment above and a db query of `dw_reporting_boss_pledging.pledged_loans`) to Bank loans (`ccbankdirect`, `ccbankinstallment`) - IS THIS ACCURATE?
	* Tejas can provide help from a tech perspective on Pledging
	* Pledging functionality is in the BOSS world and db and that data gets ETL'ed/sync'ed to EDW (see `dw_reporting_boss_pledging` schema)
	* Tables that describe the pledging activity
		* `dw_reporting_boss_pledging.pledged_loans`: lists out pledged loans
	* see [PTOB-520](https://balancecredit.atlassian.net/browse/PTOB-520) for an example of code leveraging pledging data
	* **Eligibility** at a high level the process to determin what loans are eligible to be pledged (?) 
	  * Lara's SQL to determine loan eligibility for SPV3: [Cacher link](https://snippets.cacher.io/snippet/39d439cd3e4878f4d42c)
* **PM**
    * Prior Month: just saw this in a deliverable and didn't know what it was
      * it may not be an official acronym
* **LoanPro Portfolio ID**: unique identifier used upstream in LoanPro
  * `dw_reporting_lp`.`loan__portfolio`: looks like mapping of loan_id to portfolio_id
    * `select distinct portfolio_id from dw_reporting_lp.loan__portfolio order by portfolio_id desc where deleted = 0`
* **Prepayment**: assume that means the customer paying off all or part of the loan prior to the scheduled payment date
* **Procedure vs. Function**: in Postgres the primary difference is that a function returns a result and a procedure does not
* **Product** 
    * `dw_reporting_bsf_origination`.`application`.`product`
	* these are the current "products"; ***there will be a new one when NCP is removed from the Braviant operating relationship***
	  * `balancecredit`
	  * `balanceloc`
	  * `ccbankinstallment`
	  * `choruscredit`
	* `dw_reporting_bsf_common`.`product`: enumerated list of product types 
* **PTI**: Payment To Income
* **Purchase Date: `purchase_date`**: date that a loan was bought back (buy back / buyback) from the bank
  * can be found in `dw_reporting_bsf_identity.loan_additional_info.purchase_date`
  * `dw_reporting_bsf_identity.loan_additional_info lai`

### -- R --

* **RBPN**: Risk Based Pricing Notice: maybe some background [link](https://www.consumercomplianceoutlook.org/2012/first-quarter/risk-based-pricing-notice-requirements/)
* **RCC**: Remotely Created Check
* **REFI**: Refinance
* **Refinance Offers** 
    * See materialized view `dw_reporting_views`.`refinance_offers` for refinance offers (?)
      * assume `base_loan_id` is the loan being refinanced
      * assume `refi_loan_id` is the new refinanced loan
      * ? assume you need to check out the refinanced loan to make sure it has a status of `Active` or `Closed` (make sure it was funded)
* **Refinancing / Refis**: my crude take on what happens 
  * Check out the example in `dw_reporting_lp`.`loan_tx` (Loan Transaction table)
    * Refinanced Loan: `568975`
	* New Loan: `616930`
  * *Basic Process*
    * `568975`'s outstanding balance ($1,119.75) is "paid off"
	* the paid off balance ($1,119.75) is applied to the new loan `616930`
	* the new loan is funded ($1,280.25) at origination time
	  * see: `select * from dw_reporting_views.cc_bank_loantran_audit where loan_id = 616930`
	* for a loan with a initial balance of $2,400 = $1,119.75 + $1,280.25
	* DA (?): the components of a refi loan balance:
	  1. Total Loan Amount = $2,400
	  1. Base Loan Payoff  = $1,119.75
	  1. Cash to Customer  = $1,280.25
  * *Check if a Loan is a Refinance*
    * DA: a way (probable one of multiple ways) to determine if a loan is a refi / refinance
	  * check the if the application source type id = 4
	  * `case when a.application_source_type_id = 4 then 'Yes' else 'No' end as refi_flag`
* **Refund**: currently refunds are cash payments made via papercheck (processed through a service called Smart Payables[?])
  * Assume refunds are Advancements in the LoanPro world
  * one place to query: `finance.fft_clean fft` where `transaction_type` = `Advancement`
* **Refund & Reimbursement Tracker**: a Google Sheet that tracks refunds and reimbursements processed by the Ops Team
  * [Google Sheet Link](https://docs.google.com/spreadsheets/d/11MZQJ3pm__UYMFZU8MER7ByWZG-BA9ZyAYJVLYRNyBc/edit?usp=sharing)
  * Sounds like this was a processed partially owned by Accounting but now owned by Ops start to finish
* **Reverse Status Archive**
    * `dw_reporting_lp`.`loan_reverse_status_archive`
    * a status of a loan's payments that goes back in time and represents payment reversals to apply to the actual due date
    * (why? beacause there is a lag of ~3 days to get notified of a reversal, this db table goes back an applies reversal as if the notification was immediate)
* **Roll Rate**
	* _From Investopedia_: The roll rate is the percentage of credit card cardholders that roll from one category of delinquency to the next.
		* For instance, you can measure the percentage of cardholders who roll from 60-days overdue to 90-days overdue.
* **RTC | Right to Cure**
	* Right to Cure notice.  Notice to a customer they are in default or delinquency and they have a right to cure the default 
	* Assume this notice is triggered by certain events and has to adhere to federal/state regulations
	
	
### -- S --

* **Sales Finance Contract (SFC)** from ChatGPT. DA: assume this is not part of Braviant's current business
  * _In the consumer installment loan industry, a "sales finance contract" (SFC) refers to a legal agreement between a borrower (often a consumer) and a lender, typically used in the context of financing the purchase of specific goods or services._
* **Scheduled Payments**: see **Loan Active Time TX Table**
* **SCRA** - The Servicemembers Civil Relief Act
  * drives loan servicing treatment and notifications
* **SDN*: Specially Designated Persons & Blocked Persons list (SDN List)
* **Settlement**: *(general banking industry definition)* Settlement involves the finalization of a payment, so that a new party takes possession of transferred funds [web link](https://www.moderntreasury.com/journal/difference-between-settlement-and-clearing)
  * _Daily Settlement Total_:
    * **NOTE**: some of these values may be (-) in sign in the `loan_tran` table
	* **NOTE** see Grant's code [here](https://github.com/braviant/enterprise_dw/blob/5acb87ac15b7eb292452ba3085b0abf49849a8f8/sql/data/dw_reporting_views/materialized_views/ccbd_daily_settlements_audit.sql#L28)
    * Add In:
      * Scenarios: 
        * `Payment`
        * `Payment Return`
        * `Refund`
        * `Credit`
        * `Credit Return`
        * `System Adjustment`
        * `Agent Error`
        * `Overpayment`
        * `Advancement Return`
        * `Check Return - Refer to Maker`
        * `Advancement`
      * Events:
        * `Payment - Unsuccessful Transaction`
        * `Payment Return - Unsuccessful Transaction`
    * Subtract Out:
      * Scenarios: 
        * `Funding Return`
        * `Rescission`
        * `Origination`
      * Transaction Code: 
        * `WO`
* **SSN**
  * NOTE: `ssn_7` is the **last 7** characters of the SSN value
* **Suspense Account**: _general business definition_ a suspense account is a bookkeeping account where funds are categorized temporarily for various reasons
  * e.g. funds are received for an ambiguous reason and the company needs more clarification to accurately categorize funds
  * e.g. borrower makes a partial payment and the company temporarily holds the payment until the balance of the full payment is received
  * see: [Investopedia article](https://www.investopedia.com/terms/s/suspenseaccount.asp)

### -- T --

* **TBS**: Traditional Bank Statement
* **TLS**: TLS (Part of NCP) is a Servicer for the CC Bank for its program.  It coordinates and maintains Program info in its Loan Info System(LIS)
  * Assume TLS will go away as the Bank Direct program ramps up (just applicable to loans orginated prior to Bank Direct)
* **Transaction Codes (`tran_codes`)**: code describing different transaction types
  * `ADV`: advance
  * `ADV1`: advance (not sure what's the difference)
  * `CRE`: credit
  * `PART`: participation
  * `PAY`: payment
  * `RADV`: advance return
  * `REFI`: refinance
  * `VADV`: voided advance (example: ACH exception due to an incorrect bank routing number)
  * `VPAY`: voided payment
  * `WO`: write off (example: bankruptcy)
* **Trial Balance Tables**
	* _A trial balance is a bookkeeping worksheet in which the balances of all ledgers are compiled into debit and credit account column totals that are equal_
	* `dw_reporting_views`.`cc_bank_trialbalance_dpd_audit`
	* `dw_reporting_views`.`cc_bank_trialbalance_dpd_daily`
	  * Dan: I think the trial balance "tallies" up these columns:
	    * `principal_balance`
		* `days_past_due`
		* `accrued_interest`
	* From Grant (current settlement process)
	  * *Should have a record for each ‘open’ loan, showing its running balance. Aka what the outstanding balance is for each loan through ccb. Once they are paid off or otherwise they should drop off the report.*
	  * *Key column is* `bsf_loan`.`remaining_loan_balance` *(same as* `lp`.`loan_status_archive`.`principal_balance` *for a date)*
* **TU**: Transunion
	
### -- U --

* **UPL**: Unsecured Personal Loans
  * Seems like a FinTech acronym
* **UW**: Underwriting

### -- V --

* **WOAC**: assume (?) Write Off Accrued
