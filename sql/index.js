const sql = {};

sql.query = {
  // Information
  all_caretaker:
    'SELECT c.email, c.name, c.location, c.rating, t.daily_price + p.base_daily_price AS price, t.pet_type, a.start_date, a.end_date FROM care_taker c INNER JOIN can_take_care_of t ON c.email = t.email INNER JOIN pet_type p ON t.pet_type = p.name INNER JOIN indicates_availability as a ON c.email = a.email WHERE a.start_date <= $1 AND a.end_date >= $2',
  all_pet_types: 'SELECT * FROM pet_type',
  caretaker_summary_info:
    "SELECT C.name, C.email, SUM(H.num_pet_days) AS num_pet_days, SUM(H.total_cost) AS total_cost, EXTRACT(MONTH FROM H.transaction_date) AS month FROM care_taker C, hire H WHERE C.email = H.ct_email AND H.hire_status = 'completed' GROUP BY C.email, EXTRACT(MONTH FROM H.transaction_date)",
  
  // Insertion
  add_pet_type: 'INSERT INTO pet_type (name, base_daily_price) VALUES($1,$2)',

    // top 4 ratings
  caretaker_top_ratings:
    'SELECT name, location, rating, job FROM care_taker WHERE location = $1 ORDER BY rating DESC LIMIT 4',
  // 4 most recent transactions
  recent_trxn_po:
    'SELECT H.hire_status, H.start_date, H.end_date, C.name AS ct_name, P.name AS po_name, H.pet_name, H.rating, H.review_text FROM hire H INNER JOIN care_taker C ON H.ct_email = C.email INNER JOIN pet_owner P ON H.owner_email = P.email WHERE H.owner_email = $1 ORDER BY H.transaction_date DESC LIMIT 4',
  // 4 of my pets
  my_pets:
    'SELECT * FROM own_pet O INNER JOIN is_of I ON O.pet_name = I.pet_name AND O.email = I.owner_email WHERE O.email = $1 LIMIT 4',
  get_po_info: 'SELECT * FROM pet_owner WHERE email = $1',
  get_ct_info: 'SELECT * FROM care_taker WHERE email = $1',
  get_my_trxn: "SELECT *, CASE WHEN H.hire_status = 'pendingAccept' OR H.hire_status = 'pendingPayment' THEN 1 ELSE 2 END AS button FROM hire H INNER JOIN care_taker C ON H.ct_email = C.email WHERE H.owner_email = $1 ORDER BY transaction_date DESC, start_date DESC, end_date DESC",
  get_ct_email: 'SELECT C.name AS ct_name, C.email AS ct_email, H.hire_status, H.start_date, H.end_date, H.rating, H.review_text FROM care_taker C INNER JOIN hire H ON C.email = H.ct_email WHERE C.name = $1 ORDER BY H.transaction_date DESC LIMIT 4',
  get_a_hire: "SELECT * FROM hire WHERE owner_email = $1 AND ct_email = $2 AND start_date = $3 AND end_date = $4 AND pet_name = $5",
  get_ct_type: "SELECT job FROM care_taker WHERE email = $1",
  dates_caring: "SELECT start_date, end_date FROM hire WHERE ct_email = $1",
  part_timer_availability: "SELECT start_date, end_date FROM indicates_availability WHERE email = $1",
  full_timer_leave: "SELECT start_date, end_date FROM has_leave WHERE email = $1"
};

module.exports = sql;
