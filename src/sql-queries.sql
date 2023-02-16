-- name: trips_status_count
SELECT
	status as id,
	COUNT(id) as tripCount
FROM taxi_trips2.trip
WHERE SUBSTR(trip.createdAt, 1,10) = :targetDate
GROUP BY status


-- name: stats_getTodayCounters
SELECT 'today_trips_canceled' AS `key`, COUNT(id) as count FROM taxi_trips2.trip WHERE SUBSTR(trip.createdAt, 1,10) = :targetDate AND `status` IN ('accept_timeout', 'canceled_by_customer', 'canceled_by_driver') 
UNION
SELECT 'today_trips_completed' AS `key`, COUNT(id) as count FROM taxi_trips2.trip WHERE SUBSTR(trip.createdAt, 1,10) = :targetDate AND `status` IN ('got_paid')
UNION
SELECT 'today_trips_total' AS `key`, COUNT(id) as count FROM taxi_trips2.trip WHERE SUBSTR(trip.createdAt, 1,10) = :targetDate
UNION 
SELECT 'today_divers_online' AS `key`, COUNT(DISTINCT driverId) as count FROM taxi_trips2.stat_driver_online_tick WHERE SUBSTR(TIMESTAMP, 1,10) = :targetDate
UNION
SELECT 'today_new_drivers' AS `key`, COUNT(id) as count FROM taxi_accounts.drivers WHERE SUBSTR(createdAt, 1,10) = :targetDate
UNION
SELECT 'today_new_customers' AS `key`, COUNT(id) as count FROM taxi_accounts.customers WHERE SUBSTR(createdAt, 1,10) = :targetDate
UNION
SELECT 'today_divers_notification' AS `key`, COUNT(id) as count FROM taxi_trips2.stat_driver_notified WHERE SUBSTR(TIMESTAMP, 1,10) = :targetDate
UNION
SELECT 'today_divers_rejection' AS `key`, COUNT(id) as count FROM taxi_trips2.stat_driver_rejected WHERE SUBSTR(TIMESTAMP, 1,10) = :targetDate
;

-- name: trips_getDateTrips
SELECT
	t.id,
	t.createdAt,
	(SELECT customerName FROM `taxi_accounts`.customers c WHERE c.id = customerId) customerName,
	(SELECT driverName FROM `taxi_accounts`.drivers d WHERE d.id = driverId) driverName,
	(SELECT COUNT(n.id) FROM taxi_trips2.stat_driver_notified n WHERE n.processInstanceId = t.processInstanceId) notifiedDrivers,
	t.pickupToDropOffRouteDistance as distance,
	t.status,
	t.pickupAddress,
	t.dropoffAddress
FROM taxi_trips2.trip t
WHERE SUBSTR(t.createdAt, 1,10) = :targetDate
;




-- name: trips_getDateTripInvoices
SELECT 
	trip_invoice.id,
	trip_invoice.createdAt,
	(SELECT driverName FROM `taxi_accounts`.drivers d WHERE d.id = driverId) driverName,
	(SELECT customerName FROM `taxi_accounts`.customers c WHERE c.id = customerId) customerName,
	invoiceSubTotal,
	invoicePromoDiscount,
	invoiceGrandTotal
FROM taxi_trips2.trip_invoice
JOIN taxi_trips2.trip ON trip.id = trip_invoice.tripId
WHERE SUBSTR(trip.createdAt, 1,10) = :targetDate AND trip_invoice.isFinalInvoice = 1
;



-- name: stats_online_getDateDriversByHours
SELECT 
    SUBSTR(t.timestamp, 12,8) as id,
	t.timestamp,
	Count(t.driverId) driversCount
FROM stat_driver_online_tick t
WHERE SUBSTR(t.timestamp, 1,10) = :targetDate
GROUP BY t.timestamp
;


-- name: stats_online_getDateDriversWithMinutesList
-- gives drivers names and total minutes in a target day
-- args: targetDate: '2021-05-07'
SELECT 
	t.driverId as id,
	SUBSTR(t.timestamp, 1,10) as date,
	FORMAT(SUM(t.tickCount) * 15 / 60,2) as minutes,
	(SELECT driverName FROM `taxi_accounts`.drivers d WHERE d.id = driverId) driverName,
	(SELECT COUNT(d.id) FROM stat_driver_notified d WHERE d.driverId = t.driverId AND SUBSTR(t.timestamp, 1,10) = SUBSTR(d.timestamp, 1,10)) AS notificationCount,
	(SELECT COUNT(d.id) FROM stat_driver_rejected d WHERE d.driverId = t.driverId AND SUBSTR(t.timestamp, 1,10) = SUBSTR(d.timestamp, 1,10)) AS rejectCount,
	(SELECT COUNT(d.id) FROM trip d WHERE d.driverId = t.driverId AND SUBSTR(t.timestamp, 1,10) = SUBSTR(d.createdAt, 1,10)) AS tripCount
FROM stat_driver_online_tick t
WHERE SUBSTR(t.timestamp, 1,10) = :targetDate
GROUP BY driverId, DATE, driverName, tripCount, rejectCount, notificationCount
ORDER BY SUM(t.tickCount) DESC
;


-- name: stats_getDriversRegisteredAtDate
-- gives drivers names and total minutes in a target day
-- args: targetDate: '2021-05-07'
SELECT 
	id,
	driverName,
	driverPhone,
	driverCarBrand,
	driverCarColor,
	driverCarModel,
	driverCarYear
FROM `taxi_accounts`.drivers
WHERE SUBSTR(createdAt, 1,10) = :targetDate
;


-- name: stats_getCustomersRegisteredAtDate
-- gives drivers names and total minutes in a target day
-- args: targetDate: '2021-05-07'
SELECT 
	id,
	customerName,
	customerPhone
	customerEmail,
	customerStatus,
	customerGender
FROM `taxi_accounts`.customers
WHERE SUBSTR(createdAt, 1,10) = :targetDate



-- name: stats_getDriverNotification
-- gives drivers names and total minutes in a target day
-- args: targetDate: '2021-05-07'
SELECT
	t.driverId as id,
	SUBSTR(t.timestamp, 1,10) as date,
	COUNT(t.id) as notifications,
	(SELECT driverName FROM `taxi_accounts`.drivers d WHERE d.id = t.driverId) driverName	
FROM stat_driver_notified t
WHERE SUBSTR(t.timestamp, 1,10) = :targetDate
GROUP BY t.driverId, DATE,driverName;



-- name: stats_getDriverRejections
-- gives drivers names and total minutes in a target day
-- args: targetDate: '2021-05-07'
SELECT
	t.driverId as id,
	SUBSTR(t.timestamp, 1,10) as date,
	COUNT(t.id) as rejections,
	(SELECT driverName FROM `taxi_accounts`.drivers d WHERE d.id = t.driverId) driverName	
FROM stat_driver_rejected t
WHERE SUBSTR(t.timestamp, 1,10) = :targetDate
GROUP BY t.driverId, DATE,driverName;















-- name: driver_getDriverInfo
-- args: driverId: 470
SELECT 
	id,
	driverName,
	driverPhone,
	driverCarBrand,
	driverCarColor,
	driverCarModel,
	driverCarYear
FROM `taxi_accounts`.drivers
WHERE id = :driverId;


-- name: driver_getDriverTrips
-- args: driverId: 470
SELECT
	t.id,
	t.createdAt,
	(SELECT customerName FROM `taxi_accounts`.customers c WHERE c.id = customerId) customerName,
	t.pickupToDropOffRouteDistance as distance,
	t.status,
	t.pickupAddress,
	t.dropOffAddress
FROM taxi_trips2.trip t
WHERE t.driverId = :driverId;


-- name: driver_getDriverInvoices
-- args: driverId: 470
SELECT 
	trip_invoice.id,
	trip_invoice.createdAt,
	(SELECT driverName FROM `taxi_accounts`.drivers d WHERE d.id = driverId) driverName,
	(SELECT customerName FROM `taxi_accounts`.customers c WHERE c.id = customerId) customerName,
	invoiceSubTotal,
	invoicePromoDiscount,
	invoiceGrandTotal
FROM taxi_trips2.trip_invoice
JOIN taxi_trips2.trip ON trip.id = trip_invoice.tripId
WHERE trip.driverId = :driverId
;

-- name: driver_getDriverDailyStats
-- args: driverId: 470, targetDate: :targetDate
SELECT
	SUBSTR(s.timestamp, 1,10) as date,
	SUM(s.tickCount) * 15 as minutes,
	(SELECT COUNT(d.id) FROM stat_driver_notified d WHERE d.driverId = s.driverId AND SUBSTR(s.timestamp, 1,10) = SUBSTR(d.timestamp, 1,10)) AS notificationCount,
	(SELECT COUNT(d.id) FROM stat_driver_rejected d WHERE d.driverId = s.driverId AND SUBSTR(s.timestamp, 1,10) = SUBSTR(d.timestamp, 1,10)) AS rejectCount,
	(SELECT COUNT(d.id) FROM trip d WHERE d.driverId = s.driverId AND SUBSTR(s.timestamp, 1,10) = SUBSTR(d.createdAt, 1,10)) AS tripCount
FROM stat_driver_online_tick s
WHERE s.driverId = :driverId
GROUP BY DATE, notificationCount, rejectCount, tripCount;


-- name: driver_getDriverPickupBonus
SELECT 
	driver.id driverId,
	driver.driverName driverName,
	SUM(FLOOR((IF((trip.driverToPickupRouteDistance / 1000) < trip.pricingInfoMinFareKilo, 0 , trip.driverToPickupRouteDistance / 1000)))) totalDistance,
	SUM(FLOOR((IF((trip.driverToPickupRouteDistance / 1000) < trip.pricingInfoMinFareKilo, 0 , trip.driverToPickupRouteDistance / 1000) * trip.pricingInfoKiloPrice))) totalBonus
FROM taxi_accounts.drivers driver 
LEFT JOIN trip ON trip.driverId = driver.id
WHERE trip.`status` = 'got_paid' AND (trip.createdAt BETWEEN :dateFrom AND :dateTo) AND driver.id = :driverId
GROUP BY driver.id, driver.driverName
ORDER BY totalBonus DESC;

-- name: driver_getAllDriversPickupBonus
SELECT 
	driver.id driverId,
	driver.driverName driverName,
	SUM(FLOOR((IF((trip.driverToPickupRouteDistance / 1000) < trip.pricingInfoMinFareKilo, 0 , trip.driverToPickupRouteDistance / 1000)))) totalDistance,
	SUM(FLOOR((IF((trip.driverToPickupRouteDistance / 1000) < trip.pricingInfoMinFareKilo, 0 , trip.driverToPickupRouteDistance / 1000) * trip.pricingInfoKiloPrice))) totalBonus
FROM taxi_accounts.drivers driver 
LEFT JOIN trip ON trip.driverId = driver.id
WHERE trip.`status` = 'got_paid' AND (trip.createdAt BETWEEN :dateFrom AND :dateTo)
GROUP BY driver.id, driver.driverName
ORDER BY totalBonus DESC;

-- name: tripStatusCountByDay
SELECT 
	time_dimension.day_name day,
	time_dimension.db_date date,
	SUM(if(trip.status = 'got_paid', 1, 0)) gotPaid,
	SUM(if(trip.status = 'accept_timeout', 1, 0)) acceptTimeout,
	
	SUM(if((trip.status = 'canceled_by_customer') AND ((SELECT COUNT(trip_history.id) FROM trip_history WHERE trip_history.status = 'accept' AND trip_history.tripId = trip.id) = 0), 1, 0)) canceledByCustomerBeforeAccepted,
	SUM(if((trip.status = 'canceled_by_customer') AND ((SELECT COUNT(trip_history.id) FROM trip_history WHERE trip_history.status = 'accept' AND trip_history.tripId = trip.id) = 1), 1, 0)) canceledByCustomerAfterAccepted,
	SUM(if((trip.status = 'canceled_by_customer') AND ((SELECT COUNT(trip_history.id) FROM trip_history WHERE trip_history.status = 'arrive' AND trip_history.tripId = trip.id) = 1), 1, 0)) canceledByCustomerAfterArrival,
	
	SUM(if((trip.status = 'canceled_by_driver') AND ((SELECT COUNT(trip_history.id) FROM trip_history WHERE trip_history.status = 'accept' AND trip_history.tripId = trip.id) = 0), 1, 0)) canceledByDriverBeforeAccepted,
	SUM(if((trip.status = 'canceled_by_driver') AND ((SELECT COUNT(trip_history.id) FROM trip_history WHERE trip_history.status = 'accept' AND trip_history.tripId = trip.id) = 1), 1, 0)) canceledByDriverAfterAccepted,
	SUM(if((trip.status = 'canceled_by_driver') AND ((SELECT COUNT(trip_history.id) FROM trip_history WHERE trip_history.status = 'arrive' AND trip_history.tripId = trip.id) = 1), 1, 0)) canceledByDriverAfterArrival,
	
	SUM(if(trip.status IN ('canceled_by_customer', 'canceled_by_driver'), 1, 0)) tripTotal,
	
	COUNT(trip.promoCode) promoCount,
	SUM(trip_invoice.invoicePromoDiscount) promoTotal,
	
	SUM(trip_invoice.invoiceWalletWithdraw) paymentFromWallet,
	SUM(trip_invoice.invoiceCashToPay) paymentFromCash,
	SUM(trip_invoice.invoiceGrandTotal) invoiceGrandTotal
FROM trip
LEFT JOIN time_dimension ON DATE(trip.createdAt) = time_dimension.db_date
LEFT JOIN trip_invoice ON trip_invoice.tripId = trip.id
WHERE time_dimension.db_date BETWEEN :dateFrom AND :dateTo
GROUP BY time_dimension.db_date;

-- name: usersRegisteraionsByDay
SELECT 
	taxi_trips2.time_dimension.day_name `day`,
	taxi_trips2.time_dimension.db_date `date`,
	(SELECT COUNT(*) FROM taxi_accounts.drivers WHERE Date(taxi_accounts.drivers.createdAt) = `date`) newDriversCount,
	(SELECT COUNT(DISTINCT driverId)  FROM taxi_trips2.stat_driver_online_tick WHERE Date(taxi_trips2.stat_driver_online_tick.timestamp) = `date`) onlineDriversCount,
	(SELECT COUNT(*) FROM taxi_accounts.drivers WHERE Date(taxi_accounts.drivers.createdAt) = `date` AND (taxi_accounts.drivers.isActive = 1)) newActiveDriversCount,
	(SELECT COUNT(*) FROM taxi_accounts.customers WHERE Date(taxi_accounts.customers.createdAt) = `date`) newCustomersCount,
	(SELECT COUNT(*) FROM taxi_accounts.customers WHERE Date(taxi_accounts.customers.createdAt) = `date` AND (taxi_accounts.customers.customerStatus = 1)) newActiveCustomerCount
FROM taxi_trips2.time_dimension
WHERE time_dimension.db_date BETWEEN :dateFrom AND :dateTo
GROUP BY date;


-- name: promo_usage
SELECT td.db_date AS 'date', COUNT(trip.id) as 'count' FROM time_dimension td
LEFT JOIN trip ON date(trip.createdAt) = td.db_date AND trip.promoCode = :promoCode AND trip.status in :tripStatus
WHERE td.db_date  BETWEEN :dateFrom AND :dateTo
GROUP BY td.db_date;